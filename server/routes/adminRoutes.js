const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const { adminRoute } = require('../middleware/adminMiddleware');
const {
    getDashboardStats,
    getUsers,
    updateUser,
    deleteUser,
    changeUserPassword,
    getReports,
    updateReport,
    getLoginLogs
} = require('../controllers/adminController');

const router = express.Router();

// All routes here require the user to be logged in and be an admin/moderator
router.use(protectRoute, adminRoute);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUser);
router.patch('/users/:id/password', changeUserPassword);
router.delete('/users/:id', deleteUser);


// Reports
router.get('/reports', getReports);
router.patch('/reports/:id/status', updateReport);

// Logs
router.get('/logs/logins', getLoginLogs);

module.exports = router;
