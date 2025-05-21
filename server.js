const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { put, del } = require('@vercel/blob');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
// Serve components directory
app.use('/components', express.static(path.join(__dirname, 'components')));

// Import API routes
const adsApi = require('./api/ads');
const authApi = require('./api/auth');

// API Routes
app.use('/api/ads', adsApi);
app.use('/api/upload-ad', adsApi);
app.use('/api/auth', authApi);

// Root route handler - serve index.html from public directory
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading page');
    }
});

// Handler for /gen route - serve gen.html from public directory
app.get('/gen', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'gen.html'));
    } catch (error) {
        console.error('Error serving gen.html:', error);
        res.status(500).send('Error loading page');
    }
});

// Catch-all route handler - serve index.html for all other routes
app.get('*', (req, res) => {
    try {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api/')) {
            res.status(404).json({ error: 'API endpoint not found' });
            return;
        }
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading page');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message,
        code: err.code || 'SERVER_ERROR'
    });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app; 