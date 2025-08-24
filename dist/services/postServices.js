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
exports.searchPosts = exports.togglePostLike = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
// Create a new post
const createPost = (title_1, content_1, authorId_1, ...args_1) => __awaiter(void 0, [title_1, content_1, authorId_1, ...args_1], void 0, function* (title, content, authorId, tags = []) {
    const post = yield Post_1.default.create({
        title,
        content,
        author: authorId,
        tags
    });
    // Always populate author since we're using real user IDs now
    return yield post.populate('author', 'name email');
});
exports.createPost = createPost;
// Get all posts with pagination
const getPosts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = yield Post_1.default.find({ isPublished: true })
        .populate('author', 'name email')
        .populate('likes', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield Post_1.default.countDocuments({ isPublished: true });
    return {
        posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
});
exports.getPosts = getPosts;
// Get a single post by ID
const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(postId)
        .populate('author', 'name email')
        .populate('likes', 'name email')
        .lean();
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
});
exports.getPostById = getPostById;
// Update a post
const updatePost = (postId, authorId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.toString() !== authorId) {
        throw new Error('Not authorized to update this post');
    }
    Object.assign(post, updates);
    return yield post.save();
});
exports.updatePost = updatePost;
// Delete a post
const deletePost = (postId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.toString() !== authorId) {
        throw new Error('Not authorized to delete this post');
    }
    // Delete all comments for this post
    yield Comment_1.default.deleteMany({ post: postId });
    return yield Post_1.default.findByIdAndDelete(postId);
});
exports.deletePost = deletePost;
// Like/unlike a post
const togglePostLike = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    const likeIndex = post.likes.findIndex(like => like.toString() === userId);
    if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
    }
    else {
        // Like
        post.likes.push(userId);
    }
    yield post.save();
    return post;
});
exports.togglePostLike = togglePostLike;
// Search posts
const searchPosts = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = yield Post_1.default.find({
        $text: { $search: query },
        isPublished: true
    }, { score: { $meta: "textScore" } })
        .populate('author', 'name email')
        .populate('likes', 'name')
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit);
    const total = yield Post_1.default.countDocuments({
        $text: { $search: query },
        isPublished: true
    });
    return {
        posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
});
exports.searchPosts = searchPosts;
