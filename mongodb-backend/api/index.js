import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Importing routes
import ideaRoutes from '../routes/ideaRoute.js';
import userRoutes from '../routes/userRoute.js';
import teamRoutes from '../routes/teamRoute.js';
import challengeRoutes from '../routes/challengeRoute.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Use environment variable for frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(`${process.env.MONGO_URI}${process.env.NODE_ENV === 'test' ? 'test' : 'wondry_platform'}`, {
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw new Error('MongoDB connection failed');
  }
};

app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/challenges', challengeRoutes);

app.get('/', (req, res) => res.send('API is running...'));

export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
