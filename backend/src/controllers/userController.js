const User = require('../models/User');

// @desc    Get all users (for task assignment)
// @route   GET /api/auth/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    console.log('Fetching users for role:', req.user.role);
    
    // Admin and Manager can see all users for assignment
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      const users = await User.find().select('-password');
      console.log(`Found ${users.length} users`);
      return res.status(200).json({ success: true, users });
    }
    
    // Users can only see themselves
    const user = await User.findById(req.user.id).select('-password');
    console.log('Returning single user');
    return res.status(200).json({ success: true, users: [user] });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

module.exports = { getUsers };