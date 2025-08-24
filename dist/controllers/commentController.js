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
exports.toggleCommentLike = exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const commentServices = __importStar(require("../services/commentServices"));
// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, postId, parentCommentId } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const comment = yield commentServices.createComment(content, req.user.id, postId, parentCommentId);
        res.redirect(`/posts/${postId}`);
    }
    catch (error) {
        if (error.message === 'Post not found')
            return res.status(404).json({ message: 'Post not found' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createComment = createComment;
// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: 'Not authorized' });
        const comment = yield commentServices.updateComment(req.params.id, req.user.id, content);
        res.json({ message: 'Comment updated successfully', comment });
    }
    catch (error) {
        if (error.message === 'Comment not found')
            return res.status(404).json({ message: 'Comment not found' });
        if (error.message === 'Not authorized to update this comment')
            return res.status(403).json({ message: 'Not authorized' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateComment = updateComment;
// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: 'Not authorized' });
        yield commentServices.deleteComment(req.params.id, req.user.id);
        res.json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        if (error.message === 'Comment not found')
            return res.status(404).json({ message: 'Comment not found' });
        if (error.message === 'Not authorized to delete this comment')
            return res.status(403).json({ message: 'Not authorized' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteComment = deleteComment;
// @desc    Like/unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
const toggleCommentLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: 'Not authorized' });
        const comment = yield commentServices.toggleCommentLike(req.params.id, req.user.id);
        res.json({
            message: 'Comment like toggled successfully',
            likesCount: comment.likes.length,
            isLiked: comment.likes.some(like => like.toString() === req.user.id)
        });
    }
    catch (error) {
        if (error.message === 'Comment not found')
            return res.status(404).json({ message: 'Comment not found' });
        res.status(500).json({ message: 'Server error' });
    }
});
exports.toggleCommentLike = toggleCommentLike;
