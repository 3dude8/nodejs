// src/services/userServices.ts

import User from '../models/User';
import bcrypt from 'bcryptjs';

// Function to get all users from the database
export const getAllUsers = async () => {
    return await User.find().select('-password'); // Exclude password from results
};

// Function to get a single user by ID
export const getUserById = async (id: string) => {
    return await User.findById(id).select('-password');
};

// Function to create a new user
export const createUser = async (name: string, email: string, password_sent: string) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_sent, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    return newUser;
};

// Function to update a user
export const updateUser = async (id: string, name: string, email: string, password_sent: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    if (password_sent) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password_sent, salt);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    return await user.save();
};

// Function to delete a user
export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};

// Function to search for users
export const searchUsers = async (query: string) => {
    return await User.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ],
    }).select('-password');
};