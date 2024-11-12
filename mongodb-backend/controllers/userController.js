// controllers/userController.js
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // To send emails
const EMAIL_USER= "vanderbiltwondry@gmail.com"
const EMAIL_PASSWORD= "puwiohofidaucscy"
// Set up email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // use your preferred email provider
  auth: {
    user:EMAIL_USER,
    pass:EMAIL_PASSWORD
  }
});

// User Registration and Confirmation
export const registerUser = async (req, res) => {
  console.log('Register route matched');
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' }); // Use 'error' key for consistency
    }
    

    // Hash the password and create a confirmation token
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create and save the new user
    user = new User({ name, email, password: hashedPassword, confirmationToken });
    await user.save();

    // Generate the confirmation link
    const confirmationLink = `http://localhost:5000/api/users/confirm-email?token=${confirmationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Hi ${name},</p>
             <p>Please confirm your email by clicking on the link below:</p>
             <a href="${confirmationLink}">Confirm Email</a>`
    };

    // Attempt to send the confirmation email
    try {
      await transporter.sendMail(mailOptions);
      // If email sending is successful, send a standard success response
      res.status(201).json({
        message: 'User registered successfully.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });}
       catch (emailError) {
      // If email sending fails, log the error and notify the user
      console.error('Error sending email:', emailError.message);
      res.status(201).json({
        message: 'User registered successfully, but there was an error sending the confirmation email. Please contact support.',
      });
    }
  } catch (error) {
    // Handle any other errors that occur during registration
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
  }
};


export const confirmEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    user.confirmationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully. You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// User Login and Logout
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'default_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req, res) => {
  console.log('Logout route matched');
  res.status(200).json({ message: 'Logout successful' });
};

// Password Management
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Password reset request received');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_key',
      { expiresIn: '15m' }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: 
      http://localhost:3000/reset-password?token=${token}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_key');
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profile Management
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    const updateFields = ['name', 'email', 'department', 'interests', 'skills'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        department: user.department || '',
        points: user.points || 0,
        interests: user.interests || [],
        skills: user.skills || [],
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Add or update the getUserProfile function
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return formatted user data
    res.status(200).json({
      id: user._id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      department: user.department || '',
      points: user.points || 0,
      interests: user.interests || [],
      skills: user.skills || [],
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// User and Admin Management
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    console.log(userData);

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'admin' });
    await user.save();

    res.status(201).json({ message: 'Admin user registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${newRole} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
