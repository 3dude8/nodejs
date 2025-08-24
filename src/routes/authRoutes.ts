import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Optional logout route (just for client message)
router.get('/logout', logoutUser);

export default router;
