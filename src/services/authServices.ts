// src/services/authServices.ts

import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

// Function to authenticate a user against the database
export const authenticateUser = async (email: string, password_sent: string) => {
    try {
        // Find the user by email
        const user = await AppDataSource.manager.findOne(User, { where: { email } });

        // If the user exists and the password is correct, return the user
        if (user && (await bcrypt.compare(password_sent, user.password))) {
            return user;
        } else {
            return null; // Return null if authentication fails
        }
    } catch (error) {
        console.error('Authentication service error:', error);
        return null;
    }
};
