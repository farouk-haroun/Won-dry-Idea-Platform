// controllers/challengeController.js
import Challenge from '../models/challengeModel.js';
import { upload, uploadToS3 } from '../middleware/upload.js';
import s3 from '../middleware/s3.js'; // Import the S3 instance if needed for delete
import path from 'path';
import 'dotenv/config'; 
 

// Get all challenges
// Get all challenges with sorting options
export const getAllChallenges = async (req, res) => {
  try {
    const { sortBy } = req.query; // Capture the sortBy parameter

    // Define sorting criteria based on query
    let sortCriteria = { createdAt: -1 }; // Default to sort by most recent
    if (sortBy === 'date') {
      sortCriteria = { createdAt: -1 }; // Sort by newest created date
    } else if (sortBy === 'popularity') {
      sortCriteria = { viewCounts: -1 }; // Sort by highest view counts
    }

    const challenges = await Challenge.find()
      .sort(sortCriteria) // Apply the sorting criteria
      .populate('organizers stages.submissions');
    
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create a new challenge with S3 file upload
export const createChallenge = [
  upload.single('thumbnail'),
  async (req, res) => {
    try {
      const { title, description, stages, status, category } = req.body;
      const parsedStages = stages ? JSON.parse(stages) : [];
      const organizerId = req.user?.id;

      let thumbnailUrl = null;
      if (req.file) {
        thumbnailUrl = await uploadToS3(req.file); // Upload to S3 and get URL
      }

      const newChallenge = new Challenge({
        title,
        description,
        stages: parsedStages,
        organizers: [organizerId],
        thumbnailUrl,
        status,
        category,
      });

      const savedChallenge = await newChallenge.save();
      res.status(201).json(savedChallenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(400).json({ message: error.message });
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

    // Delete the thumbnail from S3 if it exists
    if (challenge.thumbnailUrl) {
      // Extract the key from the S3 URL
      const urlParts = challenge.thumbnailUrl.split('/');
      const fileKey = urlParts.slice(-2).join('/'); // Assuming key is "folder/filename.ext"

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
      };

      await s3.deleteObject(s3Params).promise();
      console.log('Thumbnail deleted from S3 successfully');
    }

    // Delete the challenge from the database
    await Challenge.findByIdAndDelete(id);

    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search challenges with sorting options
export const searchChallenges = async (req, res) => {
  try {
    const { title, sortBy } = req.query;

    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Define sorting criteria based on query
    let sortCriteria = { createdAt: -1 }; // Default to sort by most recent
    if (sortBy === 'date') {
      sortCriteria = { createdAt: -1 }; // Sort by newest created date
    } else if (sortBy === 'popularity') {
      sortCriteria = { viewCounts: -1 }; // Sort by highest view counts
    }

    const challenges = await Challenge.find({
      title: { $regex: title, $options: 'i' } // 'i' for case-insensitive search
    })
      .sort(sortCriteria) // Apply the sorting criteria
      .populate('organizers stages.submissions');

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementViewCount = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the challenge by ID and increment the viewCounts field
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { $inc: { viewCounts: 1 } },  // $inc operator to increment viewCounts by 1
      { new: true }  // Return the updated document
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.status(200).json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};