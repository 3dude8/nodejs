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
exports.toggleCommentLike = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getCommentsForPost = exports.createComment = void 0;
// src/services/commentServices.ts
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
// Create a new comment
const createComment = (content, authorId, postId, parentCommentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify post exists
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    const comment = yield Comment_1.default.create({
        content,
        author: authorId,
        post: postId,
        parentComment: parentCommentId || null
    });
    return yield comment.populate('author', 'name email');
});
exports.createComment = createComment;
// Get comments for a post
const getCommentsForPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield Comment_1.default.find({ post: postId, parentComment: null })
        .populate('author', 'name email')
        .populate('likes', 'name')
        .sort({ createdAt: -1 })
        .lean(); // Convert to plain JavaScript objects
    // Get replies for each comment
    for (let comment of comments) {
        const replies = yield Comment_1.default.find({ parentComment: comment._id })
            .populate('author', 'name email')
            .populate('likes', 'name')
            .sort({ createdAt: 1 })
            .lean(); // Convert to plain JavaScript objects
        comment.replies = replies;
    }
    return comments;
});
exports.getCommentsForPost = getCommentsForPost;
// Get a single comment by ID
const getCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment_1.default.findById(commentId)
        .populate('author', 'name email')
        .populate('likes', 'name email');
    if (!comment) {
        throw new Error('Comment not found');
    }
    return comment;
});
exports.getCommentById = getCommentById;
// Update a comment
const updateComment = (commentId, authorId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment_1.default.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.toString() !== authorId) {
        throw new Error('Not authorized to update this comment');
    }
    comment.content = content;
    comment.isEdited = true;
    return yield comment.save();
});
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = (commentId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment_1.default.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.toString() !== authorId) {
        throw new Error('Not authorized to delete this comment');
    }
    // Delete all replies to this comment
    yield Comment_1.default.deleteMany({ parentComment: commentId });
    return yield Comment_1.default.findByIdAndDelete(commentId);
});
exports.deleteComment = deleteComment;
// Like/unlike a comment
const toggleCommentLike = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield Comment_1.default.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    const likeIndex = comment.likes.findIndex(like => like.toString() === userId);
    if (likeIndex > -1) {
        // Unlike
        comment.likes.splice(likeIndex, 1);
    }
    else {
        // Like
        comment.likes.push(userId);
    }
    yield comment.save();
    return comment;
});
exports.toggleCommentLike = toggleCommentLike;
