// routes/ideaRoutes.js
const express = require('express');
const ideaController = require('../controllers/ideaController');
const router = express.Router();

router.get('/ideas', ideaController.getAllIdeas);
router.post('/ideas', ideaController.createIdea);
router.post('/ideas/:ideaId/comments', ideaController.addComment);
router.post('/ideas/:ideaId/feedback', ideaController.submitFeedback);

module.exports = router;
