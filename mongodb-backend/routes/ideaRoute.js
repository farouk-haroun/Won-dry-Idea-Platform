import express from 'express';
import { getAllIdeas, createIdea, addComment, submitFeedback } from '../controllers/ideaController.js';

const router = express.Router();

router.get('/ideas', getAllIdeas);
router.post('/ideas', createIdea);
router.post('/ideas/:ideaId/comments', addComment);
router.post('/ideas/:ideaId/feedback', submitFeedback);

export default router;

