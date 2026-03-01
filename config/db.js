/**
 * MongoDB Connection Manager
 * Optimized for serverless environments (Vercel)
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // If already connected, return early
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected (state: connected)');
      isConnected = true;
      return true;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ MongoDB connection in progress...');
      await new Promise((resolve) => {
        mongoose.connection.once('open', resolve);
      });
      isConnected = true;
      return true;
    }

    console.log('🔄 MongoDB connection start.......');
    console.log('📝 MONGO_URI:', process.env.MONGO_URI ? 'is set' : 'NOT SET!');
    
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Connect with optimized options for serverless
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15 second timeout for serverless
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 15000,
    });
    
    console.log('✅ MongoDB connected successfully');
    isConnected = true;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected event fired');
      isConnected = true;
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    
    // For serverless, we log but don't throw to allow the function to handle errors gracefully
    isConnected = false;
    return false;
  }
};

// Function to check if connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Function to get connection status
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = { 
  connectDB, 
  isDbConnected,
  getConnectionStatus,
  mongoose 
};
