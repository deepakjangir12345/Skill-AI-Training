const jwt = require('jsonwebtoken');
const User = require('../models/User');

const facultyOnly = async (req, res, next) => {
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

    if (user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty role required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Faculty auth error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = facultyOnly;
