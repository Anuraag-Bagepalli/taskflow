import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, User, Shield, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Users', href: '/admin/users', icon: Users });
    navigation.push({ name: 'Overview', href: '/admin', icon: Shield });
  }

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin':
        return { bg: '#f3e8ff', color: '#764ba2' };
      case 'manager':
        return { bg: '#eef2ff', color: '#667eea' };
      default:
        return { bg: '#d4edda', color: '#28a745' };
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleStyle = getRoleBadgeColor();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-brand-logo"></div>
          <span className="navbar-brand-text">TaskFlow</span>
        </Link>

        <div className="navbar-links">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
          
          <div className="user-info">
            <div className="user-avatar" style={{ background: roleStyle.bg, color: roleStyle.color }}>
              <User size={16} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                {user?.role}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;