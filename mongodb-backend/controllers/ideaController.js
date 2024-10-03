// controllers/ideaController.js
const Idea = require('../models/ideaModel');

// Get all ideas
exports.getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().populate('createdBy team challenge');
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new idea
exports.createIdea = async (req, res) => {
  try {
    const newIdea = new Idea(req.body);
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment to an idea
exports.addComment = async (req, res) => {
  const { ideaId } = req.params;
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    idea.comments.push({ text: req.body.text, createdBy: req.user.id });
    await idea.save();
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit feedback for an idea
exports.submitFeedback = async (req, res) => {
  const { ideaId } = req.params;
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    idea.feedback = req.body.feedback; // Add scalability, sustainability, etc.
    await idea.save();
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
