import express from 'express';
import {
  createNotice,
  getNotices
} from '../controller/noticeController.js';

import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Everyone: view all active notices
router.get('/', getNotices);

// Admin or Coordinator: post a notice
router.post('/', isAdmin, createNotice);

export default router;
