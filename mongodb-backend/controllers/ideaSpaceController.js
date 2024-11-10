import IdeaSpace from '../models/ideaSpaceModel.js';
import Challenge from '../models/challengeModel.js';
import Idea from '../models/ideaModel.js';

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

// Create new idea space
export const createIdeaSpace = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create new idea space
    const newIdeaSpace = new IdeaSpace({
      title,
      description,
      thumbnail: thumbnail || undefined // If thumbnail is not provided, it will use the default
    });

    // Save to database
    const savedIdeaSpace = await newIdeaSpace.save();
    res.status(201).json(savedIdeaSpace);
  } catch (error) {
    res.status(500).json({ message: 'Error creating idea space', error: error.message });
  }
};
