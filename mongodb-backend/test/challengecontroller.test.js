import express from 'express';
import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as challengeController from '../controllers/challengeController';
import Challenge from '../models/challengeModel';
import s3 from '../middleware/s3';

vi.mock('../models/challengeModel', () => {
  return {
    default: class Challenge {
      constructor(data) {
        Object.assign(this, data);
      }

      save = vi.fn().mockResolvedValue(this);
    },
    find: vi.fn(() => ({
      sort: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([{ title: 'Test Challenge', description: 'Test Description' }])
    })),
    findById: vi.fn((id) => {
      if (id === '1') {
        return Promise.resolve({
          _id: '1',
          title: 'Test Challenge',
          thumbnailUrl: 's3://bucket/path/to/file',
          status: 'archive',
        });
      }
      return Promise.resolve(null);
    }),
    findByIdAndDelete: vi.fn((id) => {
      if (id === '1') {
        return Promise.resolve({ _id: '1' });
      }
      return Promise.resolve(null);
    }),
    findByIdAndUpdate: vi.fn((id, update) => {
      if (id === '1') {
        return Promise.resolve({ viewCounts: 1 });
      }
      return Promise.resolve(null);
    }),
  };
});

vi.mock('../middleware/s3', () => ({
  deleteObject: vi.fn(() => ({
    promise: () => Promise.resolve('Deleted'),
  })),
}));

// Mock upload middleware
vi.mock('../middleware/upload.js', () => ({
  upload: {
    single: vi.fn(() => (req, res, next) => next()),
  },
  uploadToS3: vi.fn().mockResolvedValue('s3://bucket/path/to/file'),
}));

const app = express();
app.use(express.json());
app.post('/challenges', challengeController.createChallenge);

describe('Challenge Controller - createChallenge', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a new challenge successfully', async () => {
    const response = await request(app)
      .post('/challenges')
      .send({
        title: 'New Challenge',
        description: 'Description of challenge',
        category: 'TECHNOLOGY'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Challenge');
    expect(response.body.description).toBe('Description of challenge');
    expect(response.body.category).toBe('TECHNOLOGY');
  });

  

  
});