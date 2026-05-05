const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard route protected by our bouncer
router.route('/').get(protect, getDashboardStats);

module.exports = router;
