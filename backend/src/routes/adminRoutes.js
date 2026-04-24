const express = require('express');
const router = express.Router();
const {
  getUsersWithTaskStats,
  addUser,
  deleteUser,
  updateUserRole,
  getSystemOverview
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', getUsersWithTaskStats);      // Get all users with stats
router.post('/users', addUser);                    // Add new user
router.delete('/users/:id', deleteUser);           // Delete user
router.put('/users/:id/role', updateUserRole);    // Update user role

// Overview/stats routes
router.get('/overview', getSystemOverview);        // Get system overview

module.exports = router;