// src/services/userServices.ts

import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

// Function to get all users from the database
export const getAllUsers = async () => {
    return await AppDataSource.manager.find(User, { select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
};

// Function to get a single user by ID
export const getUserById = async (id: string) => {
    return await AppDataSource.manager.findOne(User, { where: { id: parseInt(id) }, select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
};

// Function to create a new user
export const createUser = async (name: string, email: string, password_sent: string) => {
    const userExists = await AppDataSource.manager.findOne(User, { where: { email } });
    if (userExists) {
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_sent, salt);

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;

    await AppDataSource.manager.save(newUser);
    return newUser;
};

// Function to update a user
export const updateUser = async (id: string, name: string, email: string, password_sent: string) => {
    const user = await AppDataSource.manager.findOne(User, { where: { id: parseInt(id) } });
    if (!user) {
        throw new Error('User not found');
    }

    if (password_sent) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password_sent, salt);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    return await AppDataSource.manager.save(user);
};

// Function to delete a user
export const deleteUser = async (id: string) => {
    const user = await AppDataSource.manager.findOne(User, { where: { id: parseInt(id) } });
    if (user) {
        return await AppDataSource.manager.remove(user);
    }
    return null;
};

// Function to search for users
export const searchUsers = async (query: string) => {
    return await AppDataSource.manager
        .createQueryBuilder(User, 'user')
        .select(['user.id', 'user.name', 'user.email', 'user.createdAt', 'user.updatedAt'])
        .where('user.name LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
        .getMany();
};
