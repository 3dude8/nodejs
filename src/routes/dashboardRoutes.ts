// src/routes/dashboardRoutes.ts

import { Router, Request, Response } from 'express';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Dashboard route - protected route that shows user dashboard
router.get('/', isAuthenticated, (req: AuthenticatedRequest, res: Response) => {
  // Get user info from JWT token
  const user = req.user!;
  
  console.log('=== DASHBOARD DEBUG ===');
  console.log('User from JWT token:', user);
  console.log('=== END DASHBOARD DEBUG ===');
  
  res.render('dashboard', {
    pageTitle: 'Dashboard',
    message: 'Welcome to your dashboard!',
    userName: user.name,
    userEmail: user.email,
    currentUser: user,
    recentActivities: [
      'Last login: Today',
      'Profile updated: Yesterday',
      'New message received: 2 days ago'
    ]
  });
});

export default router;
