// routes/challengeRoutes.js
import express from 'express';
import {
    getAllChallenges, 
    createChallenge,
    deleteChallenge,
    searchChallenges,
    incrementViewCount,
    getChallengeById,
    getChallengeTeams,
    archiveChallenge
} from '../controllers/challengeController.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.post('/challenges', createChallenge);  // File upload handled here
router.get('/challenges', getAllChallenges);

router.post('/', ...createChallenge);  // Spread the middleware array
router.get('/', getAllChallenges);

// router.post('/challenges/:challengeId/stages/:stageId/submissions', addSubmission);
// router.get('/search', searchChallenges);
// Delete route
router.delete('/:id', deleteChallenge);
router.get('/search', searchChallenges);

router.get('/:id', getChallengeById);  // /api/challenges/:id
router.get('/:id/teams', getChallengeTeams); 

router.patch('/:id/view', incrementViewCount);
router.patch('/:id/archive', archiveChallenge);


export default router;
