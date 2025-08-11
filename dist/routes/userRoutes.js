"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Keep your existing controller import for API endpoints
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Helper to get current time in Palestine
const getPalestineTime = () => {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jerusalem', // Specific for Palestine/Israel time
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
    }).format(new Date());
};
// --- View Rendering Routes ---
// GET route for the Login Page
// This will render 'src/views/login.hbs'
router.get('/login', (req, res) => {
    res.render('login', {
        pageTitle: 'User Login',
        message: 'Please enter your credentials.',
        currentTime: getPalestineTime()
    });
});
// GET route for the Register Page
// This will render 'src/views/register.hbs'
router.get('/register', (req, res) => {
    res.render('register', {
        pageTitle: 'Create New Account',
        message: 'Join us today!',
        currentTime: getPalestineTime()
    });
});
// GET route for a simple Dashboard Page (placeholder for logged-in view)
// This will render 'src/views/dashboard.hbs'
router.get('/dashboard', (req, res) => {
    // In a real app, you'd fetch actual user data from session/DB here
    const userName = 'Demo User'; // Placeholder name
    const recentActivities = [
        'Logged in 5 minutes ago',
        'Viewed profile',
        'Made a test payment'
    ];
    res.render('dashboard', {
        pageTitle: 'Your Personal Dashboard',
        message: 'Welcome back!',
        userName: userName, // Pass user's name to template
        recentActivities: recentActivities, // Pass activities to template
        currentTime: getPalestineTime()
    });
});
// --- API Routes (These are separate from view rendering) ---
// POST route for handling user login form submission (API endpoint)
// This would process the login logic and likely return JSON, not a rendered view.
// The form in 'login.hbs' might submit to this endpoint.
router.post('/users/login', authController_1.loginUser);
// You would typically have a similar POST endpoint for registration:
// router.post('/users/register', someRegisterControllerFunction);
exports.default = router;
