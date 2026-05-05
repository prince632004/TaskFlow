const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId, // Connects to the User model
    ref: 'User',
    required: true, // A project must have a creator (Admin)
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Array of users who have joined the project
    }
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
