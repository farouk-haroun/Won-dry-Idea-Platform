import request from 'supertest';
import express from 'express';
import challengeRoutes from '../routes/challengeRoutes.js';
import * as challengeController from '../controllers/challengeController';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const app = express();
app.use(express.json());
app.use('/api', challengeRoutes);

vi.mock('../controllers/challengeController', () => ({
  getAllChallenges: vi.fn(),
  createChallenge: vi.fn(),
  deleteChallenge: vi.fn(),
  incrementViewCount: vi.fn(),
  searchChallenges: vi.fn(),
  getChallengeById: vi.fn(),
  getChallengeTeams: vi.fn(),
}));

describe('Challenge Routes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/challenges', () => {
    it('should fetch all challenges successfully', async () => {
      challengeController.getAllChallenges.mockImplementation((req, res) => {
        res.status(200).json([{ title: 'Challenge 1' }, { title: 'Challenge 2' }]);
      });

      const response = await request(app).get('/api/challenges');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ title: 'Challenge 1' }, { title: 'Challenge 2' }]);
    });

    it('should handle errors in fetching challenges', async () => {
      challengeController.getAllChallenges.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Internal Server Error' });
      });

      const response = await request(app).get('/api/challenges');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  describe('POST /api/challenges', () => {
    it('should create a new challenge successfully', async () => {
      challengeController.createChallenge.mockImplementation((req, res) => {
        res.status(201).json({ message: 'Challenge created', title: 'New Challenge' });
      });

      const response = await request(app)
        .post('/api/challenges')
        .send({ title: 'New Challenge', description: 'Challenge description', category: 'TECHNOLOGY' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Challenge created');
      expect(response.body.title).toBe('New Challenge');
    });

    it('should handle errors during challenge creation', async () => {
      challengeController.createChallenge.mockImplementation((req, res) => {
        res.status(400).json({ message: 'Bad Request' });
      });

      const response = await request(app)
        .post('/api/challenges')
        .send({ title: 'New Challenge' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad Request');
    });
  });

  describe('DELETE /api/challenges/:id', () => {
    it('should delete a challenge successfully', async () => {
      challengeController.deleteChallenge.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Challenge deleted successfully' });
      });

      const response = await request(app).delete('/api/challenges/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Challenge deleted successfully');
    });

    it('should handle errors during challenge deletion', async () => {
      challengeController.deleteChallenge.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Server error' });
      });

      const response = await request(app).delete('/api/challenges/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });

    it('should return 404 if challenge does not exist', async () => {
      challengeController.deleteChallenge.mockImplementation((req, res) => {
        res.status(404).json({ message: 'Challenge not found' });
      });

      const response = await request(app).delete('/api/challenges/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Challenge not found');
    });
  });
});
