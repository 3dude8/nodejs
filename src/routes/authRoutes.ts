import { Router, Request, Response } from 'express';
import { loginUser, logoutUser } from '../controllers/authController';

const router = Router();

interface DashboardViewData {
  pageTitle: string;
  message: string;
  userName: string;
  userEmail: string;
  recentActivities: string[];
  currentTime: string;
}

const getPalestineTime = () => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
};

router.get('/login', (req: Request, res: Response) => {
  const errorMessage = req.query.error === 'invalid_credentials' ? 'Invalid email or password.' :
                       req.query.error === 'missing_credentials' ? 'Please fill in all fields.' :
                       '';
  const successMessage = req.query.message === 'logged_out' ? 'You have been successfully logged out.' : '';

  res.render('login', {
    pageTitle: 'User Login',
    message: 'Please enter your credentials.',
    currentTime: getPalestineTime(),
    errorMessage: errorMessage,
    successMessage: successMessage
  });
});

router.get('/register', (req: Request, res: Response) => {
  res.render('register', {
    pageTitle: 'Create New Account',
    message: 'Join us today!',
    currentTime: getPalestineTime()
  });
});

router.get('/dashboard', (req: Request, res: Response) => {
    const viewData: DashboardViewData = {
        pageTitle: 'Your Personal Dashboard',
        message: 'Welcome back!',
        userName: 'Demo User',
        userEmail: 'demo.user@example.com',
        recentActivities: [
            'Logged in 5 minutes ago',
            'Viewed profile',
            'Made a test payment'
        ],
        currentTime: getPalestineTime()
    };

    res.render('dashboard', viewData);
});

router.post('/users/login', loginUser);
router.get('/logout', logoutUser);

export default router;