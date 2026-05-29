const User = require('../models/userModel.js');
const LoginLog = require('../models/loginLogModel.js');
const generateTokenAndSetCookie = require('../utils/generateToken.js');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password
        });

        if (newUser) {
            // Generate JWT token
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
                bio: newUser.bio,
                role: newUser.role
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await user?.comparePassword(password);

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        if (user.status === 'Banned') {
            return res.status(403).json({ error: "Your account has been banned." });
        }

        if (user.status === 'Suspended') {
            return res.status(403).json({ error: "Your account is temporarily suspended." });
        }

        // Log the login
        try {
            await LoginLog.create({
                user: user._id,
                ip: req.ip || req.headers['x-forwarded-for'] || 'Unknown',
                device: req.headers['user-agent'] || 'Unknown'
            });
            
            // Update lastActive and ip on the user object
            user.lastActive = new Date();
            user.ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
            await user.save();
        } catch (logError) {
            console.error("Failed to save login log:", logError);
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "development" ? "lax" : "none"),
            secure: process.env.NODE_ENV === "development" ? false : true
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getMe = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(200).json(null);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(200).json(null);
        }

        if (!decoded) {
            return res.status(200).json(null);
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(200).json(null);
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(200).json(null);
    }
};

module.exports = { signup, login, logout, getMe };
