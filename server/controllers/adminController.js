const User = require('../models/userModel');
const Message = require('../models/messageModel');
const Report = require('../models/reportModel');
const LoginLog = require('../models/loginLogModel');

// 1. Get Dashboard Analytics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            activeUsers,
            onlineUsers,
            messagesToday,
            totalMessages,
            openReports
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'Active' }),
            User.countDocuments({ isOnline: true }),
            Message.countDocuments({ createdAt: { $gte: today } }),
            Message.countDocuments(),
            Report.countDocuments({ status: 'Pending' })
        ]);

        // Generate mock-like but real 7-day chart data for messages
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const chartData = await Promise.all(last7Days.map(async (date, i) => {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const count = await Message.countDocuments({
                createdAt: { $gte: date, $lt: nextDay }
            });
            return count;
        }));

        res.status(200).json({
            stats: {
                totalUsers,
                activeUsers,
                onlineUsers,
                messagesToday,
                totalMessages,
                openReports
            },
            chartData
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error.message);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

// 2. Get Users (with Search and Pagination)
exports.getUsers = async (req, res) => {
    try {
        const { query = '', filter = 'All', page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        let dbQuery = {};
        if (query) {
            dbQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } }
                ]
            };
        }

        if (filter !== 'All') {
            dbQuery.status = filter; // Active, Suspended, Banned
        }

        const users = await User.find(dbQuery)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(dbQuery);

        res.status(200).json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error in getUsers:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// 3. Update User Status/Role
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (role) {
            // Only super admin might change roles, but we'll allow it for now if req.user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Only admins can change roles' });
            }
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in updateUser:', error.message);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// 4. Delete User Permanently
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[deleteUser] Request by user '${req.user.username}' (Role: '${req.user.role}') to delete user ID: '${id}'`);

        if (req.user.role !== 'admin') {
            console.log(`[deleteUser] Access denied: User is not an admin.`);
            return res.status(403).json({ error: 'Only admins can delete users' });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            console.log(`[deleteUser] User ID '${id}' not found.`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`[deleteUser] User '${deletedUser.username}' successfully deleted.`);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error.message);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

// 5. Get Reports
exports.getReports = async (req, res) => {
    try {
        const { status = 'All' } = req.query;
        let dbQuery = {};
        if (status !== 'All') {
            dbQuery.status = status;
        }

        const reports = await Report.find(dbQuery)
            .populate('reporter', 'name email username')
            .populate('targetUser', 'name email username')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json(reports);
    } catch (error) {
        console.error('Error in getReports:', error.message);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

// 6. Update Report Status
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Report.findByIdAndUpdate(id, { status }, { new: true })
            .populate('reporter', 'name email username')
            .populate('targetUser', 'name email username');
            
        if (!report) return res.status(404).json({ error: 'Report not found' });

        res.status(200).json(report);
    } catch (error) {
        console.error('Error in updateReport:', error.message);
        res.status(500).json({ error: 'Failed to update report' });
    }
};

// 7. Get Login Logs
exports.getLoginLogs = async (req, res) => {
    try {
        const logs = await LoginLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error in getLoginLogs:', error.message);
        res.status(500).json({ error: 'Failed to fetch login logs' });
    }
};

// 8. Change User Password directly from Admin Panel
exports.changeUserPassword = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can change user passwords' });
        }
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in changeUserPassword:', error.message);
        res.status(500).json({ error: 'Failed to change user password' });
    }
};

