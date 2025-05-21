const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Redis = require('ioredis');
const { put, del } = require('@vercel/blob');
require('dotenv').config();

const app = express();

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

        // Validate scheduling data
        const {
            startDate,
            endDate,
            displayDays,
            startTime,
            endTime,
            priority,
            link
        } = req.body;

        // Validate required fields
        if (!startDate || !endDate || !displayDays || !startTime || !endTime) {
            return res.status(400).json({ error: 'Missing required scheduling information' });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        if (start >= end) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        // Validate display days
        const days = Array.isArray(displayDays) ? displayDays : [displayDays];
        if (!days.every(day => !isNaN(day) && day >= 0 && day <= 6)) {
            return res.status(400).json({ error: 'Invalid display days' });
        }

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({ error: 'Invalid time format' });
        }

        // Validate priority
        const adPriority = parseInt(priority) || 5;
        if (adPriority < 1 || adPriority > 10) {
            return res.status(400).json({ error: 'Priority must be between 1 and 10' });
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
            link: link || '#',
            createdAt: new Date().toISOString(),
            startDate,
            endDate,
            displayDays: days,
            startTime,
            endTime,
            priority: adPriority,
            status: 'scheduled',
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

// Track ad impression
app.post('/api/ads/:id/impression', async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await getAds();
        const adIndex = ads.findIndex(ad => ad.id === id);
        
        if (adIndex === -1) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        ads[adIndex].impressions = (ads[adIndex].impressions || 0) + 1;
        await saveAds(ads);
        
        res.json({ success: true, impressions: ads[adIndex].impressions });
    } catch (error) {
        console.error('Error tracking impression:', error);
        res.status(500).json({ error: 'Failed to track impression' });
    }
});

// Track ad click
app.post('/api/ads/:id/click', async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await getAds();
        const adIndex = ads.findIndex(ad => ad.id === id);
        
        if (adIndex === -1) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        ads[adIndex].clicks = (ads[adIndex].clicks || 0) + 1;
        await saveAds(ads);
        
        res.json({ success: true, clicks: ads[adIndex].clicks });
    } catch (error) {
        console.error('Error tracking click:', error);
        res.status(500).json({ error: 'Failed to track click' });
    }
});

// Get ad stats with scheduling information
app.get('/api/stats', async (req, res) => {
    try {
        const ads = await getAds();
        const now = new Date();
        
        const stats = {
            totalAds: ads.length,
            activeAds: ads.filter(ad => {
                const start = new Date(ad.startDate);
                const end = new Date(ad.endDate);
                return now >= start && now <= end;
            }).length,
            scheduledAds: ads.filter(ad => {
                const start = new Date(ad.startDate);
                return now < start;
            }).length,
            expiredAds: ads.filter(ad => {
                const end = new Date(ad.endDate);
                return now > end;
            }).length,
            totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
            totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
            adsByDay: ads.reduce((acc, ad) => {
                ad.displayDays.forEach(day => {
                    acc[day] = (acc[day] || 0) + 1;
                });
                return acc;
            }, {}),
            adsByPriority: ads.reduce((acc, ad) => {
                const priority = ad.priority || 5;
                acc[priority] = (acc[priority] || 0) + 1;
                return acc;
            }, {})
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

// Export the Express API
module.exports = app; 