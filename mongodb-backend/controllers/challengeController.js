// controllers/challengeController.js
import { upload} from '../middleware/upload.js'; // Adjust path if in `middleware/upload.js`

import Challenge from '../models/challengeModel.js';

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
export const createChallenge = [
  upload.single('thumbnail'),  // Only accept a single file named `thumbnail`
  async (req, res) => {
    try {
      const { title, description, stages, status } = req.body;
      const parsedStages = stages ? JSON.parse(stages) : [];
      const organizerId = req.user?.id; // Replace with actual user ID

      // Construct the thumbnail URL or path
      const thumbnailUrl = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

      const newChallenge = new Challenge({
        title,
        description,
        stages: parsedStages,
        organizers: [organizerId],
        thumbnailUrl,
        status,
      });

      const savedChallenge = await newChallenge.save();
      res.status(201).json(savedChallenge);
    } catch (error) {
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

//create a challenge, delete a challenge, join a challenge, search a challenge
