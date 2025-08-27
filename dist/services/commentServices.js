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
exports.toggleCommentLike = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getCommentsForPost = exports.createComment = void 0;
const data_source_1 = require("../config/data-source");
const Comment_1 = require("../entities/Comment");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
// Create a new comment
const createComment = (content, authorId, postId, parentCommentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify post exists
    const post = yield data_source_1.AppDataSource.manager.findOne(Post_1.Post, { where: { id: parseInt(postId) } });
    if (!post) {
        throw new Error('Post not found');
    }
    const comment = new Comment_1.Comment();
    comment.content = content;
    comment.author = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(authorId) } });
    comment.post = post;
    comment.parentComment = parentCommentId ? yield data_source_1.AppDataSource.manager.findOne(Comment_1.Comment, { where: { id: parseInt(parentCommentId) } }) : null;
    yield data_source_1.AppDataSource.manager.save(comment);
    return comment;
});
exports.createComment = createComment;
// Get comments for a post
const getCommentsForPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield data_source_1.AppDataSource.manager.find(Comment_1.Comment, {
        where: { post: { id: parseInt(postId) }, parentComment: null },
        relations: ['author', 'likes'],
        order: { createdAt: 'DESC' }
    });
    // Get replies for each comment
    for (let comment of comments) {
        const replies = yield data_source_1.AppDataSource.manager.find(Comment_1.Comment, {
            where: { parentComment: { id: comment.id } },
            relations: ['author', 'likes'],
            order: { createdAt: 'ASC' }
        });
        comment.replies = replies;
    }
    return comments;
});
exports.getCommentsForPost = getCommentsForPost;
// Get a single comment by ID
const getCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield data_source_1.AppDataSource.manager.findOne(Comment_1.Comment, {
        where: { id: parseInt(commentId) },
        relations: ['author', 'likes']
    });
    if (!comment) {
        throw new Error('Comment not found');
    }
    return comment;
});
exports.getCommentById = getCommentById;
// Update a comment
const updateComment = (commentId, authorId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield data_source_1.AppDataSource.manager.findOne(Comment_1.Comment, { where: { id: parseInt(commentId) } });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.id.toString() !== authorId) {
        throw new Error('Not authorized to update this comment');
    }
    comment.content = content;
    comment.isEdited = true;
    return yield data_source_1.AppDataSource.manager.save(comment);
});
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = (commentId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield data_source_1.AppDataSource.manager.findOne(Comment_1.Comment, { where: { id: parseInt(commentId) } });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.author.id.toString() !== authorId) {
        throw new Error('Not authorized to delete this comment');
    }
    // Delete all replies to this comment
    yield data_source_1.AppDataSource.manager.delete(Comment_1.Comment, { parentComment: { id: parseInt(commentId) } });
    return yield data_source_1.AppDataSource.manager.remove(Comment_1.Comment, comment);
});
exports.deleteComment = deleteComment;
// Like/unlike a comment
const toggleCommentLike = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield data_source_1.AppDataSource.manager.findOne(Comment_1.Comment, { where: { id: parseInt(commentId) } });
    if (!comment) {
        throw new Error('Comment not found');
    }
    const likeIndex = comment.likes.findIndex(like => like.id.toString() === userId);
    if (likeIndex > -1) {
        // Unlike
        comment.likes.splice(likeIndex, 1);
    }
    else {
        // Like
        const user = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(userId) } });
        if (user) {
            comment.likes.push(user);
        }
    }
    yield data_source_1.AppDataSource.manager.save(comment);
    return comment;
});
exports.toggleCommentLike = toggleCommentLike;
