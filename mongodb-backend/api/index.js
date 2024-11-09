import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import ideaRoutes from '../routes/ideaRoute.js';
import userRoutes from '../routes/userRoute.js';
import teamRoutes from '../routes/teamRoute.js';
import challengeRoutes from '../routes/challengeRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 30000, // Set the timeout if necessary
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw err;
  }
};


// Call connectDB immediately when the server starts
connectDB();

// Register routes
app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/challenges', challengeRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// If not on Vercel, start the server locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for serverless function on Vercel
export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
