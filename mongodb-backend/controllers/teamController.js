// controllers/teamController.js
const Team = require('../models/teamModel');

// Create a team
exports.createTeam = async (req, res) => {
  try {
    const newTeam = new Team(req.body);
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a member to a team
exports.addMemberToTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.members.push(req.body.userId); // Add user to the team
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
