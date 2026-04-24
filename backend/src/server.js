const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars - Make sure this is at the very top
console.log('Current directory:', __dirname);
console.log('Loading .env from:', path.join(__dirname, '..', '.env'));

// Try to load .env file explicitly
const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message);
  console.log('Please create a .env file in the backend directory with:');
  console.log('PORT=5000');
  console.log('MONGODB_URI=mongodb://localhost:27017/rbac_task_manager');
  console.log('JWT_SECRET=your_super_secret_jwt_key_change_this_in_production');
  console.log('JWT_EXPIRE=7d');
  process.exit(1);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('Environment variables loaded:');
  console.log('- PORT:', process.env.PORT);
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
}

// Connect to database
const connectDB = require('./config/database');

// Route files
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both CRA and Vite ports
  credentials: true,
}));

// Connect to database BEFORE starting server
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
    });

    // Handle unhandled promise rejections
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