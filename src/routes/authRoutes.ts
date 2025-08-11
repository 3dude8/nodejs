// src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// API endpoint for new user registration
router.post('/register', registerUser);

// Corrected API endpoint for user login
// Changed from '/users/login' to '/login'
router.post('/login', loginUser);

// API endpoint for user logout
router.get('/logout', logoutUser);

export default router;