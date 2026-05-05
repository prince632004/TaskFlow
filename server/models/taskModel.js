const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Only allows these 3 values
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'], // Only allows these 3 values
    default: 'To Do',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true, // A task must belong to a project
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The team member responsible for this task
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
