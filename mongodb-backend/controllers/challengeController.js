// controllers/challengeController.js
import { upload} from '../middleware/upload.js'; // Adjust path if in `middleware/upload.js`

import Challenge from '../models/challengeModel.js';
import fs from 'fs';
import path from 'path'

// Get all challenges
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('organizers stages.submissions');
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new challenge with file upload
const BASE_URL = process.env.BASE_URL
export const createChallenge = [
  upload.single('thumbnail'),  // Only accept a single file named `thumbnail`
  async (req, res) => {
    try {
      const { title, description, stages, status, category } = req.body;  // Extract category from req.body
      const parsedStages = stages ? JSON.parse(stages) : [];
      const organizerId = req.user?.id; // Replace with actual user ID

       // Construct the full URL for the thumbnail
       const thumbnailUrl = req.file ? `${BASE_URL}/uploads/thumbnails/${req.file.filename}` : null;

      // Create a new Challenge with category
      const newChallenge = new Challenge({
        title,
        description,
        stages: parsedStages,
        organizers: [organizerId],
        thumbnailUrl,
        status,
        category, // Add category to the challenge object
      });

      const savedChallenge = await newChallenge.save();
      res.status(201).json(savedChallenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(400).json({ message: error.message });
    }
  },
];
// Search for challenges by title
export const searchChallenges = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Case-insensitive search using regular expressions
    const challenges = await Challenge.find({
      title: { $regex: title, $options: 'i' } // 'i' for case-insensitive search
    }).populate('organizers stages.submissions');

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add submission to a challenge stage
export const addSubmission = async (req, res) => {
  const { challengeId, stageId } = req.params;
  try {
    const challenge = await Challenge.findById(challengeId);
    const stage = challenge.stages.id(stageId);

    stage.submissions.push(req.body.submissionId);
    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteChallenge = async (req, res) => {
  const { id } = req.params; // Get the challenge ID from the request parameters

  try {
    // Find the challenge by ID
    const challenge = await Challenge.findById(id);

    // If challenge does not exist, return a 404 error
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // If there is a thumbnail, delete it from the filesystem
    if (challenge.thumbnailUrl) {
      const thumbnailPath = path.join(process.cwd(), challenge.thumbnailUrl);
      fs.unlink(thumbnailPath, (err) => {
        if (err) {
          console.error('Failed to delete thumbnail:', err);
        } else {
          console.log('Thumbnail deleted successfully');
        }
      });
    }

    // Delete the challenge from the database
    await Challenge.findByIdAndDelete(id);

    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//create a challenge, delete a challenge, join a challenge, search a challenge
