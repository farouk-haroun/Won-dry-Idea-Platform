// routes/teamRoutes.js
const express = require('express');
const teamController = require('../controllers/teamController');
const router = express.Router();

router.post('/teams', teamController.createTeam); // Create a new team
router.put('/teams/:teamId/members', teamController.addMemberToTeam); // Add a member to the team

module.exports = router;
