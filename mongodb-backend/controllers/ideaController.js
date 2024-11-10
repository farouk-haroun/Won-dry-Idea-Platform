// controllers/ideaController.js
import Idea from '../models/ideaModel.js';  

// Get all ideas with average feedbacks
export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.aggregate([
      // Lookup for 'createdBy' field
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      {
        $unwind: '$createdBy'
      },
      
      // Unwind 'feedbacks' array for aggregation
      {
        $unwind: {
          path: '$feedbacks',
          preserveNullAndEmptyArrays: true
        }
      },
      // Group by idea to calculate averages
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          createdBy: { $first: '$createdBy' },
          team: { $first: '$team' },
          challenge: { $first: '$challenge' },
          comments: { $first: '$comments' },
          feedbacks: { $push: '$feedbacks' },
          status: { $first: '$status' },
          votes: { $first: '$votes' },
          createdAt: { $first: '$createdAt' },
          avgScalability: { $avg: '$feedbacks.scalability' },
          avgSustainability: { $avg: '$feedbacks.sustainability' },
          avgInnovation: { $avg: '$feedbacks.innovation' },
          avgImpact: { $avg: '$feedbacks.impact' }
        }
      },
      // Project the final output
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdBy: 1,
          team: 1,
          challenge: 1,
          comments: 1,
          feedbacks: 1,
          status: 1,
          votes: 1,
          createdAt: 1,
          averageFeedback: {
            scalability: '$avgScalability',
            sustainability: '$avgSustainability',
            innovation: '$avgInnovation',
            impact: '$avgImpact'
          }
        }
      }
    ]);

    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new idea
export const createIdea = async (req, res) => {
  try {
    const newIdea = new Idea(req.body);
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment to an idea
export const addComment = async (req, res) => {
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
export const submitFeedback = async (req, res) => {
  const { ideaId } = req.params;
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const feedbackEntry = {
      ...req.body, // Contains scalability, sustainability, etc.
      createdBy: req.user.id, // Ensure req.user.id is available through authentication middleware
      createdAt: new Date(),
    };

    idea.feedbacks.push(feedbackEntry);
    await idea.save();
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
