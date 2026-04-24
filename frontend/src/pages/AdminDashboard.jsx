import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Mail,
  Lock,
  User,
  Shield,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, overviewRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/overview`)
      ]);
      
      setUsers(usersRes.data.users);
      setOverview(overviewRes.data.overview);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (newUser.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/users`, newUser);
      toast.success('User added successfully');
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This will also delete all their tasks.`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchAdminData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return { bg: '#f3e8ff', color: '#764ba2' };
      case 'manager': return { bg: '#eef2ff', color: '#667eea' };
      default: return { bg: '#d4edda', color: '#28a745' };
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage users and monitor system activity</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* Statistics Cards */}
      {overview && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{overview.totalUsers}</div>
            </div>
            <div className="stat-icon" style={{ background: '#eef2ff' }}>
              <Users color="#667eea" size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Tasks</div>
              <div className="stat-value">{overview.totalTasks}</div>
            </div>
            <div className="stat-icon" style={{ background: '#eef2ff' }}>
              <CheckCircle color="#667eea" size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Completed Tasks</div>
              <div className="stat-value" style={{ color: '#28a745' }}>{overview.completedTasks}</div>
            </div>
            <div className="stat-icon" style={{ background: '#d4edda' }}>
              <CheckCircle color="#28a745" size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Completion Rate</div>
              <div className="stat-value" style={{ color: '#764ba2' }}>{overview.completionRate}%</div>
            </div>
            <div className="stat-icon" style={{ background: '#f3e8ff' }}>
              <TrendingUp color="#764ba2" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          User Management
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Tasks Created</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Tasks Assigned</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Completed</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>In Progress</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>To Do</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleStyle = getRoleBadgeColor(user.role);
                return (
                  <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          background: roleStyle.bg,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User size={16} color={roleStyle.color} />
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: roleStyle.bg,
                        color: roleStyle.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                      {user.statistics.tasksCreated}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                      {user.statistics.tasksAssigned}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
                        {user.statistics.completed}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6c757d' }}>
                        /{user.statistics.tasksAssigned}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: '#ffc107', fontWeight: 'bold' }}>
                        {user.statistics.inProgress}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                        {user.statistics.todo}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="icon-btn icon-btn-delete"
                          style={{
                            background: '#fee',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            margin: '0 auto'
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>Cannot delete</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Add New User</h3>
            
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-icon">
                  <User size={18} />
                  <input
                    type="text"
                    className="input-field"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <div className="input-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    className="input-field"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    className="input-field"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <div className="input-icon">
                  <Shield size={18} />
                  <select
                    className="input-field"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ paddingLeft: '40px' }}
                  >
                    <option value="user">Regular User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;