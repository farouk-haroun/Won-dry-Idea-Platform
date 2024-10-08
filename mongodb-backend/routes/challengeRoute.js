// routes/challengeRoutes.js
import express from 'express';
import {getAllChallenges, createChallenge, addSubmission} from '../controllers/challengeController.js';
const router = express.Router();

router.get('/challenges', getAllChallenges);
router.post('/challenges', createChallenge);
router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);

export default router;
