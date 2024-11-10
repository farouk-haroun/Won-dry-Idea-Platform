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
  confirmEmail
} from '../controllers/userController.js';

const router = express.Router();

// Authentication routes
router.post('/register', (req, res, next) => {
  next();
}, registerUser); // Register a new user

router.post('/login', loginUser); // Login route
router.post('/logout', logoutUser); // Logout route

// Email confirmation route
router.get('/confirm-email', confirmEmail); // Route to confirm email

// Profile routes (require authentication)
router.get('/profile', authenticateJWT, (req, res) => {
  res.status(200).json(req.user); // Get current user profile
});

router.put('/profile', authenticateJWT, updateUserProfile); // Update user profile

// Password management routes
router.post('/password-reset', requestPasswordReset); // Request password reset
router.post('/reset-password', resetPassword); // Reset password
router.put('/change-password', authenticateJWT, changePassword); // Change password while logged in

// Admin-only routes
router.post('/register-admin', authenticateJWT, authorizeRole('admin'), registerAdmin); // Register a new admin
router.get('/', authenticateJWT, authorizeRole('admin'), getAllUsers); // Get all users with pagination
router.put('/change-role', authenticateJWT, authorizeRole('admin'), changeUserRole); // Change user role
router.delete('/:userId', authenticateJWT, authorizeRole('admin'), deleteUser); // Delete user

// Get a user by ID
router.get('/:userId', getUserById);

export default router;
