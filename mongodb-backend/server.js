const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Importing routes (with the correct filenames)
const ideaRoutes = require('./routes/ideaRoute'); // Import ideaRoute
const userRoutes = require('./routes/userRoute'); // Import userRoute
const teamRoutes = require('./routes/teamRoute'); // Import teamRoute
const challengeRoutes = require('./routes/challengeRoute'); // Import challengeRoute

dotenv.config();  // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Registering routes here with corrected imports
app.use('/api/ideas', ideaRoutes); // Register the idea routes under /api/ideas
app.use('/api/users', (req, res, next) => {
  console.log('User route accessed');
  next();
}, userRoutes);
app.use('/api/teams', teamRoutes); // Register the team routes under /api/teams
app.use('/api/challenges', challengeRoutes); // Register the challenge routes under /api/challenges


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to the database
connectDB();
