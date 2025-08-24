"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Comment.ts
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
