import IdeaSpace from '../models/ideaSpaceModel.js';
import Challenge from '../models/challengeModel.js';
import Idea from '../models/ideaModel.js';
import { upload, uploadToS3 } from '../middleware/upload.js';

// Get all idea spaces
export const getAllIdeaSpaces = async (req, res) => {
  try {
    // Get all idea spaces
    const ideaSpaces = await IdeaSpace.find()
      .sort({ createdAt: -1 });

    // Get total counts from collections
    const totalChallenges = await Challenge.countDocuments();
    const totalIdeas = await Idea.countDocuments();

    res.status(200).json({
      ideaSpaces,
      counts: {
        challenges: totalChallenges,
        ideas: totalIdeas
      }
    });
  } catch (error) {
    console.error('Error fetching idea spaces:', error);
    res.status(500).json({ message: 'Error fetching idea spaces', error: error.message });
  }
};

export const getIdeaSpaceById = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter

    // Find the idea space by its ID
    const ideaSpace = await IdeaSpace.findById(id);

    if (!ideaSpace) {
      return res.status(404).json({ message: 'IdeaSpace not found' });
    }

    // Return the idea space
    res.status(200).json(ideaSpace);
  } catch (error) {
    console.error('Error fetching idea space by ID:', error);
    res.status(500).json({ message: 'Error fetching idea space', error: error.message });
  }
};

export const getIdeaSpaceByTitle = async (req, res) => {
  try {
    const { title } = req.query; // Get the title from the query parameters

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Find the idea space by its title using case-insensitive search
    const ideaSpace = await IdeaSpace.findOne({ title: { $regex: title, $options: 'i' } });

    if (!ideaSpace) {
      return res.status(404).json({ message: 'IdeaSpace not found' });
    }

    // Return the idea space
    res.status(200).json(ideaSpace);
  } catch (error) {
    console.error('Error fetching idea space by title:', error);
    res.status(500).json({ message: 'Error fetching idea space', error: error.message });
  }
};

// Search idea spaces
export const searchIdeaSpaces = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');

    const ideaSpaces = await IdeaSpace.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(ideaSpaces);
  } catch (error) {
    res.status(500).json({ message: 'Error searching idea spaces', error: error.message });
  }
};

export const createIdeaSpace = [
  upload.single('thumbnail'), // Middleware to handle file uploads
  async (req, res) => {
    try {
      const { title, description } = req.body;

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      let thumbnailUrl = null;

      // If a file is provided, upload it to S3
      if (req.file) {
        thumbnailUrl = await uploadToS3(req.file); // Upload the file to S3 and get the URL
      }

      // Create new idea space
      const newIdeaSpace = new IdeaSpace({
        title,
        description,
        thumbnailUrl, // Save the S3 URL in the database
      });

      // Save to the database
      const savedIdeaSpace = await newIdeaSpace.save();
      res.status(201).json(savedIdeaSpace);
    } catch (error) {
      console.error('Error creating idea space:', error);
      res.status(500).json({ message: 'Error creating idea space', error: error.message });
    }
  },
];
