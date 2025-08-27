import { AppDataSource } from '../config/data-source';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

// Create a new comment
export const createComment = async (content: string, authorId: string, postId: string, parentCommentId?: string) => {
    // Verify post exists
    const post = await AppDataSource.manager.findOne(Post, { where: { id: parseInt(postId) } });
    if (!post) {
        throw new Error('Post not found');
    }

    const comment = new Comment();
    comment.content = content;
    comment.author = await AppDataSource.manager.findOne(User, { where: { id: parseInt(authorId) } });
    comment.post = post;
    comment.parentComment = parentCommentId ? await AppDataSource.manager.findOne(Comment, { where: { id: parseInt(parentCommentId) } }) : null;

    await AppDataSource.manager.save(comment);
    return comment;
};

// Get comments for a post
export const getCommentsForPost = async (postId: string) => {
    const comments = await AppDataSource.manager.find(Comment, {
        where: { post: { id: parseInt(postId) }, parentComment: null },
        relations: ['author', 'likes'],
        order: { createdAt: 'DESC' }
    });

    // Get replies for each comment
    for (let comment of comments) {
        const replies = await AppDataSource.manager.find(Comment, {
            where: { parentComment: { id: comment.id } },
            relations: ['author', 'likes'],
            order: { createdAt: 'ASC' }
        });
        comment.replies = replies;
    }

    return comments;
};

// Get a single comment by ID
export const getCommentById = async (commentId: string) => {
    const comment = await AppDataSource.manager.findOne(Comment, {
        where: { id: parseInt(commentId) },
        relations: ['author', 'likes']
    });

    if (!comment) {
        throw new Error('Comment not found');
    }

    return comment;
};

// Update a comment
export const updateComment = async (commentId: string, authorId: string, content: string) => {
    const comment = await AppDataSource.manager.findOne(Comment, { where: { id: parseInt(commentId) } });

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.author.id.toString() !== authorId) {
        throw new Error('Not authorized to update this comment');
    }

    comment.content = content;
    comment.isEdited = true;
    return await AppDataSource.manager.save(comment);
};

// Delete a comment
export const deleteComment = async (commentId: string, authorId: string) => {
    const comment = await AppDataSource.manager.findOne(Comment, { where: { id: parseInt(commentId) } });

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.author.id.toString() !== authorId) {
        throw new Error('Not authorized to delete this comment');
    }

    // Delete all replies to this comment
    await AppDataSource.manager.delete(Comment, { parentComment: { id: parseInt(commentId) } });

    return await AppDataSource.manager.remove(Comment, comment);
};

// Like/unlike a comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
    const comment = await AppDataSource.manager.findOne(Comment, { where: { id: parseInt(commentId) } });

    if (!comment) {
        throw new Error('Comment not found');
    }

    const likeIndex = comment.likes.findIndex(like => like.id.toString() === userId);

    if (likeIndex > -1) {
        // Unlike
        comment.likes.splice(likeIndex, 1);
    } else {
        // Like
        const user = await AppDataSource.manager.findOne(User, { where: { id: parseInt(userId) } });
        if (user) {
            comment.likes.push(user);
        }
    }

    await AppDataSource.manager.save(comment);
    return comment;
};
