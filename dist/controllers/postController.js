"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.togglePostLike = exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = exports.renderPostsPage = exports.renderCreatePostPage = void 0;
const postServices = __importStar(require("../services/postServices"));
// @desc    Render create post page
// @route   GET /posts/create
// @access  Private
const renderCreatePostPage = (req, res) => {
    if (!req.user) {
        return res.redirect('/login'); // only logged in users can create
    }
    res.render('create-post', {
        pageTitle: 'Create Post',
        currentUser: req.user
    });
};
exports.renderCreatePostPage = renderCreatePostPage;
// @desc    Render posts listing page
// @route   GET /posts
// @access  Public
const renderPostsPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield postServices.getPosts(1, 100); // Get first 100 posts
        const posts = result.posts;
        const cleanPosts = posts.map(post => (Object.assign(Object.assign({}, post), { content: post.content || '', createdAt: post.createdAt || new Date(), author: post.author || { name: 'Unknown', email: '' }, likes: post.likes || [] })));
        res.render('posts', {
            pageTitle: 'All Posts',
            posts: cleanPosts,
            currentUser: req.user // ✅ pass user into Handlebars
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
exports.renderPostsPage = renderPostsPage;
// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, tags } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const tagArray = tags
            ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
            : [];
        yield postServices.createPost(title, content, req.user.id, tagArray);
        // Redirect to posts page after creation
        res.redirect('/posts');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});
exports.createPost = createPost;
// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield postServices.getPosts(page, limit);
        res.render('posts', {
            pageTitle: 'All Posts',
            posts: result.posts,
            pagination: result.pagination,
            currentUser: req.user // ✅ keeps user for buttons
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPosts = getPosts;
// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postServices.getPostById(req.params.id);
        // Fetch comments for this post
        const commentServices = yield Promise.resolve().then(() => __importStar(require('../services/commentServices')));
        const comments = yield commentServices.getCommentsForPost(req.params.id);
        res.render('post-detail', {
            pageTitle: post.title,
            post,
            comments,
            currentUser: req.user // ✅ keeps user
        });
    }
    catch (error) {
        console.error('Error in getPost:', error);
        res.status(404).render('error', {
            pageTitle: 'Post Not Found',
            message: 'Post not found'
        });
    }
});
exports.getPost = getPost;
// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: 'Not authorized' });
        const { title, content, tags } = req.body;
        const post = yield postServices.updatePost(req.params.id, req.user.id, {
            title,
            content,
            tags
        });
        res.json({ message: 'Post updated successfully', post });
    }
    catch (error) {
        if (error.message === 'Post not found')
            return res.status(404).json({ message: 'Post not found' });
        if (error.message === 'Not authorized to update this post')
            return res.status(403).json({ message: 'Not authorized' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updatePost = updatePost;
// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: 'Not authorized' });
        yield postServices.deletePost(req.params.id, req.user.id);
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        if (error.message === 'Post not found')
            return res.status(404).json({ message: 'Post not found' });
        if (error.message === 'Not authorized to delete this post')
            return res.status(403).json({ message: 'Not authorized' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deletePost = deletePost;
// @desc    Like/unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const togglePostLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('No user found in request:', req.user);
            return res.status(401).json({ message: 'You must be logged in to like a post' });
        }
        console.log('User attempting to like post:', req.user.id, 'Post ID:', req.params.id);
        const post = yield postServices.togglePostLike(req.params.id, req.user.id);
        res.json({
            message: 'Post like toggled successfully',
            likesCount: post.likes.length,
            isLiked: post.likes.some(like => like.toString() === req.user.id)
        });
    }
    catch (error) {
        console.error('Error in togglePostLike:', error);
        if (error.message === 'Post not found')
            return res.status(404).json({ message: 'Post not found' });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});
exports.togglePostLike = togglePostLike;
