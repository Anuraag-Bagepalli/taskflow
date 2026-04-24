const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB Atlas...');
    console.log('Using database:', process.env.MONGODB_URI.includes('/taskflow') ? 'taskflow' : 'default');
    
    // Simple connection for Mongoose 8+
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database Name: ${conn.connection.name || 'taskflow'}`);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n💡 Tip: Make sure your IP is whitelisted in MongoDB Atlas');
    console.log('   Go to Network Access → Add IP Address → 0.0.0.0/0');
    process.exit(1);
  }
};

module.exports = connectDB;