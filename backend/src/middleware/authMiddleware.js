const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware - Verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`,
      });
    }
    next();
  };
};

/**
 * Task ownership middleware - Check if user can access/modify task
 */
const checkTaskOwnership = async (req, res, next) => {
  const Task = require('../models/Task');
  const task = await Task.findById(req.params.id).populate('createdBy assignedTo');

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const userRole = req.user.role;
  
  // Admin has full access
  if (userRole === 'admin') {
    req.task = task;
    return next();
  }

  // Manager can access team tasks (tasks where assignedTo or createdBy is any user)
  if (userRole === 'manager') {
    req.task = task;
    return next();
  }

  // User can only access their own tasks (created by them OR assigned to them)
  if (userRole === 'user') {
    const isTaskCreator = task.createdBy._id.toString() === req.user._id.toString();
    const isTaskAssigned = task.assignedTo._id.toString() === req.user._id.toString();
    
    if (!isTaskCreator && !isTaskAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this task',
      });
    }
    req.task = task;
    return next();
  }

  return res.status(403).json({ success: false, message: 'Access denied' });
};

/**
 * Check if user can delete task (Admin only for any task, Manager/User restrictions)
 */
const checkDeletePermission = async (req, res, next) => {
  const Task = require('../models/Task');
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  // Only admin can delete any task
  if (req.user.role === 'admin') {
    req.task = task;
    return next();
  }

  // Manager and User cannot delete tasks per RBAC rules
  return res.status(403).json({
    success: false,
    message: 'Only administrators can delete tasks',
  });
};

module.exports = { protect, authorize, checkTaskOwnership, checkDeletePermission };