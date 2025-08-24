// src/routes/postRoutes.ts
import { Router } from 'express';
import * as postController from '../controllers/postController';
import { isAuthenticated } from '../middleware/auth';


const router = Router();

// API Routes (these are mounted at /api/posts in main index)
router.get('/', postController.getPosts);
router.post('/:id/like', isAuthenticated, postController.togglePostLike);
router.get('/:id', postController.getPost);
router.post('/', postController.createPost);
router.get('/view/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
