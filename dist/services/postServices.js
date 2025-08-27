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
exports.searchPosts = exports.togglePostLike = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const data_source_1 = require("../config/data-source");
const Post_1 = require("../entities/Post");
const Comment_1 = require("../entities/Comment");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
// Create a new post
const createPost = (title_1, content_1, authorId_1, ...args_1) => __awaiter(void 0, [title_1, content_1, authorId_1, ...args_1], void 0, function* (title, content, authorId, tags = []) {
    const post = new Post_1.Post();
    post.title = title;
    post.content = content;
    post.author = { id: parseInt(authorId) };
    post.tags = tags;
    yield data_source_1.AppDataSource.manager.save(post);
    return post;
});
exports.createPost = createPost;
// Get all posts with pagination
const getPosts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = yield data_source_1.AppDataSource.manager.findAndCount(Post_1.Post, {
        where: { isPublished: true },
        relations: ['author', 'likes'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit
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
exports.getPosts = getPosts;
// Get a single post by ID
const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield data_source_1.AppDataSource.manager.findOne(Post_1.Post, {
        where: { id: parseInt(postId) },
        relations: ['author', 'likes']
    });
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
});
exports.getPostById = getPostById;
// Update a post
const updatePost = (postId, authorId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield data_source_1.AppDataSource.manager.findOne(Post_1.Post, {
        where: { id: parseInt(postId) },
        relations: ['author']
    });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.id.toString() !== authorId) {
        throw new Error('Not authorized to update this post');
    }
    Object.assign(post, updates);
    return yield data_source_1.AppDataSource.manager.save(post);
});
exports.updatePost = updatePost;
// Delete a post
const deletePost = (postId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield data_source_1.AppDataSource.manager.findOne(Post_1.Post, {
        where: { id: parseInt(postId) },
        relations: ['author']
    });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.author.id.toString() !== authorId) {
        throw new Error('Not authorized to delete this post');
    }
    // Delete all comments for this post
    yield data_source_1.AppDataSource.manager.delete(Comment_1.Comment, { post: { id: parseInt(postId) } });
    return yield data_source_1.AppDataSource.manager.remove(Post_1.Post, post);
});
exports.deletePost = deletePost;
// Like/unlike a post
const togglePostLike = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield data_source_1.AppDataSource.manager.findOne(Post_1.Post, {
        where: { id: parseInt(postId) },
        relations: ['likes']
    });
    if (!post) {
        throw new Error('Post not found');
    }
    const likeIndex = post.likes.findIndex(like => like.id.toString() === userId);
    if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
    }
    else {
        // Like
        const user = yield data_source_1.AppDataSource.manager.findOne(User_1.User, { where: { id: parseInt(userId) } });
        if (user) {
            post.likes.push(user);
        }
    }
    yield data_source_1.AppDataSource.manager.save(post);
    return post;
});
exports.togglePostLike = togglePostLike;
// Search posts
const searchPosts = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = yield data_source_1.AppDataSource.manager.findAndCount(Post_1.Post, {
        where: {
            title: (0, typeorm_1.Like)(`%${query}%`),
            isPublished: true
        },
        relations: ['author', 'likes'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit
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
