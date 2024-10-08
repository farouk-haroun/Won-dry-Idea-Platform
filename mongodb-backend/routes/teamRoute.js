// routes/teamRoutes.js

import express from 'express';
import { createTeam, addMemberToTeam } from '../controllers/teamController.js';
const router = express.Router();

router.post('/teams', createTeam); // Create a new team
router.put('/teams/:teamId/members', addMemberToTeam); // Add a member to the team

export default router;
