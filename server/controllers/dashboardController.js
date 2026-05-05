const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// @desc    Get dashboard statistics for the logged-in user
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // 1. Find all projects the user is involved in (either as Admin or a Member)
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }]
    });

    // Extract just the IDs of those projects into an array (e.g. ['id1', 'id2'])
    const projectIds = projects.map(project => project._id);

    // 2. Fetch ALL tasks that belong to ANY of those projects
    // The $in operator finds tasks where the 'project' field matches any ID in our array
    const allTasks = await Task.find({ project: { $in: projectIds } });

    // 3. Calculate all the required Dashboard Statistics
    const totalTasks = allTasks.length;
    
    // Status breakdown using JavaScript array filters
    const todoTasks = allTasks.filter(task => task.status === 'To Do').length;
    const inProgressTasks = allTasks.filter(task => task.status === 'In Progress').length;
    const doneTasks = allTasks.filter(task => task.status === 'Done').length;

    // Overdue tasks: Due date is in the past AND it's not completed yet
    const currentDate = new Date();
    const overdueTasks = allTasks.filter(task => {
      // Check if task has a due date, if it's before today, and if it's not done
      return task.dueDate && new Date(task.dueDate) < currentDate && task.status !== 'Done';
    }).length;

    // Tasks specifically assigned to the logged-in user
    const myTasks = allTasks.filter(task => 
      task.assignedTo && task.assignedTo.toString() === req.user.id
    ).length;

    // 4. Send the compiled data package back to the frontend
    res.status(200).json({
      totalProjects: projects.length,
      totalTasks,
      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks
      },
      overdueTasks,
      myTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
