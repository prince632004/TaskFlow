const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Connects auth routes
app.use('/api/projects', require('./routes/projectRoutes')); // Connects project routes
app.use('/api/tasks', require('./routes/taskRoutes')); // Connects task routes
app.use('/api/dashboard', require('./routes/dashboardRoutes')); // Connects dashboard routes

// Basic test route
app.get('/', (req, res) => {
  res.send('Team Task Manager API is running...');
});

// Start the server (Only if not running in a serverless environment like Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel Serverless Functions
module.exports = app;
