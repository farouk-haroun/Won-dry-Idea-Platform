// controllers/challengeController.js
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

// Create a new challenge
export const createChallenge = async (req, res) => {
  try {
    const newChallenge = new Challenge(req.body);
    const savedChallenge = await newChallenge.save();
    res.status(201).json(savedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add submission to a challenge stage
export const addSubmission = async (req, res) => {
  const { challengeId, stageId } = req.params;
  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const stage = challenge.stages.id(stageId);
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    stage.submissions.push(req.body.submissionId);
    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
