import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Lock, 
  User,
  Shield,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
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
      toast.success('User created successfully');
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`);
      toast.success('User deleted successfully');
      setShowDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { 
          label: 'Administrator', 
          color: '#764ba2', 
          bg: '#f3e8ff',
          icon: <Shield size={14} />
        };
      case 'manager':
        return { 
          label: 'Manager', 
          color: '#667eea', 
          bg: '#eef2ff',
          icon: <Users size={14} />
        };
      default:
        return { 
          label: 'Regular User', 
          color: '#28a745', 
          bg: '#d4edda',
          icon: <User size={14} />
        };
    }
  };

  const getStatusIcon = (stats) => {
    if (stats.completed > 0 && stats.completionRate > 70) {
      return <CheckCircle size={16} color="#28a745" />;
    } else if (stats.tasksAssigned > 0 && stats.completionRate < 30) {
      return <AlertCircle size={16} color="#dc3545" />;
    }
    return <Clock size={16} color="#ffc107" />;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '32px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 className="dashboard-title">User Management</h1>
          <p className="dashboard-subtitle">Manage all users in the system</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> Create New User
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-icon" style={{ background: '#eef2ff' }}>
            <Users color="#667eea" size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Administrators</div>
            <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
          </div>
          <div className="stat-icon" style={{ background: '#f3e8ff' }}>
            <Shield color="#764ba2" size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Regular Users</div>
            <div className="stat-value">{users.filter(u => u.role === 'user').length}</div>
          </div>
          <div className="stat-icon" style={{ background: '#d4edda' }}>
            <User color="#28a745" size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Tasks Completed</div>
            <div className="stat-value">
              {users.reduce((sum, u) => sum + u.statistics.completed, 0)}
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#d1ecf1' }}>
            <CheckCircle color="#17a2b8" size={24} />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: '#f8f9fa', 
                borderBottom: '2px solid #dee2e6',
                position: 'sticky',
                top: 0
              }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Tasks Created</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Tasks Assigned</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Completed</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Pending</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Completion Rate</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const pendingTasks = user.statistics.tasksAssigned - user.statistics.completed;
                const isCurrentUser = user._id === currentUser?.id;
                
                return (
                  <tr key={user._id} style={{ 
                    borderBottom: '1px solid #dee2e6',
                    background: isCurrentUser ? '#f8f9fa' : 'white'
                  }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: roleBadge.bg,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {roleBadge.icon}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          {isCurrentUser && (
                            <div style={{ fontSize: '11px', color: '#667eea' }}>(You)</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{user.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: roleBadge.bg,
                        color: roleBadge.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                      {user.statistics.tasksCreated}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                      {user.statistics.tasksAssigned}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
                        {user.statistics.completed}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                        {pendingTasks}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '60px',
                          background: '#e9ecef',
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${user.statistics.completionRate}%`,
                            background: user.statistics.completionRate > 70 ? '#28a745' : 
                                       user.statistics.completionRate > 40 ? '#ffc107' : '#dc3545',
                            color: 'white',
                            fontSize: '10px',
                            padding: '2px',
                            textAlign: 'center'
                          }}>
                            {user.statistics.completionRate}%
                          </div>
                        </div>
                        {getStatusIcon(user.statistics)}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {!isCurrentUser && (
                        <button
                          onClick={() => setShowDeleteConfirm(user)}
                          className="btn-danger"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            margin: '0 auto'
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                      {isCurrentUser && (
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>Current User</span>
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
          zIndex: 1000,
          animation: 'fadeIn 0.3s'
        }}>
          <div className="card" style={{ 
            maxWidth: '500px', 
            width: '90%', 
            position: 'relative',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#6c757d'
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Create New User</h3>
            <p style={{ color: '#6c757d', marginBottom: '24px' }}>
              Fill in the details to create a new user account
            </p>
            
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
                <label className="form-label">Email Address *</label>
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
                <label className="form-label">User Role *</label>
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
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
          <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#fee',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Trash2 size={30} color="#dc3545" />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Delete User Account</h3>
              <p style={{ color: '#6c757d', marginBottom: '16px' }}>
                Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?
                <br />
                This will also delete all tasks created by or assigned to this user.
              </p>
              <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '24px' }}>
                This action cannot be undone!
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm._id)}
                className="btn-danger"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AdminUsers;