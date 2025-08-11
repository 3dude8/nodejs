// src/controllers/userController.ts

import { Request, Response } from 'express';
// Import all functions from the user services file
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
} from '../services/userServices';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await createUser(name, email, password);
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    res.status(201).json(userResponse);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUserController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const updatedUser = await updateUser(req.params.id, name, email, password);
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
    res.json(userResponse);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search for users by name or email
// @route   GET /api/users/search?query=...
// @access  Public
export const searchUsersController = async (req: Request, res: Response) => {
  const query = (req.query.query as string || '').toLowerCase();
  try {
    const users = await searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};