import express from 'express';
import { getAllIdeas, createIdea, addComment, submitFeedback, getIdeaById } from '../controllers/ideaController.js';

const router = express.Router();

router.get('/', getAllIdeas);
router.get('/:ideaId', getIdeaById);
router.post('/', createIdea);
router.post('/:ideaId/comments', addComment);
router.post('/:ideaId/feedback', submitFeedback);

export default router;

