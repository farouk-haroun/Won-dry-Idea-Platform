// routes/teamRoute.js
import express from 'express';
import {
  createTeam,
  addMemberToTeam,
  sendMessageToTeam,
  getTeamMessages,
  getTeamById,
  getAllTeams,
  removeMemberFromTeam,
  deleteTeam,
  getTeamsByChallengeId,
} from '../controllers/teamController.js';
import { authenticateJWT } from '../middleware/authenticate.js';

const router = express.Router();

// Team management routes
router.post('/', authenticateJWT, createTeam); // Create a new team
router.get('/', authenticateJWT, getAllTeams); // Get all teams (with optional pagination)
router.get('/:teamId', authenticateJWT, getTeamById); // Get a specific team by ID
router.delete('/:teamId', authenticateJWT, deleteTeam); // Delete a team (ideally restricted by role)

// Member management routes
router.post('/:teamId/add-member', authenticateJWT, addMemberToTeam); // Add a member to a team
router.post('/:teamId/remove-member', authenticateJWT, removeMemberFromTeam); // Remove a member from a team

// Message routes
router.post('/:teamId/messages', authenticateJWT, sendMessageToTeam); // Send a message within a team
router.get('/:teamId/messages', authenticateJWT, getTeamMessages); // Get all messages for a team

router.get('/challenge/:challengeId', getTeamsByChallengeId);

export default router;