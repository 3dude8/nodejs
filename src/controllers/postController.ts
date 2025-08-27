// src/controllers/postController.ts
import { Request, Response } from 'express';
import * as postServices from '../services/postServices';

// Extend Request to include decoded JWT user info
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// @desc    Render create post page
// @route   GET /posts/create
// @access  Private
export const renderCreatePostPage = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.redirect('/login'); // only logged in users can create
  }
  res.render('create-post', { 
    pageTitle: 'Create Post',
    currentUser: req.user 
  });
};

// @desc    Render posts listing page
// @route   GET /posts
// @access  Public
export const renderPostsPage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await postServices.getPosts(1, 100); // Get first 100 posts
    const posts = (result as any).posts;

    const cleanPosts = posts.map((post: any) => ({
      ...post,
      content: post.content || '',
      createdAt: post.createdAt || new Date(),
      author: post.author || { name: 'Unknown', email: '' },
      likes: post.likes || []
    }));

    res.render('posts', { 
      pageTitle: 'All Posts',
      posts: cleanPosts,
      currentUser: req.user // ✅ pass user into Handlebars
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const tagArray = tags 
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) 
      : [];

    await postServices.createPost(title, content, req.user.id, tagArray);

    // Redirect to posts page after creation
    res.redirect('/posts');
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await postServices.getPosts(page, limit);

    res.render('posts', {
      pageTitle: 'All Posts',
      posts: (result as any).posts,
      pagination: (result as any).pagination,
      currentUser: req.user // ✅ keeps user for buttons
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await postServices.getPostById(req.params.id);
    
    // Fetch comments for this post
    const commentServices = await import('../services/commentServices');
    const comments = await commentServices.getCommentsForPost(req.params.id);

    res.render('post-detail', {
      pageTitle: (post as any).title,
      post,
      comments,
      currentUser: req.user // ✅ keeps user
    });
  } catch (error) {
    console.error('Error in getPost:', error);
    res.status(404).render('error', {
      pageTitle: 'Post Not Found',
      message: 'Post not found'
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });

    const { title, content, tags } = req.body;

    const post = await postServices.updatePost(req.params.id, req.user.id, {
      title,
      content,
      tags
    });

    res.json({ message: 'Post updated successfully', post });
  } catch (error: any) {
    if (error.message === 'Post not found') return res.status(404).json({ message: 'Post not found' });
    if (error.message === 'Not authorized to update this post') return res.status(403).json({ message: 'Not authorized' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });

    await postServices.deletePost(req.params.id, req.user.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Post not found') return res.status(404).json({ message: 'Post not found' });
    if (error.message === 'Not authorized to delete this post') return res.status(403).json({ message: 'Not authorized' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/unlike post
// @route   POST /api/posts/:id/like
// @access  Private
export const togglePostLike = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      console.log('No user found in request:', req.user);
      return res.status(401).json({ message: 'You must be logged in to like a post' });
    }

    console.log('User attempting to like post:', req.user.id, 'Post ID:', req.params.id);
    const post = await postServices.togglePostLike(req.params.id, req.user.id);

    res.json({
      message: 'Post like toggled successfully',
      likesCount: post.likes.length,
      isLiked: post.likes.some(like => like.toString() === req.user!.id)
    });
  } catch (error: any) {
    console.error('Error in togglePostLike:', error);
    if (error.message === 'Post not found') return res.status(404).json({ message: 'Post not found' });
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
