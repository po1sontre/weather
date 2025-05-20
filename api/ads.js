const { put, del, list } = require('@vercel/blob');
const multer = require('multer');

// Helper function to get ads directly from blob storage
async function getAds() {
    try {
        // List all blobs
        const { blobs } = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        // Convert all image blobs to ads
        const ads = blobs
            .filter(blob => 
                blob.contentType?.startsWith('image/') || 
                blob.pathname.match(/\.(jpg|jpeg|png|gif)$/i)
            )
            .map(blob => ({
                id: blob.pathname.split('/').pop().split('.')[0] || Date.now().toString(),
                imageUrl: blob.url,
                link: '#',
                createdAt: blob.uploadedAt || new Date().toISOString()
            }));

        console.log('Found ads in blob storage:', ads.length);
        return ads;
    } catch (error) {
        console.error('Error getting ads from blob storage:', error);
        return [];
    }
}

// Configure multer with optimized settings
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB limit
        files: 1
    },
    fileFilter: function (req, file, cb) {
        console.log('Processing file:', {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        });

        // Check file size before processing
        if (file.size > 3 * 1024 * 1024) {
            console.error('File too large:', file.size);
            return cb(new Error('File size must be less than 3MB'));
        }

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
    console.log('Request details:', {
        method: req.method,
        url: req.url,
        path: req.path,
        headers: req.headers,
        hasBody: !!req.body,
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length']
    });

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
        console.log('Handling OPTIONS request');
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            console.log('Handling GET request for ads');
            const ads = await getAds();
            res.json(ads);
        } else if (req.method === 'POST') {
            console.log('Handling POST request for ad upload');
            
            // Check if BLOB_READ_WRITE_TOKEN is available
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                console.error('BLOB_READ_WRITE_TOKEN is not configured');
                return res.status(500).json({ 
                    error: 'Server configuration error',
                    details: 'Blob storage is not configured',
                    code: 'CONFIG_ERROR'
                });
            }

            // Handle file upload using multer middleware
            uploadMiddleware(req, res, async function(err) {
                if (err) {
                    console.error('Multer error:', {
                        name: err.name,
                        message: err.message,
                        code: err.code,
                        stack: err.stack
                    });

                    // Handle specific multer errors
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ 
                            error: 'File too large',
                            details: 'Maximum file size is 3MB',
                            code: 'FILE_TOO_LARGE'
                        });
                    }

                    return res.status(400).json({ 
                        error: 'File upload error',
                        details: err.message,
                        code: err.code || 'MULTER_ERROR'
                    });
                }

                if (!req.file) {
                    console.error('No file in request');
                    return res.status(400).json({ 
                        error: 'No image file provided',
                        details: 'Please select an image file to upload',
                        code: 'NO_FILE'
                    });
                }

                try {
                    console.log('Processing file upload:', {
                        filename: req.file.originalname,
                        size: req.file.size,
                        mimetype: req.file.mimetype
                    });

                    // Upload image to Vercel Blob
                    console.log('Uploading to blob storage...');
                    const blob = await put(req.file.originalname, req.file.buffer, {
                        access: 'public',
                        contentType: req.file.mimetype,
                        token: process.env.BLOB_READ_WRITE_TOKEN
                    });

                    if (!blob || !blob.url) {
                        console.error('Blob upload failed:', blob);
                        throw new Error('Failed to upload image to blob storage');
                    }

                    console.log('File uploaded to blob storage:', blob.url);

                    const newAd = {
                        id: blob.pathname.split('/').pop().split('.')[0] || Date.now().toString(),
                        imageUrl: blob.url,
                        link: req.body.link || '#',
                        createdAt: blob.uploadedAt || new Date().toISOString()
                    };

                    console.log('Ad uploaded successfully:', newAd.id);
                    res.json(newAd);
                } catch (error) {
                    console.error('Error processing upload:', {
                        name: error.name,
                        message: error.message,
                        code: error.code,
                        stack: error.stack
                    });

                    // Handle specific blob storage errors
                    if (error.message.includes('blob storage')) {
                        return res.status(500).json({ 
                            error: 'Storage error',
                            details: 'Failed to store the image. Please try again.',
                            code: 'STORAGE_ERROR'
                        });
                    }

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
            const ad = ads.find(ad => ad.id === id);
            
            if (!ad) {
                return res.status(404).json({ error: 'Ad not found' });
            }
            
            // Delete image from Vercel Blob
            try {
                await del(ad.imageUrl, {
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                console.log('Ad deleted successfully:', id);
                res.json({ message: 'Ad deleted successfully' });
            } catch (error) {
                console.error('Error deleting image:', error);
                res.status(500).json({ 
                    error: 'Failed to delete ad',
                    details: error.message,
                    code: 'DELETE_ERROR'
                });
            }
        } else {
            console.log('Method not allowed:', req.method);
            res.status(405).json({ 
                error: 'Method not allowed',
                code: 'METHOD_NOT_ALLOWED'
            });
        }
    } catch (error) {
        console.error('API Error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            code: error.code || 'SERVER_ERROR'
        });
    }
}; 