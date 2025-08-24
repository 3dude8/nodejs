"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Register new user
router.post('/register', authController_1.registerUser);
// Login user
router.post('/login', authController_1.loginUser);
// Optional logout route (just for client message)
router.get('/logout', authController_1.logoutUser);
exports.default = router;
