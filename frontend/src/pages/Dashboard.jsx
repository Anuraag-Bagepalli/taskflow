import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ClipboardList, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/insights`);
      setInsights(response.data.insights);
    } catch (error) {
      toast.error('Failed to load dashboard insights');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = { todo: '#F59E0B', 'in-progress': '#3B82F6', done: '#10B981' };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!insights) return null;

  const statusData = insights.tasksByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Smart Insights Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{insights.summary.totalTasks}</div>
          </div>
          <div className="stat-icon" style={{ background: '#eef2ff' }}>
            <ClipboardList color="#667eea" size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: '#28a745' }}>{insights.summary.completedTasks}</div>
          </div>
          <div className="stat-icon" style={{ background: '#d4edda' }}>
            <CheckCircle color="#28a745" size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#ffc107' }}>{insights.summary.pendingTasks}</div>
          </div>
          <div className="stat-icon" style={{ background: '#fff3cd' }}>
            <Clock color="#ffc107" size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Completion Rate</div>
            <div className="stat-value" style={{ color: '#764ba2' }}>{insights.summary.completionRate}%</div>
          </div>
          <div className="stat-icon" style={{ background: '#f3e8ff' }}>
            <Target color="#764ba2" size={24} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" label dataKey="value" outerRadius={80}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            {statusData.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: COLORS[s.name], borderRadius: '50%' }}></div>
                <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.tasksByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="insights-card">
        <div className="insights-title">
          <TrendingUp size={20} color="#764ba2" />
          <span>AI-Powered Insights</span>
        </div>
        {insights.insights?.map((insight, idx) => (
          <div key={idx} className={`insight-item insight-${insight.type}`}>
            <TrendingUp size={16} />
            <p style={{ margin: 0, fontSize: '14px' }}>{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;