const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Redis = require('ioredis');
const { put, del } = require('@vercel/blob');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Redis connection configuration
const redisConfig = {
    host: process.env.REDIS_URL.split('@')[1].split(':')[0],
    port: parseInt(process.env.REDIS_URL.split(':').pop()),
    password: process.env.REDIS_URL.split('@')[0].split('//')[1].split(':')[1],
    tls: {},
    retryStrategy: function(times) {
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3
};

// Initialize Redis client
let redis;
function getRedisClient() {
    if (!redis) {
        redis = new Redis(redisConfig);
        redis.on('error', (err) => console.error('Redis Client Error:', err));
    }
    return redis;
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));
app.use('/admin', express.static('admin'));

// Multer configuration for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
        cb(null, true);
    }
});

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

// Root route handler
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading page');
    }
});

// API Routes
app.get('/api/ads', async (req, res) => {
    try {
        const ads = await getAds();
        res.json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({ error: 'Failed to fetch ads' });
    }
});

app.post('/api/upload-ad', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
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
            } catch (deleteError) {
                console.error('Error deleting blob after failed Redis save:', deleteError);
            }
            throw new Error('Failed to save ad data');
        }

        res.json(newAd);
    } catch (error) {
        console.error('Error uploading ad:', error);
        res.status(500).json({ 
            error: 'Failed to upload ad',
            details: error.message
        });
    }
});

app.delete('/api/delete-ad/:id', async (req, res) => {
    try {
        const ads = await getAds();
        const adIndex = ads.findIndex(ad => ad.id === req.params.id);
        
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
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ 
            error: 'Failed to delete ad',
            details: error.message
        });
    }
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const ads = await getAds();
        const stats = {
            totalAds: ads.length,
            activeAds: ads.filter(ad => ad.status === 'active').length,
            pendingAds: ads.filter(ad => ad.status === 'pending').length,
            totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
            totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
        };
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch stats',
            details: error.message
        });
    }
});

// Catch-all route handler
app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading page');
    }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app; 