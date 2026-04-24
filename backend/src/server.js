const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Route files
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./config/database');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN,
  'https://*.onrender.com',
  'https://*.pages.dev'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(null, true); // Allow anyway for now
    }
  },
  credentials: true,
}));

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Start server function
const startServer = async () => {
  try {
    await connectDB();
    
    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/insights', insightsRoutes);
    app.use('/api/admin', adminRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err.stack);
      res.status(500).json({ success: false, message: 'Something went wrong!' });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' });
    });

    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`❤️ Health check at http://localhost:${PORT}/health`);
    });

    process.on('unhandledRejection', (err, promise) => {
      console.log('❌ Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();