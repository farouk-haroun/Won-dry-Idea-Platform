
import express from 'express';  
import {registerUser, deleteUser} from '../controllers/userController.js';
import User from '../models/userModel.js';
const router = express.Router();
// Register a new user
router.post('/register', (req, res, next) => {
  // console.log('Register route matched');
  next();
}, registerUser);

// Route to get all users
router.get('/', async (req, res) => {  // Include 'req' parameter
  try {
    const users = await User.find(); // Fetch all users from the database
    // console.log(users);  // Log users after they have been fetched
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message in response
  }
});
router.delete('/:userId', deleteUser);

export default router;
