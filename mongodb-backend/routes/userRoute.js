import express from 'express';  
import {
  registerUser, 
  deleteUser, 
  getUserById, 
  getAllUsers, 
  loginUser,
logoutUser,
requestPasswordReset,
resetPassword} from '../controllers/userController.js';
const router = express.Router();

// Register a new user
router.post('/register', (req, res, next) => {
  console.log('Register route matched');
  next();
}, registerUser);

// Route to get all users
router.get('/', async (req, res) => {  // Include 'req' parameter
  try {
    console.log("We outside")
    const users = await getAllUsers(); // Fetch all users from the database
    // console.log(users);  // Log users after they have been fetched
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message in response
  }
});

//route to get a user by id
router.get('/:userId', getUserById);
router.delete('/:userId', deleteUser);

// Login route
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/password-reset', requestPasswordReset);

// Reset password route
router.post('/reset-password', resetPassword);

export default router;
