const adminRoute = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized - User not found in request" });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
            return res.status(403).json({ error: "Forbidden - Admin access required" });
        }

        next();
    } catch (error) {
        console.error("Error in adminRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { adminRoute };
