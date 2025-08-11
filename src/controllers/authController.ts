// src/controllers/authController.ts

import { Request, Response } from 'express';
// Import the services
import { authenticateUser } from '../services/authServices';
import { createUser } from '../services/userServices';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await createUser(name, email, password);
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const logoutUser = (req: Request, res: Response) => {
  console.log('User logged out');
  res.redirect('/');
};