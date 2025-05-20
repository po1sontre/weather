// Simple authentication endpoint
module.exports = async (req, res) => {
    try {
        // Log the incoming request details
        console.log('Request details:', {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body
        });

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

        // Only allow POST requests
        if (req.method !== 'POST') {
            console.log('Invalid method:', req.method);
            return res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }

        // Ensure request body is parsed
        if (!req.body) {
            console.error('No request body found');
            return res.status(400).json({
                success: false,
                error: 'Request body is required'
            });
        }

        console.log('Login attempt received');
        const { username, password } = req.body;

        // Check if credentials are provided
        if (!username || !password) {
            console.log('Missing credentials:', { 
                hasUsername: !!username, 
                hasPassword: !!password 
            });
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password are required' 
            });
        }

        // Log environment variables (without actual values)
        console.log('Environment check:', {
            hasUsername: !!process.env.ADMIN_USERNAME,
            hasPassword: !!process.env.ADMIN_PASSWORD,
            nodeEnv: process.env.NODE_ENV
        });

        // Compare with environment variables
        if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {
            console.log('Login successful for user:', username);
            return res.json({ 
                success: true, 
                message: 'Login successful' 
            });
        }

        // Invalid credentials
        console.log('Invalid credentials for user:', username);
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid username or password' 
        });
    } catch (error) {
        // Log the full error details
        console.error('Login error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
}; 