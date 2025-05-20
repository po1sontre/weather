const Redis = require('ioredis');
const { del } = require('@vercel/blob');

// Redis connection configuration
let redisConfig = {
    retryStrategy: function(times) {
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3
};

// Parse Redis URL if it exists
if (process.env.REDIS_URL) {
    const redisUrl = new URL(process.env.REDIS_URL);
    redisConfig = {
        ...redisConfig,
        host: redisUrl.hostname,
        port: redisUrl.port,
        password: redisUrl.password,
        tls: {}
    };
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
        redis = new Redis(redisConfig);
        redis.on('error', (err) => console.error('Redis Client Error:', err));
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
        return [];
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
        return false;
    }
}

module.exports = async (req, res) => {
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
        if (req.method === 'DELETE') {
            const { id } = req.query;
            const ads = await getAds();
            const adIndex = ads.findIndex(ad => ad.id === id);
            
            if (adIndex === -1) {
                return res.status(404).json({ error: 'Ad not found' });
            }

            const ad = ads[adIndex];
            
            // Delete image from Vercel Blob
            if (ad.imageUrl) {
                try {
                    await del(ad.imageUrl, {
                        token: process.env.BLOB_READ_WRITE_TOKEN
                    });
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }

            ads.splice(adIndex, 1);
            const saved = await saveAds(ads);
            
            if (!saved) {
                throw new Error('Failed to save ad data after deletion');
            }

            res.json({ message: 'Ad deleted successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
}; 