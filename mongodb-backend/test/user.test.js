import request from 'supertest';
import express from 'express';
import userRoute from '../routes/userRoute';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as userController from '../controllers/userController';
import * as authMiddleware from '../middleware/authenticate';

vi.mock('../middleware/authenticate', () => ({
  authenticateJWT: vi.fn((req, res, next) => next()),
  authorizeRole: vi.fn(() => (req, res, next) => next()),
}));

vi.mock('../controllers/userController', () => ({
  registerUser: vi.fn(),
  deleteUser: vi.fn(),
  getUserById: vi.fn(),
  getAllUsers: vi.fn((req, res) => res.status(200).send('All users')),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  updateUserProfile: vi.fn(),
  changePassword: vi.fn(),
  registerAdmin: vi.fn(),
  changeUserRole: vi.fn(),
  confirmEmail: vi.fn(),
}));

const app = express();
app.use(express.json());
app.use('/users', userRoute);

describe('User Routes', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it('should register a new user successfully', async () => {
    userController.registerUser.mockImplementation((req, res) => {
      res.status(201).send({ message: 'User registered' });
    });

    const response = await request(app)
      .post('/users/register')
      .send({ username: 'testuser', password: 'testpass' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered');
  });
  describe('POST /users/login', () => {
    it('should login a user successfully', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.status(200).send({ message: 'User logged in', token: 'fake-jwt-token' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'testpass' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged in');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('should return 400 if username is missing', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.status(400).send({ message: 'Username is required' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ password: 'testpass' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username is required');
    });

    it('should return 400 if password is missing', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.status(400).send({ message: 'Password is required' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password is required');
    });

    it('should return 401 if credentials are invalid', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.status(401).send({ message: 'Invalid credentials' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 500 if there is a server error', async () => {
      userController.loginUser.mockImplementation((req, res) => {
        res.status(500).send({ message: 'Internal server error' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'testpass' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
  describe('POST /users/logout', () => {
    it('should logout a user successfully', async () => {
      userController.logoutUser.mockImplementation((req, res) => {
        res.status(200).send({ message: 'User logged out' });
      });

      const response = await request(app)
        .post('/users/logout')
        .send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged out');
    });

    it('should return 500 if there is a server error', async () => {
      userController.logoutUser.mockImplementation((req, res) => {
        res.status(500).send({ message: 'Internal server error' });
      });

      const response = await request(app)
        .post('/users/logout')
        .send();

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
  describe('GET /users/profile', () => {
    it('should get user profile successfully', async () => {
      userController.getUserProfile.mockImplementation((req, res) => {
        res.status(200).send({ username: 'testuser', email: 'testuser@example.com' });
      });

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('testuser@example.com');
    });

    it('should return 401 if user is not authenticated', async () => {
      userController.getUserProfile.mockImplementation((req, res) => {
        res.status(401).send({ message: 'Unauthorized' });
      });

      const response = await request(app)
        .get('/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 500 if there is a server error', async () => {
      userController.getUserProfile.mockImplementation((req, res) => {
        res.status(500).send({ message: 'Internal server error' });
      });

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('PUT /users/profile', () => {
    it('should update user profile successfully', async () => {
      userController.updateUserProfile.mockImplementation((req, res) => {
        res.status(200).send({ message: 'Profile updated' });
      });

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ username: 'updateduser', email: 'updateduser@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated');
    });

    it('should return 400 if required fields are missing', async () => {
      userController.updateUserProfile.mockImplementation((req, res) => {
        res.status(400).send({ message: 'Required fields are missing' });
      });

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Required fields are missing');
    });

    it('should return 401 if user is not authenticated', async () => {
      userController.updateUserProfile.mockImplementation((req, res) => {
        res.status(401).send({ message: 'Unauthorized' });
      });

      const response = await request(app)
        .put('/users/profile')
        .send({ username: 'updateduser', email: 'updateduser@example.com' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 500 if there is a server error', async () => {
      userController.updateUserProfile.mockImplementation((req, res) => {
        res.status(500).send({ message: 'Internal server error' });
      });

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ username: 'updateduser', email: 'updateduser@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
});