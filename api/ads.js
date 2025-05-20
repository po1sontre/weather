const fs = require('fs').promises;
const path = require('path');
const { put, del } = require('@vercel/blob');
const multer = require('multer');

// File path for storing ads metadata
const ADS_FILE_PATH = path.join(process.cwd(), 'data', 'ads.json');

// Ensure data directory exists
async function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Helper function to get ads from JSON file
async function getAds() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(ADS_FILE_PATH, 'utf8').catch(() => '[]');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading ads file:', error);
        return [];
    }
}

// Helper function to save ads to JSON file
async function saveAds(ads) {
    try {
        await ensureDataDir();
        await fs.writeFile(ADS_FILE_PATH, JSON.stringify(ads, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving ads file:', error);
        return false;
    }
}

// Configure multer with optimized settings
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
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
                        createdAt: new Date().toISOString()
                    };

                    ads.push(newAd);
                    const saved = await saveAds(ads);
                    
                    if (!saved) {
                        // If saving fails, try to delete the uploaded blob
                        try {
                            await del(blob.url);
                            console.log('Deleted blob after failed save');
                        } catch (deleteError) {
                            console.error('Error deleting blob after failed save:', deleteError);
                        }
                        throw new Error('Failed to save ad data');
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
        } else if (req.method === 'DELETE') {
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

// Export getAds function for other modules if needed
module.exports.getAds = getAds; 