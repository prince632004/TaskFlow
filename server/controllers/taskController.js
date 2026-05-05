const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// @desc    Create a new task
// @route   POST /api/tasks/project/:projectId
// @access  Private (Admin Only)
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const { projectId } = req.params;

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Authorization Check: Only the project Admin can create tasks
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the project Admin can create tasks' });
    }

    // 3. Create the task and link it to the project
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo, // The ID of the user responsible for this task
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private (Members and Admin)
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Authorization Check: Ensure the user requesting tasks is actually part of the team
    const isMember = project.members.includes(req.user.id);
    const isAdmin = project.admin.toString() === req.user.id;
    
    if (!isMember && !isAdmin) {
      return res.status(401).json({ message: 'You are not a member of this project' });
    }

    // 3. Fetch all tasks for this project and populate the assignee's name and email
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task (e.g. changing status to 'Done')
// @route   PUT /api/tasks/:id
// @access  Private (Role-Based)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    // 1. Determine User Role for this specific task
    const isAdmin = project.admin.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;

    // 2. Authorization Check
    if (!isAdmin && !isAssignee) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    // 3. Role-Based Update Logic
    if (isAdmin) {
      // The Admin has full power: they can change the title, priority, assigned user, etc.
      Object.assign(task, req.body);
    } else if (isAssignee) {
      // Regular members can ONLY update the 'status' (e.g., from 'To Do' to 'Done')
      if (req.body.status) {
        task.status = req.body.status;
      }
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin Only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);

    // Authorization Check: Only Admin can delete
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the project Admin can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
