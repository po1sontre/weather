const Redis = require('ioredis');

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

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
            const stats = {
                totalAds: ads.length,
                activeAds: ads.filter(ad => ad.status === 'active').length,
                pendingAds: ads.filter(ad => ad.status === 'pending').length,
                totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
                totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
            };
            res.json(stats);
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