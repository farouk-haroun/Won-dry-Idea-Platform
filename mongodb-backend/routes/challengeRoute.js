// routes/challengeRoutes.js
const express = require('express');
const challengeController = require('../controllers/challengeController');
const router = express.Router();

router.get('/challenges', challengeController.getAllChallenges);
router.post('/challenges', challengeController.createChallenge);
router.post('/challenges/:challengeId/stages/:stageId/submissions', challengeController.addSubmission);

module.exports = router;
