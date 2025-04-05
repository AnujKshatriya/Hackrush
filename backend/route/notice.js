import express from 'express';
import {
  createNotice,
  deleteNotices,
  getNotices
} from '../controller/noticeController.js';

import { isAdmin, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Everyone: view all active notices
router.get('/', getNotices);

// Admin or Coordinator: post a notice
router.post('/', authenticate, isAdmin, createNotice);

router.delete('/:id', authenticate, isAdmin, deleteNotices);

export default router;
