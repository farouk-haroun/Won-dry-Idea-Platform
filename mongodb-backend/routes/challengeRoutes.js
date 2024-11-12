// routes/challengeRoutes.js
import express from 'express';
import {
    getAllChallenges, 
    createChallenge,
    deleteChallenge,
    searchChallenges,
    incrementViewCount,
    getChallengeById,
    getChallengeTeams
} from '../controllers/challengeController.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.post('/challenges', createChallenge);  // File upload handled here
router.get('/challenges', getAllChallenges);

router.post('/', createChallenge);  // File upload handled in controller
router.get('/', getAllChallenges);

// router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
 router.get('/search', searchChallenges);
// Delete route
router.delete('/challenges/:id', deleteChallenge);
router.get('/search', searchChallenges);
router.get('/:id', getChallengeById);
router.get('/:id/teams', getChallengeTeams);
router.delete('/:id', deleteChallenge);
router.patch('/:id/view', incrementViewCount);

export default router;
