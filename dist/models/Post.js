"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Post.ts
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
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
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    tags: [{
            type: String,
            trim: true
        }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Add text index for search functionality
postSchema.index({ title: 'text', content: 'text' });
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
