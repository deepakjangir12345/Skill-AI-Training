const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generic auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// Faculty only middleware
const facultyOnly = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.user.role !== 'faculty') {
        return res.status(403).json({ message: 'Access denied. Faculty role required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Faculty auth error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// Admin or Faculty middleware
const adminOrFaculty = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (!['admin', 'faculty'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Admin or Faculty role required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin/Faculty auth error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = {
  authenticate,
  adminOnly,
  facultyOnly,
  adminOrFaculty
};
