import { AppDataSource } from '../config/data-source';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Like } from 'typeorm';
import { getCache, setCache, deleteCache, cacheKeys } from '../utils/redis';
import { CachedPostsResult, isCachedPostsResult, isPost } from '../types/cache';

// Create a new post
export const createPost = async (title: string, content: string, authorId: string, tags: string[] = []) => {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.author = { id: parseInt(authorId) } as User;
    post.tags = tags;
    
    await AppDataSource.manager.save(post);
    return post;
};

// Get all posts with pagination
export const getPosts = async (page: number = 1, limit: number = 10): Promise<CachedPostsResult> => {
    const cacheKey = cacheKeys.posts(page, limit);
    
    // Try to get from cache first
    const cachedData = await getCache<CachedPostsResult>(cacheKey);
    if (cachedData && isCachedPostsResult(cachedData)) {
        console.log('📦 Cache hit for posts');
        return cachedData;
    }
    
    console.log('🔄 Cache miss for posts, querying database');
    const skip = (page - 1) * limit;
    
    const [posts, total] = await AppDataSource.manager.findAndCount(Post, {
        where: { isPublished: true },
        relations: ['author', 'likes'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit
    });
    
    const result: CachedPostsResult = {
        posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
    
    // Cache the first page of posts for 5 minutes
    if (page === 1 && limit === 10) {
        await setCache(cacheKey, result, 300);
    }
    
    return result;
};

// Get a single post by ID
export const getPostById = async (postId: string): Promise<Post> => {
    const cacheKey = cacheKeys.post(postId);
    
    // Try to get from cache first
    const cachedPost = await getCache<Post>(cacheKey);
    if (cachedPost && isPost(cachedPost)) {
        console.log('📦 Cache hit for post');
        return cachedPost;
    }
    
    console.log('🔄 Cache miss for post, querying database');
    const post = await AppDataSource.manager.findOne(Post, {
        where: { id: parseInt(postId) },
        relations: ['author', 'likes']
    });
    
    if (!post) {
        throw new Error('Post not found');
    }
    
    // Cache the post for 10 minutes
    await setCache(cacheKey, post, 600);
    
    return post;
};

// Update a post
export const updatePost = async (postId: string, authorId: string, updates: any) => {
    const post = await AppDataSource.manager.findOne(Post, { 
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
    const updatedPost = await AppDataSource.manager.save(post);
    
    // Invalidate cache for this post
    await deleteCache(cacheKeys.post(postId));
    // Also invalidate the posts list cache since the content changed
    await deleteCache(cacheKeys.posts(1, 10));
    
    return updatedPost;
};

// Delete a post
export const deletePost = async (postId: string, authorId: string) => {
    const post = await AppDataSource.manager.findOne(Post, { 
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
    await AppDataSource.manager.delete(Comment, { post: { id: parseInt(postId) } });
    
    const result = await AppDataSource.manager.remove(Post, post);
    
    // Invalidate cache for this post and posts list
    await deleteCache(cacheKeys.post(postId));
    await deleteCache(cacheKeys.posts(1, 10));
    
    return result;
};

// Like/unlike a post
export const togglePostLike = async (postId: string, userId: string) => {
    const post = await AppDataSource.manager.findOne(Post, { 
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
    } else {
        // Like
        const user = await AppDataSource.manager.findOne(User, { where: { id: parseInt(userId) } });
        if (user) {
            post.likes.push(user);
        }
    }
    
    await AppDataSource.manager.save(post);
    return post;
};

// Search posts
export const searchPosts = async (query: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await AppDataSource.manager.findAndCount(Post, {
        where: { 
            title: Like(`%${query}%`),
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
};
