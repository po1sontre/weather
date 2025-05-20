const express = require('express');
const router = express.Router();

// Simple authentication endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if credentials are provided
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username and password are required' 
        });
    }

    // Compare with environment variables
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        return res.json({ 
            success: true, 
            message: 'Login successful' 
        });
    }

    // Invalid credentials
    return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
    });
});

module.exports = router; 