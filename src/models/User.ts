// src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const User = mongoose.model('User', userSchema);

export default User;