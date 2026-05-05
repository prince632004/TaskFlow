const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware'); // Import our security bouncer

// Apply the 'protect' middleware to these routes
// This ensures NO ONE can access these without a valid JWT token
router.route('/')
  .post(protect, createProject)  // Handle POST requests to create a project
  .get(protect, getProjects);    // Handle GET requests to fetch projects

// Route for the Admin to add a member to their project
router.route('/:id/members')
  .put(protect, addMember);

// Route for the Admin to completely delete a project
router.route('/:id')
  .delete(protect, deleteProject);

module.exports = router;
