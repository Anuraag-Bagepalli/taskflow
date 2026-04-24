import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight,
  LayoutDashboard,
  Clock,
  Target,
  Zap,
  Award,
  BarChart3,
  LogIn,
  UserPlus
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Role-Based Access',
      description: 'Admin, Manager, and User roles with strict permission controls',
      color: '#667eea'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Smart Insights',
      description: 'AI-powered analytics and task performance insights',
      color: '#764ba2'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with ease',
      color: '#28a745'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Real-time Analytics',
      description: 'Visual dashboards with charts and metrics',
      color: '#17a2b8'
    },
    {
      icon: <Target size={32} />,
      title: 'Goal Tracking',
      description: 'Monitor completion rates and productivity',
      color: '#ffc107'
    },
    {
      icon: <Users size={32} />,
      title: 'Team Collaboration',
      description: 'Assign tasks and track team performance',
      color: '#fd7e14'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime', icon: <Zap size={20} /> },
    { number: '10k+', label: 'Tasks Completed', icon: <CheckCircle size={20} /> },
    { number: '500+', label: 'Active Users', icon: <Users size={20} /> },
    { number: '24/7', label: 'Support', icon: <Clock size={20} /> }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={styles.badge}>
              <Award size={16} />
              <span>Smart Task Management Platform</span>
            </div>
            <h1 style={styles.title}>
              Streamline Your Workflow with{' '}
              <span style={{ background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)', 
                             WebkitBackgroundClip: 'text', 
                             backgroundClip: 'text', 
                             color: 'transparent' }}>
                Smart Insights
              </span>
            </h1>
            <p style={styles.subtitle}>
              Powerful task management with RBAC, real-time analytics, and AI-powered insights. 
              Perfect for teams of all sizes.
            </p>
            <div style={styles.buttonGroup}>
              <Link to="/register" style={styles.primaryButton}>
                Get Started Free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
              <Link to="/login" style={styles.secondaryButton}>
                <LogIn size={18} style={{ marginRight: '8px' }} />
                Sign In
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={styles.heroImage}
          >
            <div style={styles.dashboardPreview}>
              <div style={styles.previewHeader}>
                <div style={styles.previewDots}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
                <div style={styles.previewTitle}>TaskFlow Dashboard</div>
              </div>
              <div style={styles.previewContent}>
                <div style={styles.previewStat}>
                  <div style={styles.previewStatValue}>85%</div>
                  <div style={styles.previewStatLabel}>Completion Rate</div>
                </div>
                <div style={styles.previewChart}>
                  <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '40px', height: '60px', background: '#667eea', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '80px', background: '#764ba2', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '45px', background: '#28a745', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '70px', background: '#ffc107', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              style={styles.statCard}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.sectionHeader}
        >
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to manage tasks efficiently
          </p>
        </motion.div>

        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              style={styles.featureCard}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div style={{ ...styles.featureIcon, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.ctaCard}
        >
          <h2 style={styles.ctaTitle}>Ready to boost your productivity?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of users who are already managing their tasks smarter
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/register" style={styles.ctaPrimaryButton}>
              Create Free Account <UserPlus size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/login" style={styles.ctaSecondaryButton}>
              <LogIn size={18} style={{ marginRight: '8px' }} />
              Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <div style={styles.logoIcon}></div>
              <span style={styles.logoText}>TaskFlow</span>
            </div>
            <p style={styles.footerText}>
              Smart task management with AI-powered insights
            </p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerColumn}>
              <h4>Product</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/demo">Demo</Link>
            </div>
            <div style={styles.footerColumn}>
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div style={styles.footerColumn}>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2024 TaskFlow. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
  },
  heroSection: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
    },
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '50px',
    marginBottom: '24px',
    color: 'white',
    fontSize: '14px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: '1.2',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      fontSize: '36px',
    },
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'white',
    color: '#667eea',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.2s',
  },
  heroImage: {
    '@media (max-width: 768px)': {
      marginTop: '40px',
    },
  },
  dashboardPreview: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  previewHeader: {
    background: '#f8f9fa',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  previewDots: {
    display: 'flex',
    gap: '6px',
  },
  previewTitle: {
    fontSize: '14px',
    color: '#6c757d',
  },
  previewContent: {
    padding: '24px',
  },
  previewStat: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  previewStatValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  previewStatLabel: {
    fontSize: '12px',
    color: '#6c757d',
  },
  previewChart: {
    height: '100px',
  },
  statsSection: {
    background: 'white',
    padding: '60px 20px',
  },
  statsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    background: '#eef2ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#667eea',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6c757d',
  },
  featuresSection: {
    background: '#f8f9fa',
    padding: '80px 20px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#6c757d',
  },
  featuresGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  featureIcon: {
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.6',
  },
  ctaSection: {
    padding: '80px 20px',
  },
  ctaCard: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: '#6c757d',
    marginBottom: '32px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  ctaPrimaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.2s',
  },
  ctaSecondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'white',
    color: '#667eea',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    border: '2px solid #667eea',
    transition: 'transform 0.2s',
  },
  footer: {
    background: '#1a1a2e',
    color: 'white',
    padding: '60px 20px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '60px',
    marginBottom: '40px',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
    borderRadius: '8px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerColumnH4: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  footerColumnA: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
};

// Add hover effect styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .btn-primary:hover, .btn-secondary:hover, .cta-primary-button:hover, .cta-secondary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  
  .stat-card:hover {
    transform: translateY(-3px);
  }
  
  a:hover {
    color: #667eea !important;
  }
`;
document.head.appendChild(styleSheet);

export default LandingPage;