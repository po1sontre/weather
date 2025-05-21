// /api/ads/change-id.js
const { put, del, list } = require('@vercel/blob');

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

module.exports = async (req, res) => {
    console.log('Request details for change-id:', {
        method: req.method,
        url: req.url,
        path: req.path,
        headers: req.headers,
        hasBody: !!req.body,
        contentType: req.headers['content-type']
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
        if (req.method === 'POST') {
            console.log('Handling POST request for changing ad ID');
            
            // Check if BLOB_READ_WRITE_TOKEN is available
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                console.error('BLOB_READ_WRITE_TOKEN is not configured');
                return res.status(500).json({ 
                    error: 'Server configuration error',
                    details: 'Blob storage is not configured',
                    success: false
                });
            }
            
            // Extract old and new IDs from request body
            const { oldId, newId } = req.body;
            
            if (!oldId || !newId) {
                return res.status(400).json({ 
                    error: 'Missing parameters',
                    details: 'Both oldId and newId are required',
                    success: false
                });
            }
            
            // Get all ads to find the one to update
            const ads = await getAds();
            const adToUpdate = ads.find(ad => ad.id === oldId);
            
            if (!adToUpdate) {
                return res.status(404).json({ 
                    error: 'Ad not found',
                    details: `No ad found with ID: ${oldId}`,
                    success: false
                });
            }
            
            try {
                // Extract file extension from the URL
                const urlParts = adToUpdate.imageUrl.split('/');
                const filename = urlParts[urlParts.length - 1];
                const fileExtension = filename.split('.').pop();
                
                // Get the file content
                const response = await fetch(adToUpdate.imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image content: ${response.statusText}`);
                }
                
                const imageBuffer = await response.arrayBuffer();
                
                // Upload to blob with new filename (ID)
                const newFilename = `${newId}.${fileExtension}`;
                console.log(`Uploading with new filename: ${newFilename}`);
                
                const blob = await put(newFilename, Buffer.from(imageBuffer), {
                    access: 'public',
                    contentType: response.headers.get('content-type') || 'image/jpeg',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                
                // Delete the old blob
                await del(adToUpdate.imageUrl, {
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                
                console.log(`Ad ID changed from ${oldId} to ${newId}`);
                
                res.json({
                    success: true,
                    message: 'Ad ID changed successfully',
                    oldId,
                    newId,
                    newUrl: blob.url
                });
                
            } catch (error) {
                console.error('Error changing ad ID:', error);
                res.status(500).json({
                    error: 'Failed to change ad ID',
                    details: error.message,
                    success: false
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