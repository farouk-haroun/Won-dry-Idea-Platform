import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden if token is invalid
      }
      req.user = user; // Attach user info to request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized if no token is provided
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
