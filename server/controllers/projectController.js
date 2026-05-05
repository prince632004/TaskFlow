const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel'); // Required to delete associated tasks

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Requires Token)
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a project name' });
    }

    // Create the project in MongoDB
    const project = await Project.create({
      name,
      description,
      admin: req.user.id, // req.user comes from our 'protect' middleware!
      members: [req.user.id], // The creator is automatically added as the first member
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Find projects where the current user is EITHER the admin OR in the members list
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }]
    })
      .populate('admin', 'name email') // .populate() pulls the full user data, not just the ID
      .populate('members', 'name email');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a team member to a project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin Only)
const addMember = async (req, res) => {
  try {
    const { email } = req.body; // Expecting the email of the person to invite
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Authorization Check: Is the logged-in user the admin of this project?
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the project admin can add members' });
    }

    // Find the user we want to add by their email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User to add not found in the system' });
    }

    // Prevent adding the same person twice
    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    // Add them to the array and save to database
    project.members.push(userToAdd._id);
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project and all its tasks
// @route   DELETE /api/projects/:id
// @access  Private (Admin Only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Authorization Check: Is the logged-in user the admin?
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only the project Admin can delete this project' });
    }

    // Cascading Delete: Delete all tasks associated with this project first
    await Task.deleteMany({ project: req.params.id });
    
    // Delete the project itself
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Project and all associated tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  addMember,
  deleteProject
};
