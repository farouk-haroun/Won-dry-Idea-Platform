// controllers/challengeController.js
import { upload, gfs } from '../config/gridfs.js'; // Adjust path if in `middleware/upload.js`

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
  upload.fields([{ name: 'attachments', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title, description, stages, organizers, status } = req.body;

      // Get file IDs from GridFS for attachments and thumbnail
      const attachedFiles = req.files['attachments']?.map(file => file.id) || [];
      const thumbnailUrl = req.files['thumbnail']?.[0]?.id || null;

      const newChallenge = new Challenge({
        title,
        description,
        stages: JSON.parse(stages), // Parse stages if sent as JSON string
        organizers: JSON.parse(organizers), // Parse organizers if needed
        attachedFiles,
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
