"use strict";
// src/services/userServices.ts
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
exports.searchUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Function to get all users from the database
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.find().select('-password'); // Exclude password from results
});
exports.getAllUsers = getAllUsers;
// Function to get a single user by ID
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findById(id).select('-password');
});
exports.getUserById = getUserById;
// Function to create a new user
const createUser = (name, email, password_sent) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password_sent, salt);
    const newUser = yield User_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    return newUser;
});
exports.createUser = createUser;
// Function to update a user
const updateUser = (id, name, email, password_sent) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    if (password_sent) {
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password_sent, salt);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    return yield user.save();
});
exports.updateUser = updateUser;
// Function to delete a user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findByIdAndDelete(id);
});
exports.deleteUser = deleteUser;
// Function to search for users
const searchUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ],
    }).select('-password');
});
exports.searchUsers = searchUsers;
