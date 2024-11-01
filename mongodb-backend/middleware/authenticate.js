// middleware/authenticate.js
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      // Attach user info from the token to req.user
      req.user = {
        userId: decodedToken.userId,  // Add userId to req.user for easy access
        email: decodedToken.email,    // Add email if needed
        role: decodedToken.role       // Add role if needed
      };

      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
};

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated and their role
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next(); // User has the required role, proceed
  };
};
