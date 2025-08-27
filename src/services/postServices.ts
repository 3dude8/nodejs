import { AppDataSource } from '../config/data-source';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Like } from 'typeorm';

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
export const getPosts = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await AppDataSource.manager.findAndCount(Post, {
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
};

// Get a single post by ID
export const getPostById = async (postId: string) => {
    const post = await AppDataSource.manager.findOne(Post, {
        where: { id: parseInt(postId) },
        relations: ['author', 'likes']
    });
    
    if (!post) {
        throw new Error('Post not found');
    }
    
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
    return await AppDataSource.manager.save(post);
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
    
    return await AppDataSource.manager.remove(Post, post);
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
