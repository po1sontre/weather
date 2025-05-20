const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/ads/images', express.static('ads/images'));

// Ensure required directories exist
const adsDir = path.join(__dirname, 'ads');
const imagesDir = path.join(adsDir, 'images');
const adsJsonPath = path.join(adsDir, 'ads.json');

if (!fs.existsSync(adsDir)) {
    fs.mkdirSync(adsDir);
}
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(adsJsonPath)) {
    fs.writeFileSync(adsJsonPath, JSON.stringify([]));
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ads/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
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

// API Routes
app.get('/api/ads', (req, res) => {
    try {
        const ads = JSON.parse(fs.readFileSync(adsJsonPath, 'utf8'));
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ads' });
    }
});

app.post('/api/upload-ad', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const ads = JSON.parse(fs.readFileSync(adsJsonPath, 'utf8'));
        const newAd = {
            id: Date.now().toString(),
            imageUrl: `/ads/images/${req.file.filename}`,
            link: req.body.link || '#',
            createdAt: new Date().toISOString(),
            status: 'active',
            impressions: 0,
            clicks: 0
        };

        ads.push(newAd);
        fs.writeFileSync(adsJsonPath, JSON.stringify(ads, null, 2));
        res.json(newAd);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload ad' });
    }
});

app.delete('/api/delete-ad/:id', (req, res) => {
    try {
        const ads = JSON.parse(fs.readFileSync(adsJsonPath, 'utf8'));
        const adIndex = ads.findIndex(ad => ad.id === req.params.id);
        
        if (adIndex === -1) {
            return res.status(404).json({ error: 'Ad not found' });
        }

        const ad = ads[adIndex];
        const imagePath = path.join(__dirname, ad.imageUrl);
        
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        ads.splice(adIndex, 1);
        fs.writeFileSync(adsJsonPath, JSON.stringify(ads, null, 2));
        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ad' });
    }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
    try {
        const ads = JSON.parse(fs.readFileSync(adsJsonPath, 'utf8'));
        const stats = {
            totalAds: ads.length,
            activeAds: ads.filter(ad => ad.status === 'active').length,
            pendingAds: ads.filter(ad => ad.status === 'pending').length,
            totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
            totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
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