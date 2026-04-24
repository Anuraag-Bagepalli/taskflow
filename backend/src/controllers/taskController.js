const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks with filtering and pagination
// @route   GET /api/tasks
// @access  Private (RBAC enforced)
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admin sees all tasks
      query = {};
    } else if (req.user.role === 'manager') {
      // Manager sees tasks assigned to any user (team tasks)
      query = {};
    } else if (req.user.role === 'user') {
      // User sees tasks they created OR assigned to them
      query = {
        $or: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id }
        ]
      };
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private (with ownership check)
const getTask = async (req, res) => {
  try {
    res.status(200).json({ success: true, task: req.task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Admin, Manager, User can create)
const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    // Validate assignedTo user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ success: false, message: 'Assigned user not found' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user.id,
      assignedTo,
      dueDate: dueDate || undefined,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (with ownership/permission check)
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const task = req.task;

    // Check update permissions based on role
    if (req.user.role === 'user') {
      // Users can only update tasks they created
      const isCreator = task.createdBy._id.toString() === req.user.id;
      if (!isCreator) {
        return res.status(403).json({
          success: false,
          message: 'You can only update tasks you created',
        });
      }
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    
    // Only Admin and Manager can reassign tasks
    if (assignedTo && (req.user.role === 'admin' || req.user.role === 'manager')) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ success: false, message: 'Assigned user not found' });
      }
      task.assignedTo = assignedTo;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
const deleteTask = async (req, res) => {
  try {
    await req.task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };