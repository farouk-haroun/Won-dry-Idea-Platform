    // Start of Selection
    // *** Place all vi.mock calls at the very top of the file ***
     // Now import the modules
     import request from 'supertest';
     import express from 'express';
     import mongoose from 'mongoose';
     import { describe, it, expect, vi, beforeEach } from 'vitest';
     import * as challengeController from '../controllers/challengeController';
     import Challenge from '../models/challengeModel';
     import s3 from '../middleware/s3';
    // Mock the Challenge Model
    vi.mock('../models/challengeModel', () => {
      return {
        default: class Challenge {
          constructor(data) {
            Object.assign(this, data);
          }
    
          save = vi.fn().mockResolvedValue(this);
        },
        find: vi.fn().mockImplementation(() => ({
          sort: vi.fn().mockReturnThis(),
          populate: vi.fn()
            .mockReturnThis()
            .mockImplementationOnce(() => ({
              populate: vi.fn().mockResolvedValue([{ title: 'Test Challenge' }]),
            }))
            .mockImplementationOnce(() => ({
              populate: vi.fn().mockResolvedValue([{ title: 'Test Challenge' }]),
            })),
        })),
        findById: vi.fn().mockImplementation((id) => {
          if (id === '1') {
            return Promise.resolve({
              _id: '1',
              thumbnailUrl: 's3://bucket/path/to/file',
            });
          }
          return Promise.resolve(null);
        }),
        findByIdAndDelete: vi.fn().mockImplementation((id) => {
          if (id === '1') {
            return Promise.resolve({ _id: '1' });
          }
          return Promise.resolve(null);
        }),
        findByIdAndUpdate: vi.fn().mockImplementation((id, update, options) => {
          if (id === '1') {
            return Promise.resolve({ viewCounts: 1 });
          }
          return Promise.resolve(null);
        }),
      };
    });
    
    // Mock the S3 instance
    vi.mock('../middleware/s3', () => ({
      deleteObject: vi.fn(() => ({
        promise: () => Promise.resolve('Deleted'),
      })),
    }));
    
    // Mock the upload middleware
    vi.mock('../middleware/upload.js', () => ({
      upload: {
        single: vi.fn(),
      },
      uploadToS3: vi.fn().mockResolvedValue('s3://bucket/path/to/file'),
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
          const response = await request(app).get('/challenges');
    
          expect(response.status).toBe(200);
          expect(response.body[0].title).toBe('Test Challenge');
        });
    
        it('should return 500 if there is a server error', async () => {
          // Mock Challenge.find to throw an error
          Challenge.find.mockImplementation(() => {
            throw new Error('Server error');
          });
    
          const response = await request(app).get('/challenges');
    
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Server error');
        });
      });
    
      describe('POST /challenges', () => {
        it('should create a new challenge successfully', async () => {
          const response = await request(app)
            .post('/challenges')
            .field('title', 'New Challenge')
            .field('description', 'Description of challenge')
            .field('category', 'TECHNOLOGY');
    
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
          const response = await request(app).delete('/challenges/1');
    
          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Challenge deleted successfully');
          expect(s3.deleteObject).toHaveBeenCalled();
        });
    
        it('should return 404 if challenge not found', async () => {
          const response = await request(app).delete('/challenges/2');
    
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Challenge not found');
        });
      });
    
      describe('PUT /challenges/:id/views', () => {
        it('should increment view count successfully', async () => {
          const response = await request(app).put('/challenges/1/views');
    
          expect(response.status).toBe(200);
          expect(response.body.viewCounts).toBe(1);
        });
    
        it('should return 404 if challenge not found', async () => {
          const response = await request(app).put('/challenges/2/views');
    
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Challenge not found');
        });
    
        it('should return 500 if there is a server error', async () => {
          Challenge.findByIdAndUpdate.mockRejectedValue(new Error('Server error'));
    
          const response = await request(app).put('/challenges/1/views');
    
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Server error');
        });
      });
    });
