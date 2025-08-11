// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/yourdbname'); // Replace 'yourdbname' with your desired database name
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error: any) {
    console.error(`Error: ${error.message} ❌`);
    process.exit(1);
  }
};

export default connectDB;