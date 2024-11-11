// routes/challengeRoutes.js
import express from 'express';
import {getAllChallenges, 
    createChallenge,
deleteChallenge} from '../controllers/challengeController.js';
const router = express.Router();

router.post('/challenges', createChallenge);  // File upload handled here
router.get('/challenges', getAllChallenges);

// router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
// router.get('/search', searchChallenges);
// Delete route
router.delete('/challenges/:id', deleteChallenge);

export default router;
