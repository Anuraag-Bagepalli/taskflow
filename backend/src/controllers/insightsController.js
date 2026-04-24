const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get smart insights based on user role
// @route   GET /api/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    let insights = {};

    if (req.user.role === 'admin') {
      insights = await getAdminInsights();
    } else if (req.user.role === 'manager') {
      insights = await getManagerInsights();
    } else {
      insights = await getUserInsights(req.user.id);
    }

    res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin insights - Full system analytics
const getAdminInsights = async () => {
  const users = await User.find().select('name email role');
  
  // Aggregation: Tasks per status
  const tasksByStatus = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Aggregation: Tasks per priority
  const tasksByPriority = await Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Aggregation: Tasks per user
  const tasksPerUser = await Task.aggregate([
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
        },
        pendingTasks: {
          $sum: { $cond: [{ $ne: ['$status', 'done'] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        userName: '$user.name',
        userEmail: '$user.email',
        totalTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        completionRate: {
          $multiply: [{ $divide: ['$completedTasks', { $max: ['$totalTasks', 1] }] }, 100]
        }
      }
    }
  ]);

  // Generate smart insights
  const insights = [];
  
  // Insight 1: User with most pending tasks
  const mostPendingUser = [...tasksPerUser].sort((a, b) => b.pendingTasks - a.pendingTasks)[0];
  if (mostPendingUser && mostPendingUser.pendingTasks > 0) {
    insights.push({
      type: 'warning',
      message: `${mostPendingUser.userName} has the most pending tasks (${mostPendingUser.pendingTasks} tasks). Consider checking workload distribution.`,
    });
  }

  // Insight 2: High priority tasks status
  const highPriorityTasks = await Task.aggregate([
    { $match: { priority: 'high' } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const highPriorityPending = highPriorityTasks.find(t => t._id !== 'done')?.count || 0;
  if (highPriorityPending > 0) {
    insights.push({
      type: 'urgent',
      message: `${highPriorityPending} high priority task(s) are not yet completed. These require immediate attention.`,
    });
  }

  // Insight 3: Overall completion rate
  const totalTasks = tasksByStatus.reduce((sum, t) => sum + t.count, 0);
  const completedTasks = tasksByStatus.find(t => t._id === 'done')?.count || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;
  insights.push({
    type: completionRate > 70 ? 'success' : completionRate > 40 ? 'info' : 'warning',
    message: `Overall task completion rate is ${completionRate}%. ${completionRate < 50 ? 'Team productivity needs improvement.' : 'Good progress!'}`,
  });

  return {
    summary: {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      totalUsers: users.length,
    },
    tasksByStatus,
    tasksByPriority,
    tasksPerUser,
    insights,
  };
};

// Manager insights - Team analytics
const getManagerInsights = async () => {
  // Get all users (team members)
  const users = await User.find({ role: 'user' }).select('name email');
  
  // Get all tasks for the team
  const allTasks = await Task.find()
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  // Aggregation: Tasks per status for team
  const tasksByStatus = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Tasks per user (team members only)
  const tasksPerUser = await Task.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedUser'
      }
    },
    { $unwind: '$assignedUser' },
    { $match: { 'assignedUser.role': 'user' } },
    {
      $group: {
        _id: '$assignedTo',
        userName: { $first: '$assignedUser.name' },
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
        }
      }
    }
  ]);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

  // Generate insights
  const insights = [];
  
  // Team performance insight
  insights.push({
    type: completionRate > 70 ? 'success' : 'info',
    message: `Team completion rate is ${completionRate}%. ${completionRate > 70 ? 'Excellent team performance!' : 'Keep pushing forward!'}`,
  });

  // Most overloaded team member
  const mostTasksUser = [...tasksPerUser].sort((a, b) => b.totalTasks - a.totalTasks)[0];
  if (mostTasksUser && mostTasksUser.totalTasks > 5) {
    insights.push({
      type: 'info',
      message: `${mostTasksUser.userName} has ${mostTasksUser.totalTasks} total tasks. Consider redistributing workload if needed.`,
    });
  }

  return {
    summary: {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      teamSize: users.length,
      completionRate: `${completionRate}%`,
    },
    tasksByStatus,
    tasksPerUser,
    insights,
  };
};

// User insights - Personal analytics
const getUserInsights = async (userId) => {
  // Get user's tasks (created or assigned)
  const userTasks = await Task.find({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ]
  });

  const createdTasks = userTasks.filter(t => t.createdBy.toString() === userId);
  const assignedTasks = userTasks.filter(t => t.assignedTo.toString() === userId);
  
  const statusCount = {
    todo: userTasks.filter(t => t.status === 'todo').length,
    'in-progress': userTasks.filter(t => t.status === 'in-progress').length,
    done: userTasks.filter(t => t.status === 'done').length,
  };

  const priorityCount = {
    low: userTasks.filter(t => t.priority === 'low').length,
    medium: userTasks.filter(t => t.priority === 'medium').length,
    high: userTasks.filter(t => t.priority === 'high').length,
  };

  const completionRate = userTasks.length > 0 
    ? (statusCount.done / userTasks.length * 100).toFixed(1) 
    : 0;

  // Generate personal insights
  const insights = [];
  
  if (statusCount['in-progress'] > 2) {
    insights.push({
      type: 'info',
      message: `You have ${statusCount['in-progress']} tasks in progress. Try to focus on completing one at a time for better productivity.`,
    });
  }
  
  if (priorityCount.high > 2 && statusCount.done < priorityCount.high) {
    insights.push({
      type: 'urgent',
      message: `You have ${priorityCount.high} high priority tasks pending. Focus on these first!`,
    });
  }
  
  if (completionRate < 30 && userTasks.length > 0) {
    insights.push({
      type: 'warning',
      message: `Your completion rate is ${completionRate}%. Try breaking down tasks into smaller steps.`,
    });
  } else if (completionRate > 80 && userTasks.length > 0) {
    insights.push({
      type: 'success',
      message: `Excellent work! You've completed ${completionRate}% of your tasks. Keep the momentum going!`,
    });
  }

  if (userTasks.length === 0) {
    insights.push({
      type: 'info',
      message: 'Welcome! Create your first task to get started.',
    });
  }

  return {
    summary: {
      totalTasks: userTasks.length,
      createdTasks: createdTasks.length,
      assignedTasks: assignedTasks.length,
      completedTasks: statusCount.done,
      pendingTasks: statusCount.todo + statusCount['in-progress'],
      completionRate: `${completionRate}%`,
    },
    statusDistribution: statusCount,
    priorityDistribution: priorityCount,
    insights,
  };
};

module.exports = { getInsights };