// routes/challengeRoutes.js
import express from 'express';
import {getAllChallenges, 
    createChallenge,
deleteChallenge,
searchChallenges} from '../controllers/challengeController.js';
const router = express.Router();

// Route to create a challenge with file uploads
router.post('/challenges', createChallenge);

router.get('/challenges', getAllChallenges);

// router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
// router.get('/search', searchChallenges);
// Delete route
router.delete('/challenges/:id', deleteChallenge);
router.get('/challenges/search', searchChallenges);

export default router;
