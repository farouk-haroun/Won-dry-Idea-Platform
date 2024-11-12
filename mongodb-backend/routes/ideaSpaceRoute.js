import express from 'express';
import { getAllIdeaSpaces, searchIdeaSpaces, createIdeaSpace } from '../controllers/ideaSpaceController.js';

const router = express.Router();

// GET all idea spaces
router.get('/', getAllIdeaSpaces);

// GET search idea spaces
router.get('/search', searchIdeaSpaces);

// POST create new idea space
router.post('/', createIdeaSpace);

export default router;
