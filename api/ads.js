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
        const delay = Math.min(times * 50, 2000);
        console.log(`Redis connection retry attempt ${times}, next attempt in ${delay}ms`);
        return delay;
    },
    maxRetriesPerRequest: 3,
    connectTimeout: 10000, // 10 seconds
    enableReadyCheck: true,
    reconnectOnError: function(err) {
        console.error('Redis reconnect on error:', err);
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true; // Reconnect when the error contains "READONLY"
        }
        return false;
    },
    // Add TLS configuration for secure connections
    tls: {
        rejectUnauthorized: false // Required for some Redis providers
    }
};

// Parse Redis URL if it exists
let redisUrl;
if (process.env.REDIS_URL) {
    try {
        redisUrl = new URL(process.env.REDIS_URL);
        redisConfig = {
            ...redisConfig,
            host: redisUrl.hostname,
            port: redisUrl.port,
            password: redisUrl.password,
            db: redisUrl.pathname ? parseInt(redisUrl.pathname.slice(1)) : 0,
            // Keep TLS configuration
            tls: {
                rejectUnauthorized: false
            }
        };
        console.log('Redis configuration loaded from URL:', {
            host: redisUrl.hostname,
            port: redisUrl.port,
            db: redisConfig.db,
            hasPassword: !!redisUrl.password
        });
    } catch (error) {
        console.error('Error parsing Redis URL:', error);
        throw new Error(`Invalid Redis URL configuration: ${error.message}`);
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
let isConnecting = false;
let connectionPromise = null;
let lastError = null;

async function getRedisClient() {
    if (redis && redis.status === 'ready') {
        return redis;
    }

    if (isConnecting) {
        console.log('Redis connection in progress, waiting...');
        return connectionPromise;
    }

    isConnecting = true;
    lastError = null;
    connectionPromise = new Promise((resolve, reject) => {
        try {
            console.log('Creating new Redis client...');
            redis = new Redis(redisConfig);

            redis.on('error', (err) => {
                console.error('Redis Client Error:', err);
                lastError = err;
                isConnecting = false;
                redis = null;
                connectionPromise = null;
            });

            redis.on('connect', () => {
                console.log('Redis client connected successfully');
                isConnecting = false;
                lastError = null;
                resolve(redis);
            });

            redis.on('ready', () => {
                console.log('Redis client ready');
            });

            redis.on('close', () => {
                console.log('Redis connection closed');
                isConnecting = false;
                redis = null;
                connectionPromise = null;
            });

            // Set a timeout for the connection
            setTimeout(() => {
                if (isConnecting) {
                    const error = new Error('Redis connection timeout');
                    console.error('Redis connection timeout');
                    isConnecting = false;
                    redis = null;
                    connectionPromise = null;
                    lastError = error;
                    reject(error);
                }
            }, redisConfig.connectTimeout);

        } catch (error) {
            console.error('Error creating Redis client:', error);
            isConnecting = false;
            redis = null;
            connectionPromise = null;
            lastError = error;
            reject(error);
        }
    });

    return connectionPromise;
}

// Helper function to get ads from Redis
async function getAds() {
    let client;
    try {
        client = await getRedisClient();
        const ads = await client.get('ads');
        if (!ads) {
            console.log('No ads found in Redis, returning empty array');
            return [];
        }
        return JSON.parse(ads);
    } catch (error) {
        console.error('Error getting ads from Redis:', error);
        throw new Error(`Failed to get ads: ${error.message || 'Unknown error'}`);
    }
}

// Helper function to save ads to Redis
async function saveAds(ads) {
    let client;
    try {
        client = await getRedisClient();
        const result = await client.set('ads', JSON.stringify(ads));
        if (result !== 'OK') {
            throw new Error('Redis SET command failed');
        }
        return true;
    } catch (error) {
        console.error('Error saving ads to Redis:', error);
        throw new Error(`Failed to save ads: ${error.message || 'Unknown error'}`);
    }
}

// Create a middleware function to handle multer
const uploadMiddleware = upload.single('image');

module.exports = async (req, res) => {
    console.log('Request method:', req.method);
    console.log('Request path:', req.url);
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
        // Test Redis connection before processing request
        try {
            const client = await getRedisClient();
            await client.ping();
            console.log('Redis connection test successful');
        } catch (error) {
            console.error('Redis connection test failed:', error);
            const errorMessage = lastError ? lastError.message : error.message;
            throw new Error(`Redis connection failed: ${errorMessage}. Please check your Redis configuration and connection details.`);
        }

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
            code: error.code || 'SERVER_ERROR',
            redisError: lastError ? lastError.message : null
        });
    }
}; 