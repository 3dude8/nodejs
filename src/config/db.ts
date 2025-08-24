// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect('mongodb://localhost:27017/blogapp');
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    
    // Listen for connection events
    mongoose.connection.on('connected', () => {
      console.log('🎉 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });
    
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Failed:`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Make sure MongoDB is running on localhost:27017`);
    process.exit(1);
  }
};

export default connectDB;