"use strict";
// src/routes/authRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// API endpoint for new user registration
router.post('/register', authController_1.registerUser);
// Corrected API endpoint for user login
// Changed from '/users/login' to '/login'
router.post('/login', authController_1.loginUser);
// API endpoint for user logout
router.get('/logout', authController_1.logoutUser);
exports.default = router;
