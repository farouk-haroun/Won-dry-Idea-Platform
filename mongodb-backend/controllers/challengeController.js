import Challenge from '../models/challengeModel.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { upload, uploadToS3 } from '../middleware/upload.js';
import s3 from '../middleware/s3.js'; // Import the S3 instance if needed for delete
import path from 'path';
import 'dotenv/config'; 
import Team from '../models/teamModel.js';

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
      .populate('organizers stages.submissions')
      .populate('ideaSpace');
    
    // Transform challenges to include default community data if needed
    const transformedChallenges = challenges.map(challenge => {
      const challengeObj = challenge.toObject();
      if (!challengeObj.ideaSpace) {
        challengeObj.community = {
          name: "Wond'ry Innovation Center",
          avatar: "https://via.placeholder.com/150"
        };
      } else {
        challengeObj.community = {
          name: challengeObj.ideaSpace.title,
          avatar: challengeObj.ideaSpace.thumbnail
        };
      }
      return challengeObj;
    });
    
    res.status(200).json(transformedChallenges);
  } catch (error) {
    console.error('Error in getAllChallenges:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new challenge with S3 file upload
export const createChallenge = [
  upload.single('thumbnail'),
  async (req, res) => {
    try {
      const { 
        title, 
        description, 
        stages, 
        status, 
        category,
        community
      } = req.body;

      // Validate required fields
      if (!title || !description || !category) {
        return res.status(400).json({ message: 'Error creating challenge: Title, description and category are required' });
      }
      
      const parsedStages = stages ? JSON.parse(stages) : [];
      const organizerId = req.user?.id;

      let thumbnailUrl = null;
      if (req.file) {
        thumbnailUrl = await uploadToS3(req.file);
      }

      const newChallenge = new Challenge({
        title,
        description,
        stages: parsedStages,
        organizers: [organizerId],
        thumbnailUrl,
        status,
        category,
        community: community ? JSON.parse(community) : {
          name: "Wond'ry Innovation Center",
          avatar: "https://your-default-avatar-url.com"
        },
        metrics: {
          views: 0,
          totalIdeas: 0,
          activeUsers: 0
        }
      });

      const savedChallenge = await newChallenge.save();
      res.status(201).json(savedChallenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(400).json({ message: 'Error creating challenge: ' + error.message });
    }
  },
];

export const deleteChallenge = async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if the challenge is archived before deletion
    if (challenge.status !== 'archive') {
      return res.status(400).json({ message: 'Challenge must be archived before deletion' });
    }

    // Delete the thumbnail from S3 if it exists
    if (challenge.thumbnailUrl) {
      // Extract the key from the S3 URL
      const urlParts = challenge.thumbnailUrl.split('/');
      const fileKey = urlParts.slice(-2).join('/'); // Assuming key is "folder/filename.ext"

      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
      };

      // Use DeleteObjectCommand in AWS SDK v3
      const command = new DeleteObjectCommand(deleteParams);
      await s3.send(command); // Send the command to delete the object
      console.log('Thumbnail deleted from S3 successfully');
    }

    // Delete the challenge from the database
    await Challenge.findByIdAndDelete(id);

    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
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
    console.error('Error deleting challenge:', error);
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

// Archive a challenge (set status to "archive")
export const archiveChallenge = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the challenge by ID and update the status to "archive"
    const archivedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { status: 'archive' },
      { new: true }
    );

    if (!archivedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.status(200).json(archivedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChallengeById = async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id).populate('organizers stages.submissions');
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.status(200).json(challenge);
  } catch (error) {
    console.error('Error fetching challenge by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get teams associated with a specific challenge
export const getChallengeTeams = async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id).populate('teams'); // Make sure 'teams' is a field in your Challenge model
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const teams = await Team.find({ challenge: id }); // Find teams that belong to the specified challenge
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams for challenge:', error);
    res.status(500).json({ message: error.message });
  }
};
