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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersController = exports.deleteUserController = exports.updateUserController = exports.createUserController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const userServices_1 = require("../services/userServices");
// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userServices_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllUsersController = getAllUsersController;
// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userServices_1.getUserById)(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserByIdController = getUserByIdController;
// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const newUser = yield (0, userServices_1.createUser)(name, email, password);
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };
        res.status(201).json(userResponse);
    }
    catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createUserController = createUserController;
// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private (JWT)
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        // Only allow users to update their own data
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        const updatedUser = yield (0, userServices_1.updateUser)(req.params.id, name, email, password);
        const userResponse = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        };
        res.json(userResponse);
    }
    catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserController = updateUserController;
// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (JWT)
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }
        const user = yield (0, userServices_1.deleteUser)(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUserController = deleteUserController;
// @desc    Search for users by name or email
// @route   GET /api/users/search?query=...
// @access  Public
const searchUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (req.query.query || '').toLowerCase();
    try {
        const users = yield (0, userServices_1.searchUsers)(query);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchUsersController = searchUsersController;
