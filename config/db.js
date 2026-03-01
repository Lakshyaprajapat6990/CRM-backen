/**
 * MongoDB Connection Manager
 * Supports both Mongoose (local dev) and can work with Atlas Data API
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      isConnected = true;
      return;
    }

    console.log('MongoDB connection start.......');
    
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined. Please set it in Vercel project settings.');
    }
    
    // Connect with proper options for serverless
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout for serverless
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    
    console.log('MongoDB connected successfully');
    isConnected = true;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected event fired');
      isConnected = true;
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // For serverless, we don't want to throw and crash the function
    // Instead, we'll return false and let the endpoints handle the error
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
