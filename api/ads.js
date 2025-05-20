const Redis = require('ioredis');
const { put, del } = require('@vercel/blob');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB limit
    },
    fileFilter: function (req, file, cb) {
        console.log('Processing file:', file.originalname, 'MIME type:', file.mimetype);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            console.error('Invalid file type:', file.mimetype);
            return cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
        cb(null, true);
    }
});

// Redis connection configuration
let redisConfig = {
    retryStrategy: function(times) {
        console.log('Redis retry attempt:', times);
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3
};

// Parse Redis URL if it exists
if (process.env.REDIS_URL) {
    try {
        const redisUrl = new URL(process.env.REDIS_URL);
        redisConfig = {
            ...redisConfig,
            host: redisUrl.hostname,
            port: redisUrl.port,
            password: redisUrl.password,
            tls: {}
        };
        console.log('Redis configuration loaded from URL');
    } catch (error) {
        console.error('Error parsing Redis URL:', error);
        throw new Error('Invalid Redis URL configuration');
    }
} else {
    console.warn('REDIS_URL not set. Using default Redis configuration.');
    redisConfig = {
        ...redisConfig,
        host: 'localhost',
        port: 6379
    };
}

// Initialize Redis client
let redis;
function getRedisClient() {
    if (!redis) {
        try {
            redis = new Redis(redisConfig);
            redis.on('error', (err) => {
                console.error('Redis Client Error:', err);
                // Reset redis client on error to allow reconnection
                redis = null;
            });
            redis.on('connect', () => console.log('Redis client connected'));
            return redis;
        } catch (error) {
            console.error('Error creating Redis client:', error);
            throw new Error('Failed to initialize Redis client');
        }
    }
    return redis;
}

// Helper function to get ads from Redis
async function getAds() {
    try {
        const client = getRedisClient();
        const ads = await client.get('ads');
        return ads ? JSON.parse(ads) : [];
    } catch (error) {
        console.error('Error getting ads from Redis:', error);
        throw new Error(`Failed to get ads: ${error.message}`);
    }
}

// Helper function to save ads to Redis
async function saveAds(ads) {
    try {
        const client = getRedisClient();
        await client.set('ads', JSON.stringify(ads));
        return true;
    } catch (error) {
        console.error('Error saving ads to Redis:', error);
        throw new Error(`Failed to save ads: ${error.message}`);
    }
}

// Create a middleware function to handle multer
const uploadMiddleware = upload.single('image');

module.exports = async (req, res) => {
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const ads = await getAds();
            res.json(ads);
        } else if (req.method === 'POST') {
            // Handle file upload using multer middleware
            uploadMiddleware(req, res, async function(err) {
                if (err) {
                    console.error('Multer error:', err);
                    return res.status(400).json({ 
                        error: 'File upload error',
                        details: err.message,
                        code: 'MULTER_ERROR'
                    });
                }

                if (!req.file) {
                    console.error('No file in request');
                    return res.status(400).json({ 
                        error: 'No image file provided',
                        code: 'NO_FILE'
                    });
                }

                try {
                    console.log('Processing file upload:', {
                        filename: req.file.originalname,
                        size: req.file.size,
                        mimetype: req.file.mimetype
                    });

                    // Check if BLOB_READ_WRITE_TOKEN is available
                    if (!process.env.BLOB_READ_WRITE_TOKEN) {
                        throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
                    }

                    // Upload image to Vercel Blob
                    const blob = await put(req.file.originalname, req.file.buffer, {
                        access: 'public',
                        contentType: req.file.mimetype,
                        token: process.env.BLOB_READ_WRITE_TOKEN
                    });

                    if (!blob || !blob.url) {
                        throw new Error('Failed to upload image to blob storage');
                    }

                    console.log('File uploaded to blob storage:', blob.url);

                    const ads = await getAds();
                    const newAd = {
                        id: Date.now().toString(),
                        imageUrl: blob.url,
                        link: req.body.link || '#',
                        createdAt: new Date().toISOString(),
                        status: 'active',
                        impressions: 0,
                        clicks: 0
                    };

                    ads.push(newAd);
                    const saved = await saveAds(ads);
                    
                    if (!saved) {
                        // If saving to Redis fails, try to delete the uploaded blob
                        try {
                            await del(blob.url);
                            console.log('Deleted blob after failed Redis save');
                        } catch (deleteError) {
                            console.error('Error deleting blob after failed Redis save:', deleteError);
                        }
                        throw new Error('Failed to save ad data to Redis');
                    }

                    console.log('Ad saved successfully:', newAd.id);
                    res.json(newAd);
                } catch (error) {
                    console.error('Error processing upload:', error);
                    res.status(500).json({ 
                        error: 'Failed to process upload',
                        details: error.message,
                        code: error.code || 'UPLOAD_ERROR'
                    });
                }
            });
        } else {
            res.status(405).json({ 
                error: 'Method not allowed',
                code: 'METHOD_NOT_ALLOWED'
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            code: error.code || 'SERVER_ERROR'
        });
    }
}; 