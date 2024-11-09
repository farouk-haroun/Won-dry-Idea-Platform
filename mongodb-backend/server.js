import express from 'express';  // Import Express
import mongoose from 'mongoose';  // Import Mongoose
import dotenv from 'dotenv';  // Import dotenv for environment variables
import cors from 'cors';  // Import CORS middleware

// Importing routes
import ideaRoutes from './routes/ideaRoute.js';  // Import ideaRoute
import userRoutes from './routes/userRoute.js';  // Import userRoute
import teamRoutes from './routes/teamRoute.js';  // Import teamRoute
import challengeRoutes from './routes/challengeRoute.js';  // Import challengeRoute

// Load environment variables from .env file
dotenv.config();  

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Set origin to frontend URL in production
  credentials: true,  // Allow credentials (cookies, headers)
};
app.use(cors(corsOptions));  // Apply CORS middleware

// MongoDB Connection Function
const connectDB = async () => {
  const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'wondry_platform';
  const MONGO_URI = `${process.env.MONGO_URI}${dbName}`;
  try {
    await mongoose.connect(MONGO_URI);  // Connect to MongoDB (options are now default)
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);  // Exit process with failure
  }
};

// Basic Route for API Status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Registering routes
app.use('/api/ideas', ideaRoutes);  // Register idea routes
app.use('/api/users', (req, res, next) => {
  console.log('User route accessed');  // Log user route access
  next();
}, userRoutes);
app.use('/api/teams', teamRoutes);  // Register team routes
app.use('/api/challenges', challengeRoutes);  // Register challenge routes

// Connect to the database and start the server
connectDB().then(() => {
  if (process.env.NODE_ENV !== 'test') {  // Start server if not in test mode
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});

// Export the app for use in tests
export default app;
