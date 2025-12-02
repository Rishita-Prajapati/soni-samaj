const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid token or admin deactivated.' });
    }

    req.admin = decoded;
    req.adminUser = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const superAdminAuth = async (req, res, next) => {
  adminAuth(req, res, () => {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super admin required.' });
    }
    next();
  });
};

module.exports = { adminAuth, superAdminAuth };