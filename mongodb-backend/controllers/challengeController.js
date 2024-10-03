// controllers/challengeController.js
const Challenge = require('../models/challengeModel');

// Get all challenges
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('organizers stages.submissions');
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new challenge
exports.createChallenge = async (req, res) => {
  try {
    const newChallenge = new Challenge(req.body);
    const savedChallenge = await newChallenge.save();
    res.status(201).json(savedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add submission to a challenge stage
exports.addSubmission = async (req, res) => {
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
