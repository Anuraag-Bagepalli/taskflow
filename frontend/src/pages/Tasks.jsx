import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    fetchTasks();
  }, [filters, pagination.page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pagination.page, limit: 10, ...filters });
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks?${params}`);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const getStatusBadge = (status) => {
    const classes = { todo: 'badge-todo', 'in-progress': 'badge-progress', done: 'badge-done' };
    return classes[status] || 'badge';
  };

  const getPriorityBadge = (priority) => {
    const classes = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
    return classes[priority] || 'badge';
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>Manage and track your tasks</p>
        </div>
        <Link to="/tasks/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} /> New Task
        </Link>
      </div>

      <div className="filters-bar">
        <div className="filters-grid">
          <div className="input-icon">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          
          <select className="input-field" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select className="input-field" value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>No tasks found</p>
          <Link to="/tasks/new" className="btn-primary" style={{ textDecoration: 'none' }}>Create your first task</Link>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <div className="task-title-section">
                  <div className="task-title">
                    {task.title}
                    <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
                    <span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="meta-item"><User size={14} /> Created by: {task.createdBy?.name}</span>
                    <span className="meta-item"><User size={14} /> Assigned to: {task.assignedTo?.name}</span>
                    <span className="meta-item"><Calendar size={14} /> Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <Link to={`/tasks/edit/${task._id}`} className="icon-btn icon-btn-edit">
                    <Edit size={18} />
                  </Link>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(task._id)} className="icon-btn icon-btn-delete">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">Page {pagination.page} of {pagination.pages}</span>
            <button
              className="pagination-btn"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;