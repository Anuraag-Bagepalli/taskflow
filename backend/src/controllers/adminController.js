const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

// @desc    Get all users with their task statistics
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsersWithTaskStats = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password');
    
    // Get task statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Tasks created by this user
        const createdTasks = await Task.find({ createdBy: user._id });
        
        // Tasks assigned to this user
        const assignedTasks = await Task.find({ assignedTo: user._id });
        
        // Task statistics
        const completedTasks = assignedTasks.filter(t => t.status === 'done').length;
        const inProgressTasks = assignedTasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = assignedTasks.filter(t => t.status === 'todo').length;
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          statistics: {
            tasksCreated: createdTasks.length,
            tasksAssigned: assignedTasks.length,
            completed: completedTasks,
            inProgress: inProgressTasks,
            todo: todoTasks,
            completionRate: assignedTasks.length > 0 
              ? ((completedTasks / assignedTasks.length) * 100).toFixed(1) 
              : 0
          }
        };
      })
    );
    
    res.status(200).json({
      success: true,
      users: usersWithStats,
      totalUsers: users.length
    });
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add a new user (Admin only)
// @route   POST /api/admin/users
// @access  Private (Admin only)
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    console.log('Adding new user:', { name, email, role });
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    console.log('User created successfully:', user._id);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting user:', id);
    
    // Don't allow deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Delete all tasks created by or assigned to this user
    const deletedTasks = await Task.deleteMany({
      $or: [
        { createdBy: id },
        { assignedTo: id }
      ]
    });
    
    console.log(`Deleted ${deletedTasks.deletedCount} tasks for user`);
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User and all associated tasks deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'manager', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get system overview statistics
// @route   GET /api/admin/overview
// @access  Private (Admin only)
const getSystemOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'done' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const todoTasks = await Task.countDocuments({ status: 'todo' });
    
    // Tasks by priority
    const highPriorityTasks = await Task.countDocuments({ priority: 'high' });
    const mediumPriorityTasks = await Task.countDocuments({ priority: 'medium' });
    const lowPriorityTasks = await Task.countDocuments({ priority: 'low' });
    
    // Get all users for role distribution
    const adminCount = await User.countDocuments({ role: 'admin' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
        priorities: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks
        },
        roles: {
          admin: adminCount,
          manager: managerCount,
          user: userCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUsersWithTaskStats,
  addUser,
  deleteUser,
  updateUserRole,
  getSystemOverview
};