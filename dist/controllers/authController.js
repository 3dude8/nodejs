"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const authServices_1 = require("../services/authServices");
const userServices_1 = require("../services/userServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'SecretKey';
const JWT_EXPIRES_IN = '1h'; // token expiration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // Always allow HTTP (simpler)
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour 
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const newUser = yield (0, userServices_1.createUser)(name, email, password);
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // 🔹 Send token in a secure HTTP-only cookie
        res.cookie('jwt_token', token, COOKIE_OPTIONS);
        return res.redirect('/posts');
    }
    catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).send('User already exists');
        }
        res.status(500).send('Server error');
    }
});
exports.registerUser = registerUser;
// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, authServices_1.authenticateUser)(email, password);
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // 🔹 Send token in a secure HTTP-only cookie
        res.cookie('jwt_token', token, COOKIE_OPTIONS);
        return res.redirect('/posts');
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.loginUser = loginUser;
// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('jwt_token');
    res.redirect('/');
};
exports.logoutUser = logoutUser;
