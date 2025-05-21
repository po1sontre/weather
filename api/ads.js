const { put, del, list, get } = require('@vercel/blob');
const multer = require('multer');
const METADATA_PATH = 'ads/ads.json';

// Helper to fetch metadata JSON from blob
async function getAdMetadata() {
    try {
        const { blob } = await get(METADATA_PATH, { token: process.env.BLOB_READ_WRITE_TOKEN });
        if (!blob) return [];
        const text = await blob.text();
        return JSON.parse(text);
    } catch (e) {
        // If not found, return empty array
        return [];
    }
}

// Helper to save metadata JSON to blob
async function saveAdMetadata(ads) {
    await put(METADATA_PATH, JSON.stringify(ads, null, 2), {
        access: 'public',
        contentType: 'application/json',
        token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Clean up old JSON files in the ads/ folder
    try {
        const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN, prefix: 'ads/' });
        for (const blob of blobs) {
            if (blob.pathname !== METADATA_PATH && blob.pathname.endsWith('.json')) {
                console.log(`Cleaning up old metadata file: ${blob.pathname}`);
                await del(blob.pathname, { token: process.env.BLOB_READ_WRITE_TOKEN });
            }
        }
    } catch (error) {
        console.error('Error cleaning up old JSON files:', error);
    }
}

// Helper to sync blob images with metadata
async function syncAdsWithBlobs() {
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    const images = blobs.filter(blob => blob.contentType?.startsWith('image/') || blob.pathname.match(/\.(jpg|jpeg|png|gif)$/i));
    let ads = await getAdMetadata();
    let changed = false;
    for (const img of images) {
        if (!ads.find(ad => ad.imageUrl === img.url)) {
            ads.push({
                id: img.pathname.split('/').pop().split('.')[0] || Date.now().toString(),
                imageUrl: img.url,
                link: '#',
                createdAt: img.uploadedAt || new Date().toISOString(),
                status: 'unscheduled',
                impressions: 0,
                clicks: 0,
                name: ''
            });
            changed = true;
        }
    }
    // Remove metadata for images that no longer exist
    const imageUrls = images.map(img => img.url);
    if (ads.length !== images.length) {
        ads = ads.filter(ad => imageUrls.includes(ad.imageUrl));
        changed = true;
    }
    if (changed) await saveAdMetadata(ads);
    return ads;
}

// Helper to compute status
function computeAdStatus(ad) {
    if (!ad.startDate || !ad.endDate) return 'unscheduled';
    
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    
    console.log(`Computing status for ad: ${ad.id}`);
    console.log(`Start date: ${start}, End date: ${end}, Now: ${now}`);
    console.log(`now < start: ${now < start}, now > end: ${now > end}`);
    
    if (now < start) return 'scheduled';
    if (now > end) return 'expired';
    return 'active';
}

// Configure multer with optimized settings
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024, files: 1 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
        cb(null, true);
    }
});

const uploadMiddleware = upload.single('image');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const { name } = req.query;
            let ads = await syncAdsWithBlobs();
            // Always update status before returning
            ads = ads.map(ad => ({ ...ad, status: computeAdStatus(ad) }));
            if (name) {
                ads = ads.filter(ad => ad.name === name);
            }
            res.json(ads);
        } else if (req.method === 'POST') {
            uploadMiddleware(req, res, async function(err) {
                if (err) return res.status(400).json({ error: err.message });
                if (!req.file) return res.status(400).json({ error: 'No image file provided' });
                try {
                    const ads = await getAdMetadata();
                    if (ads.find(ad => ad.name === req.body.name)) {
                        return res.status(400).json({ error: 'Ad name must be unique' });
                    }
                    const blob = await put(req.file.originalname, req.file.buffer, {
                        access: 'public',
                        contentType: req.file.mimetype,
                        token: process.env.BLOB_READ_WRITE_TOKEN
                    });
                    const newAd = {
                        id: blob.pathname.split('/').pop().split('.')[0] || Date.now().toString(),
                        imageUrl: blob.url,
                        link: req.body.link || '#',
                        createdAt: blob.uploadedAt || new Date().toISOString(),
                        status: 'unscheduled',
                        impressions: 0,
                        clicks: 0,
                        name: req.body.name || ''
                    };
                    ads.push(newAd);
                    await saveAdMetadata(ads);
                    res.json(newAd);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            });
        } else if (req.method === 'DELETE') {
            // Expect ?id=... in query
            const id = req.query.id;
            if (!id) return res.status(400).json({ error: 'Missing ad id' });
            let ads = await getAdMetadata();
            const ad = ads.find(a => a.id === id);
            if (!ad) return res.status(404).json({ error: 'Ad not found' });
            // Delete image from blob
            try { await del(ad.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }); } catch {}
            ads = ads.filter(a => a.id !== id);
            await saveAdMetadata(ads);
            res.json({ message: 'Ad deleted successfully' });
        } else if (req.method === 'PATCH') {
            // For scheduling or updating ad metadata
            const { id, startDate, endDate, displayDays, startTime, endTime, priority, ...update } = req.body;
            
            console.log('PATCH request received for ad:', id);
            console.log('Schedule data:', { startDate, endDate, displayDays, startTime, endTime, priority });
            
            if (!id) return res.status(400).json({ error: 'Missing ad id' });
            
            let ads = await getAdMetadata();
            const idx = ads.findIndex(a => a.id === id);
            if (idx === -1) return res.status(404).json({ error: 'Ad not found' });
            
            // Update all schedule fields if present
            if (startDate) ads[idx].startDate = startDate;
            if (endDate) ads[idx].endDate = endDate;
            if (displayDays) ads[idx].displayDays = displayDays || [0, 1, 2, 3, 4, 5, 6];
            if (startTime) ads[idx].startTime = startTime || '00:00';
            if (endTime) ads[idx].endTime = endTime || '23:59';
            if (priority !== undefined) ads[idx].priority = priority || 5;
            
            // Update any other fields (like name, link)
            Object.assign(ads[idx], update);
            
            // Always update status if we have schedule data
            if (ads[idx].startDate && ads[idx].endDate) {
                ads[idx].status = computeAdStatus(ads[idx]);
                console.log(`Updated ad ${id} status to: ${ads[idx].status}`);
            }
            
            await saveAdMetadata(ads);
            res.json(ads[idx]);
        } else if (req.method === 'POST' && req.url.endsWith('/impression')) {
            // Track impression
            const id = req.url.split('/').slice(-2)[0];
            let ads = await getAdMetadata();
            const idx = ads.findIndex(a => a.id === id);
            if (idx === -1) return res.status(404).json({ error: 'Ad not found' });
            ads[idx].impressions = (ads[idx].impressions || 0) + 1;
            await saveAdMetadata(ads);
            res.json({ success: true, impressions: ads[idx].impressions });
        } else if (req.method === 'POST' && req.url.endsWith('/click')) {
            // Track click
            const id = req.url.split('/').slice(-2)[0];
            let ads = await getAdMetadata();
            const idx = ads.findIndex(a => a.id === id);
            if (idx === -1) return res.status(404).json({ error: 'Ad not found' });
            ads[idx].clicks = (ads[idx].clicks || 0) + 1;
            await saveAdMetadata(ads);
            res.json({ success: true, clicks: ads[idx].clicks });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 