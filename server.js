const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { kv } = require('@vercel/kv');
const { put, del } = require('@vercel/blob');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

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

// Helper function to get ads from KV
async function getAds() {
    const ads = await kv.get('ads') || [];
    return ads;
}

// Helper function to save ads to KV
async function saveAds(ads) {
    await kv.set('ads', ads);
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

        // Upload image to Vercel Blob
        const blob = await put(req.file.originalname, req.file.buffer, {
            access: 'public',
            contentType: req.file.mimetype
        });

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
        await saveAds(ads);
        res.json(newAd);
    } catch (error) {
        console.error('Error uploading ad:', error);
        res.status(500).json({ error: 'Failed to upload ad' });
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
                await del(ad.imageUrl);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        ads.splice(adIndex, 1);
        await saveAds(ads);
        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ error: 'Failed to delete ad' });
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
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app; 