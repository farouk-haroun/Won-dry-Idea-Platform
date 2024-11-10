import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
import ideaRoutes from './routes/ideaRoute.js';
import userRoutes from './routes/userRoute.js';
import teamRoutes from './routes/teamRoute.js';
import challengeRoutes from './routes/challengeRoute.js';

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:4000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection and GridFS Setup
const connectDB = async () => {
  const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'wondry_platform';
  const MONGO_URI = `${process.env.MONGO_URI}${dbName}`;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit process with failure
  }
};

// Basic Route for API Status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Registering Routes After Database Connection
const startServer = async () => {
  await connectDB();

  // Register routes only after DB connection is successful
  app.use('/api/ideas', ideaRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/challenges', challengeRoutes);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export the app for use in tests
export { app };
export default app;
