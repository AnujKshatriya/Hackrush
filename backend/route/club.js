import express from 'express';
import {
  createClub,
  deleteClub,
  getClub,
  updateClub
} from '../controller/clubController.js';

import { isAdmin, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Everyone: view all active notices
router.get('/', getClub);

// Admin or Coordinator: post a notice
router.post('/', authenticate, isAdmin, createClub);

router.delete('/:id', authenticate, isAdmin, deleteClub);

router.patch('/:id/coordinator', authenticate, isAdmin, updateClub);

export default router;