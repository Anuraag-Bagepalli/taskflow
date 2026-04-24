const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const {
  protect,
  authorize,
  checkTaskOwnership,
  checkDeletePermission,
} = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// GET /api/tasks - Get all tasks (with RBAC filtering)
router.get('/', getTasks);

// POST /api/tasks - Create task (Admin, Manager, User can create)
router.post('/', authorize('admin', 'manager', 'user'), createTask);

// GET /api/tasks/:id - Get single task (with ownership check)
router.get('/:id', checkTaskOwnership, getTask);

// PUT /api/tasks/:id - Update task (with permission check)
router.put('/:id', checkTaskOwnership, updateTask);

// DELETE /api/tasks/:id - Delete task (Admin only)
router.delete('/:id', checkDeletePermission, deleteTask);

module.exports = router;