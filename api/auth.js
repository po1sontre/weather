const express = require('express');
const router = express.Router();

// Simple authentication endpoint
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt received');
        const { username, password } = req.body;

        // Check if credentials are provided
        if (!username || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password are required' 
            });
        }

        // Log environment variables (without actual values)
        console.log('Environment check:', {
            hasUsername: !!process.env.ADMIN_USERNAME,
            hasPassword: !!process.env.ADMIN_PASSWORD
        });

        // Compare with environment variables
        if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {
            console.log('Login successful');
            return res.json({ 
                success: true, 
                message: 'Login successful' 
            });
        }

        // Invalid credentials
        console.log('Invalid credentials');
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid username or password' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router; 