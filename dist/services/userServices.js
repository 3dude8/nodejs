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
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Function to get all users from the database
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.manager.find(User_1.User, { select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
});
exports.getAllUsers = getAllUsers;
// Function to get a single user by ID
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(id) }, select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
});
exports.getUserById = getUserById;
// Function to create a new user
const createUser = (name, email, password_sent) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { email } });
    if (userExists) {
        throw new Error('User already exists');
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password_sent, salt);
    const newUser = new User_1.User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    yield data_source_1.AppDataSource.manager.save(newUser);
    return newUser;
});
exports.createUser = createUser;
// Function to update a user
const updateUser = (id, name, email, password_sent) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(id) } });
    if (!user) {
        throw new Error('User not found');
    }
    if (password_sent) {
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password_sent, salt);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    return yield data_source_1.AppDataSource.manager.save(user);
});
exports.updateUser = updateUser;
// Function to delete a user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(id) } });
    if (user) {
        return yield data_source_1.AppDataSource.manager.remove(user);
    }
    return null;
});
exports.deleteUser = deleteUser;
// Function to search for users
const searchUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.manager
        .createQueryBuilder(User_1.User, 'user')
        .select(['user.id', 'user.name', 'user.email', 'user.createdAt', 'user.updatedAt'])
        .where('user.name LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
        .getMany();
});
exports.searchUsers = searchUsers;
