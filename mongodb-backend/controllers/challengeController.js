import Challenge from '../models/challengeModel.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { upload, uploadToS3 } from '../middleware/upload.js';
import s3 from '../middleware/s3.js';
import 'dotenv/config';

// Get all challenges
export const getAllChallenges = async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortCriteria = { createdAt: -1 }; // Default to sort by most recent
    if (sortBy === 'popularity') {
      sortCriteria = { viewCounts: -1 };
    }

    const challenges = await Challenge.find()
      .sort(sortCriteria)
      .populate('organizers stages.submissions')
      .populate('ideaSpace');

    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error in getAllChallenges:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new challenge with S3 file upload
export const createChallenge = [
  upload.single('thumbnail'),
  async (req, res) => {
    // Check required fields before entering the try block
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Error creating challenge: Title, description, and category are required' });
    }

    try {
      let thumbnailUrl = null;
      if (req.file) {
        thumbnailUrl = await uploadToS3(req.file);
      }

      const newChallenge = new Challenge({
        title,
        description,
        organizers: [req.user?.id],
        thumbnailUrl,
        category,
      });

      const savedChallenge = await newChallenge.save();
      res.status(201).json(savedChallenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  },
];

// Delete a challenge, including S3 thumbnail deletion
export const deleteChallenge = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.status !== 'archive') {
      return res.status(400).json({ message: 'Challenge must be archived before deletion' });
    }

    if (challenge.thumbnailUrl) {
      const urlParts = challenge.thumbnailUrl.split('/');
      const fileKey = urlParts.slice(-2).join('/');

      const deleteParams = { Bucket: process.env.S3_BUCKET_NAME, Key: fileKey };
      const command = new DeleteObjectCommand(deleteParams);
      await s3.send(command);
      console.log('Thumbnail deleted from S3 successfully');
    }

    await Challenge.findByIdAndDelete(id);
    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Increment view count for a challenge
export const incrementViewCount = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { $inc: { viewCounts: 1 } },
      { new: true }
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.status(200).json(updatedChallenge);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
