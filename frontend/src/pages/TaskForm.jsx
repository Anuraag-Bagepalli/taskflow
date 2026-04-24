import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'todo', priority: 'medium', assignedTo: '', dueDate: ''
  });

  useEffect(() => {
    fetchUsers();
    if (id) fetchTask();
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`);
      setUsers(response.data.users);
      if (!formData.assignedTo && response.data.users[0]) {
        setFormData(prev => ({ ...prev, assignedTo: response.data.users[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${id}`);
      const task = response.data.task;
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo._id,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${id}`, formData);
        toast.success('Task updated');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, formData);
        toast.success('Task created');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <button onClick={() => navigate('/tasks')} className="back-button">
        <ArrowLeft size={20} /> Back to Tasks
      </button>

      <div className="form-card">
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          {id ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="input-field"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="input-field" value={formData.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="input-field" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To *</label>
              <select name="assignedTo" className="input-field" value={formData.assignedTo} onChange={handleChange} required>
                <option value="">Select user</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="input-field"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/tasks')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={18} style={{ marginRight: '8px' }} />
              {loading ? 'Saving...' : (id ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;