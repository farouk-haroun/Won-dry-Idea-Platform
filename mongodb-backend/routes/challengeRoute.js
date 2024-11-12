// routes/challengeRoutes.js
import express from 'express';
import {getAllChallenges, 
    createChallenge,
deleteChallenge,
searchChallenges,
incrementViewCount,

archiveChallenge} from '../controllers/challengeController.js';
const router = express.Router();

// Route to create a challenge with file uploads
router.post('/challenges', createChallenge);

router.get('/challenges', getAllChallenges);

// router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
// router.get('/search', searchChallenges);
// Delete route
router.delete('/:id', deleteChallenge);
router.get('/search', searchChallenges);

router.patch('/:id/view', incrementViewCount);
router.patch('/:id/archive', archiveChallenge);


export default router;
