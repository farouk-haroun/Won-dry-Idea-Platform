// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const User = require('../models/userModel');

// Register a new user
router.post('/register', userController.registerUser);
// Route to get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
      console.log(users)
      res.status(200).json(users); // Return the users as JSON
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
