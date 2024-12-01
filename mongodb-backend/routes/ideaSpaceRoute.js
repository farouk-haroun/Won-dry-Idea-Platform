import express from 'express';
import { getAllIdeaSpaces, searchIdeaSpaces, createIdeaSpace,
    getIdeaSpaceById,getIdeaSpaceByTitle
 } from '../controllers/ideaSpaceController.js';

const router = express.Router();

// GET all idea spaces
router.get('/', getAllIdeaSpaces);
// New route to get an idea space by ID
router.get('/:id', getIdeaSpaceById);

// GET search idea spaces
router.get('/search', searchIdeaSpaces);

// POST create new idea space
router.post('/', createIdeaSpace);
router.get('/search', getIdeaSpaceByTitle);

export default router;
