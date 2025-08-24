// src/services/postServices.ts
import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';

// Create a new post
export const createPost = async (title: string, content: string, authorId: string, tags: string[] = []) => {
  const post = await Post.create({
    title,
    content,
    author: authorId,
    tags
  });
  
  // Always populate author since we're using real user IDs now
  return await post.populate('author', 'name email');
};

// Get all posts with pagination
export const getPosts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const posts = await Post.find({ isPublished: true })
    .populate('author', 'name email')
    .populate('likes', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Post.countDocuments({ isPublished: true });
  
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
};

// Get a single post by ID
export const getPostById = async (postId: string) => {
  const post = await Post.findById(postId)
    .populate('author', 'name email')
    .populate('likes', 'name email')
    .lean();
    
  if (!post) {
    throw new Error('Post not found');
  }
  
  return post;
};

// Update a post
export const updatePost = async (postId: string, authorId: string, updates: any) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  if (post.author.toString() !== authorId) {
    throw new Error('Not authorized to update this post');
  }
  
  Object.assign(post, updates);
  return await post.save();
};

// Delete a post
export const deletePost = async (postId: string, authorId: string) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  if (post.author.toString() !== authorId) {
    throw new Error('Not authorized to delete this post');
  }
  
  // Delete all comments for this post
  await Comment.deleteMany({ post: postId });
  
  return await Post.findByIdAndDelete(postId);
};

// Like/unlike a post
export const togglePostLike = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  const likeIndex = post.likes.findIndex(like => like.toString() === userId);
  
  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(userId as any);
  }
  
  await post.save();
  return post;
};

// Search posts
export const searchPosts = async (query: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const posts = await Post.find(
    { 
      $text: { $search: query },
      isPublished: true 
    },
    { score: { $meta: "textScore" } }
  )
    .populate('author', 'name email')
    .populate('likes', 'name')
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);
    
  const total = await Post.countDocuments({ 
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
};
