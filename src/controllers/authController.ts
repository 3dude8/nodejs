// src/controllers/authController.ts
import { Request, Response } from 'express';
import { authenticateUser } from '../services/authServices';
import { createUser } from '../services/userServices';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SecretKey';
const JWT_EXPIRES_IN = '1h'; // token expiration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Always allow HTTP (simpler)
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 1000 // 1 hour 
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await createUser(name, email, password);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 🔹 Send token in a secure HTTP-only cookie
    res.cookie('jwt_token', token, COOKIE_OPTIONS);
    return res.redirect('/posts');
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return res.status(400).send('User already exists');
    }
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 🔹 Send token in a secure HTTP-only cookie
    res.cookie('jwt_token', token, COOKIE_OPTIONS);
    return res.redirect('/posts');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
  // Clear the JWT cookie
  res.clearCookie('jwt_token');
  res.redirect('/');
};
