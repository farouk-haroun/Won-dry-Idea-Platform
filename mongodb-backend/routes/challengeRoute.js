// routes/challengeRoutes.js
import express from 'express';
import {getAllChallenges, 
    createChallenge, 
    addSubmission,
searchChallenges,
deleteChallenge} from '../controllers/challengeController.js';
const router = express.Router();

// Route to create a challenge with file uploads
router.post('/challenges', createChallenge);

router.get('/challenges', getAllChallenges);
router.post('/challenges', createChallenge);
router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
router.get('/search', searchChallenges);
// Delete route
router.delete('/challenges/:id', deleteChallenge);

export default router;
