const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // prevent XSS attacks
        sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "development" ? "lax" : "none"),
        secure: process.env.NODE_ENV === "development" ? false : true
    });

    return token;
};

module.exports = generateTokenAndSetCookie;
