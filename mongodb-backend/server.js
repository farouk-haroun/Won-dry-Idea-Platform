import express from 'express';  // Import Express
import mongoose from 'mongoose';  // Import Mongoose
import dotenv from 'dotenv';  // Import dotenv
import cors from 'cors';  // Import CORS middleware

// Importing routes
import ideaRoutes from './routes/ideaRoute.js';  // Import ideaRoute
import userRoutes from './routes/userRoute.js';  // Import userRoute
import teamRoutes from './routes/teamRoute.js';  // Import teamRoute
import challengeRoutes from './routes/challengeRoute.js';  // Import challengeRoute

// Configure dotenv to load environment variables
dotenv.config();  // Load environment variables from .env file

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Replace with Render frontend domain in production
  credentials: true,  // Allow credentials (cookies, headers)
};
app.use(cors(corsOptions));  // Apply the CORS middleware with options

// MongoDB connection
const connectDB = async () => {
  const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'wondry_platform';
  const MONGO_URI = `${process.env.MONGO_URI}${dbName}`;
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
app.use('/api/ideas', ideaRoutes);  // Register the idea routes under /api/ideas
app.use('/api/users', (req, res, next) => {
  console.log('User route accessed');
  next();
}, userRoutes);
app.use('/api/teams', teamRoutes);  // Register the team routes under /api/teams
app.use('/api/challenges', challengeRoutes);  // Register the challenge routes under /api/challenges

// Connect to the database and start the server
connectDB().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});

// Export the app for use in tests
export default app;
