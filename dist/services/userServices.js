"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUsers = exports.readUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_1 = require("../types/users");
const usersFilePath = path_1.default.join(__dirname, '../data/users.json');
const readUsers = () => {
    const data = fs_1.default.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    return users.map(u => new users_1.User(u.id, u.name, u.email, u.password));
};
exports.readUsers = readUsers;
const writeUsers = (users) => {
    fs_1.default.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};
exports.writeUsers = writeUsers;
