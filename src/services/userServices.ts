// src/services/userServices.ts

import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { getCache, setCache, deleteCache, cacheKeys } from '../utils/redis';

// Function to get all users from the database
export const getAllUsers = async () => {
    return await AppDataSource.manager.find(User, { select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
};

// Function to get a single user by ID
export const getUserById = async (id: string) => {
    const cacheKey = cacheKeys.user(id);
    
    // Try to get from cache first
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
        console.log('📦 Cache hit for user');
        return cachedUser;
    }
    
    console.log('🔄 Cache miss for user, querying database');
    const user = await AppDataSource.manager.findOne(User, { 
        where: { id: parseInt(id) }, 
        select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] 
    });
    
    if (user) {
        // Cache the user profile for 15 minutes
        await setCache(cacheKey, user, 900);
    }
    
    return user;
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
    
    const updatedUser = await AppDataSource.manager.save(user);
    
    // Invalidate cache for this user
    await deleteCache(cacheKeys.user(id));
    
    return updatedUser;
};

// Function to delete a user
export const deleteUser = async (id: string) => {
    const user = await AppDataSource.manager.findOne(User, { where: { id: parseInt(id) } });
    if (user) {
        const result = await AppDataSource.manager.remove(user);
        
        // Invalidate cache for this user
        await deleteCache(cacheKeys.user(id));
        
        return result;
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
