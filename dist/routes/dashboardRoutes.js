"use strict";
// src/routes/dashboardRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Dashboard route - protected route that shows user dashboard
router.get('/', auth_1.isAuthenticated, (req, res) => {
    // Get user info from JWT token
    const user = req.user;
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
exports.default = router;
