const Redis = require('ioredis');
const { put, del } = require('@vercel/blob');
const multer = require('multer');

// Redis connection configuration
let redisConfig = {
    retryStrategy: function(times) {
        const delay = Math.min(times * 50, 1000); // Reduced max delay to 1 second
        console.log(`Redis connection retry attempt ${times}, next attempt in ${delay}ms`);
        return delay;
    },
    maxRetriesPerRequest: 2, // Reduced retries
    connectTimeout: 5000, // Reduced timeout to 5 seconds
    commandTimeout: 3000, // Added command timeout
    enableReadyCheck: true,
    reconnectOnError: function(err) {
        console.error('Redis reconnect on error:', err);
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    },
    tls: {
        rejectUnauthorized: false
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

// Initialize Redis client with connection pooling
let redisPool = [];
const MAX_POOL_SIZE = 2;
let isConnecting = false;
let connectionPromise = null;
let lastError = null;

async function getRedisClient() {
    // Try to get an existing ready connection from the pool
    const readyClient = redisPool.find(client => client.status === 'ready');
    if (readyClient) {
        return readyClient;
    }

    // If we have less than MAX_POOL_SIZE connections, create a new one
    if (redisPool.length < MAX_POOL_SIZE) {
        if (isConnecting) {
            console.log('Redis connection in progress, waiting...');
            return connectionPromise;
        }

        isConnecting = true;
        lastError = null;
        connectionPromise = new Promise((resolve, reject) => {
            try {
                console.log('Creating new Redis client...');
                const client = new Redis(redisConfig);

                client.on('error', (err) => {
                    console.error('Redis Client Error:', err);
                    lastError = err;
                    const index = redisPool.indexOf(client);
                    if (index > -1) {
                        redisPool.splice(index, 1);
                    }
                });

                client.on('connect', () => {
                    console.log('Redis client connected successfully');
                    isConnecting = false;
                    lastError = null;
                    redisPool.push(client);
                    resolve(client);
                });

                client.on('ready', () => {
                    console.log('Redis client ready');
                });

                client.on('close', () => {
                    console.log('Redis connection closed');
                    const index = redisPool.indexOf(client);
                    if (index > -1) {
                        redisPool.splice(index, 1);
                    }
                });

                // Set a timeout for the connection
                setTimeout(() => {
                    if (isConnecting) {
                        const error = new Error('Redis connection timeout');
                        console.error('Redis connection timeout');
                        isConnecting = false;
                        lastError = error;
                        reject(error);
                    }
                }, redisConfig.connectTimeout);

            } catch (error) {
                console.error('Error creating Redis client:', error);
                isConnecting = false;
                lastError = error;
                reject(error);
            }
        });

        return connectionPromise;
    }

    // If we have MAX_POOL_SIZE connections but none are ready, wait for one to become ready
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            const readyClient = redisPool.find(client => client.status === 'ready');
            if (readyClient) {
                clearInterval(checkInterval);
                resolve(readyClient);
            }
        }, 100);

        // Set a timeout for waiting
        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('No available Redis connections'));
        }, redisConfig.connectTimeout);
    });
}

// Helper function to get ads from Redis with timeout
async function getAds() {
    let client;
    try {
        client = await getRedisClient();
        const ads = await Promise.race([
            client.get('ads'),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Redis get timeout')), redisConfig.commandTimeout)
            )
        ]);
        
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

// Helper function to save ads to Redis with timeout
async function saveAds(ads) {
    let client;
    try {
        client = await getRedisClient();
        const result = await Promise.race([
            client.set('ads', JSON.stringify(ads)),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Redis set timeout')), redisConfig.commandTimeout)
            )
        ]);
        
        if (result !== 'OK') {
            throw new Error('Redis SET command failed');
        }
        return true;
    } catch (error) {
        console.error('Error saving ads to Redis:', error);
        throw new Error(`Failed to save ads: ${error.message || 'Unknown error'}`);
    }
}

// Configure multer with optimized settings
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // Reduced to 2MB
        files: 1
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

// Create a middleware function to handle multer
const uploadMiddleware = upload.single('image');

module.exports = async (req, res) => {
    console.log('Request method:', req.method);
    console.log('Request path:', req.url);

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
            await Promise.race([
                client.ping(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Redis ping timeout')), redisConfig.commandTimeout)
                )
            ]);
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

                    // Upload image to Vercel Blob with timeout
                    const blob = await Promise.race([
                        put(req.file.originalname, req.file.buffer, {
                            access: 'public',
                            contentType: req.file.mimetype,
                            token: process.env.BLOB_READ_WRITE_TOKEN
                        }),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Blob upload timeout')), 10000)
                        )
                    ]);

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
                            await Promise.race([
                                del(blob.url),
                                new Promise((_, reject) => 
                                    setTimeout(() => reject(new Error('Blob delete timeout')), 5000)
                                )
                            ]);
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