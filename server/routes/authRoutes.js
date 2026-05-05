const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route for User Registration
// When a POST request hits /api/auth/register, it runs the registerUser function
router.post('/register', registerUser);

// Route for User Login
// When a POST request hits /api/auth/login, it runs the loginUser function
router.post('/login', loginUser);

module.exports = router;
