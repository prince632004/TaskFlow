const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Bring in the bouncer

// Routes that depend on a specific Project ID
router.route('/project/:projectId')
  .post(protect, createTask) // Create a task inside a project
  .get(protect, getTasks);   // Get all tasks for a project

// Routes for interacting with a specific Task ID
router.route('/:id')
  .put(protect, updateTask) // Update a task
  .delete(protect, deleteTask); // Delete a task

module.exports = router;
