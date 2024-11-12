import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/authenticate.js';
import {
  registerUser, 
  deleteUser, 
  getUserById, 
  getAllUsers, 
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  updateUserProfile,
  changePassword,
  registerAdmin,
  changeUserRole,
  confirmEmail,
  getUserProfile
} from '../controllers/userController.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Profile routes (require authentication)
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

// Email confirmation route
router.get('/confirm-email', confirmEmail);

// Password management routes
router.post('/password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/change-password', authenticateJWT, changePassword);

// Admin-only routes
router.post('/register-admin', authenticateJWT, authorizeRole('admin'), registerAdmin);
router.get('/', authenticateJWT, authorizeRole('admin'), getAllUsers);
router.put('/change-role', authenticateJWT, authorizeRole('admin'), changeUserRole);
router.delete('/:userId', authenticateJWT, authorizeRole('admin'), deleteUser);

// Get a user by ID
router.get('/:userId', getUserById);

export default router;
