const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate admin-specific JWT token (shorter expiry for security)
const generateAdminToken = (userId) => {
    return jwt.sign(
        { userId, isAdminToken: true },
        process.env.JWT_SECRET,
        { expiresIn: '8h' } // Admin sessions expire after 8 hours
    );
};

// POST /api/admin-auth/login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        // Check if account is active
        if (user.status === 'Banned' || user.status === 'Suspended') {
            return res.status(403).json({ error: `Account is ${user.status.toLowerCase()}. Contact support.` });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateAdminToken(user._id);

        // Set secure HTTP-only cookie
        res.cookie('admin_jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
        });

        // Update last active
        user.lastActive = new Date();
        await user.save();

        res.status(200).json({
            message: 'Admin login successful',
            token, // Also send in response for localStorage fallback
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            }
        });

    } catch (error) {
        console.error('Error in adminLogin:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/admin-auth/logout
exports.adminLogout = async (req, res) => {
    try {
        // Clear admin cookie
        res.cookie('admin_jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ message: 'Admin logged out successfully' });
    } catch (error) {
        console.error('Error in adminLogout:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/admin-auth/me
exports.getAdminMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        });
    } catch (error) {
        console.error('Error in getAdminMe:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
