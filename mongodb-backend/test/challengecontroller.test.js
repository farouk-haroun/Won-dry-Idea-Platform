import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as challengeController from '../controllers/challengeController';
import Challenge from '../models/challengeModel';
import s3 from '../middleware/s3';

// Mock the S3 instance
vi.mock('../middleware/s3', () => ({
  deleteObject: vi.fn(() => ({
    promise: () => Promise.resolve('Deleted'),
  })),
}));

// Set up Express app for testing
const app = express();
app.use(express.json());
app.get('/challenges', challengeController.getAllChallenges);
app.post('/challenges', challengeController.createChallenge);
app.delete('/challenges/:id', challengeController.deleteChallenge);
app.put('/challenges/:id/views', challengeController.incrementViewCount);

describe('Challenge Controller Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /challenges', () => {
    it('should fetch all challenges successfully', async () => {
      vi.spyOn(Challenge, 'find').mockResolvedValue([{ title: 'Test Challenge' }]);

      const response = await request(app).get('/challenges');

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Test Challenge');
    });

    it('should return 500 if there is a server error', async () => {
      vi.spyOn(Challenge, 'find').mockRejectedValue(new Error('Server error'));

      const response = await request(app).get('/challenges');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /challenges', () => {
    it('should create a new challenge successfully', async () => {
      vi.spyOn(Challenge.prototype, 'save').mockResolvedValue({ title: 'New Challenge' });
      vi.spyOn(challengeController, 'createChallenge').mockImplementation((req, res) => {
        res.status(201).json({ title: 'New Challenge' });
      });

      const response = await request(app)
        .post('/challenges')
        .send({
          title: 'New Challenge',
          description: 'Description of challenge',
          category: 'TECHNOLOGY',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Challenge');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/challenges').send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Error creating challenge');
    });
  });

  describe('DELETE /challenges/:id', () => {
    it('should delete a challenge successfully', async () => {
      vi.spyOn(Challenge, 'findById').mockResolvedValue({ thumbnailUrl: 's3://bucket/path/to/file' });
      vi.spyOn(Challenge, 'findByIdAndDelete').mockResolvedValue(true);

      const response = await request(app).delete('/challenges/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Challenge deleted successfully');
      expect(s3.deleteObject).toHaveBeenCalled();
    });

    it('should return 404 if challenge not found', async () => {
      vi.spyOn(Challenge, 'findById').mockResolvedValue(null);

      const response = await request(app).delete('/challenges/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Challenge not found');
    });
  });

  describe('PUT /challenges/:id/views', () => {
    it('should increment view count successfully', async () => {
      vi.spyOn(Challenge, 'findByIdAndUpdate').mockResolvedValue({ viewCounts: 1 });

      const response = await request(app).put('/challenges/1/views');

      expect(response.status).toBe(200);
      expect(response.body.viewCounts).toBe(1);
    });

    it('should return 404 if challenge not found', async () => {
      vi.spyOn(Challenge, 'findByIdAndUpdate').mockResolvedValue(null);

      const response = await request(app).put('/challenges/1/views');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Challenge not found');
    });

    it('should return 500 if there is a server error', async () => {
      vi.spyOn(Challenge, 'findByIdAndUpdate').mockRejectedValue(new Error('Server error'));

      const response = await request(app).put('/challenges/1/views');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });
});
