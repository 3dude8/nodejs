// src/services/commentServices.ts
import Comment from '../models/Comment';
import Post from '../models/Post';

// Create a new comment
export const createComment = async (content: string, authorId: string, postId: string, parentCommentId?: string) => {
  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const comment = await Comment.create({
    content,
    author: authorId,
    post: postId,
    parentComment: parentCommentId || null
  });
  
  return await comment.populate('author', 'name email');
};

// Get comments for a post
export const getCommentsForPost = async (postId: string) => {
  const comments = await Comment.find({ post: postId, parentComment: null })
    .populate('author', 'name email')
    .populate('likes', 'name')
    .sort({ createdAt: -1 })
    .lean(); // Convert to plain JavaScript objects
    
  // Get replies for each comment
  for (let comment of comments as any[]) {
    const replies = await Comment.find({ parentComment: comment._id })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .sort({ createdAt: 1 })
      .lean(); // Convert to plain JavaScript objects
    comment.replies = replies;
  }
  
  return comments;
};

// Get a single comment by ID
export const getCommentById = async (commentId: string) => {
  const comment = await Comment.findById(commentId)
    .populate('author', 'name email')
    .populate('likes', 'name email');
    
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  return comment;
};

// Update a comment
export const updateComment = async (commentId: string, authorId: string, content: string) => {
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  if (comment.author.toString() !== authorId) {
    throw new Error('Not authorized to update this comment');
  }
  
  comment.content = content;
  comment.isEdited = true;
  return await comment.save();
};

// Delete a comment
export const deleteComment = async (commentId: string, authorId: string) => {
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  if (comment.author.toString() !== authorId) {
    throw new Error('Not authorized to delete this comment');
  }
  
  // Delete all replies to this comment
  await Comment.deleteMany({ parentComment: commentId });
  
  return await Comment.findByIdAndDelete(commentId);
};

// Like/unlike a comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  const likeIndex = comment.likes.findIndex(like => like.toString() === userId);
  
  if (likeIndex > -1) {
    // Unlike
    comment.likes.splice(likeIndex, 1);
  } else {
    // Like
    comment.likes.push(userId as any);
  }
  
  await comment.save();
  return comment;
};
