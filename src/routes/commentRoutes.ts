// src/routes/commentRoutes.ts
import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const router = Router();

// API Routes
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);
router.post('/:id/like', commentController.toggleCommentLike);

export default router;
