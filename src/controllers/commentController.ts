// src/controllers/commentController.ts
import { Request, Response } from 'express';
import * as commentServices from '../services/commentServices';

// Extend Request to include decoded JWT user info
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const comment = await commentServices.createComment(
      content,
      req.user.id,
      postId,
      parentCommentId
    );

    res.redirect(`/posts/${postId}`);
  } catch (error: any) {
    if (error.message === 'Post not found') return res.status(404).json({ message: 'Post not found' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;

    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });

    const comment = await commentServices.updateComment(
      req.params.id,
      req.user.id,
      content
    );

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error: any) {
    if (error.message === 'Comment not found') return res.status(404).json({ message: 'Comment not found' });
    if (error.message === 'Not authorized to update this comment') return res.status(403).json({ message: 'Not authorized' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });

    await commentServices.deleteComment(req.params.id, req.user.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Comment not found') return res.status(404).json({ message: 'Comment not found' });
    if (error.message === 'Not authorized to delete this comment') return res.status(403).json({ message: 'Not authorized' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleCommentLike = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });

    const comment = await commentServices.toggleCommentLike(
      req.params.id,
      req.user.id
    );

    res.json({
      message: 'Comment like toggled successfully',
      likesCount: comment.likes.length,
      isLiked: comment.likes.some(like => like.toString() === req.user!.id)
    });
  } catch (error: any) {
    if (error.message === 'Comment not found') return res.status(404).json({ message: 'Comment not found' });
    res.status(500).json({ message: 'Server error' });
  }
};
