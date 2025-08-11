"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can have the same email
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
