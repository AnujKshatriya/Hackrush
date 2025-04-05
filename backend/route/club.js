import express from 'express';
import {
  createClub,
  deleteClub,
  getClub,
  updateClub,
  removeClubCoordinator
} from '../controller/clubController.js';

import { isAdmin, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Everyone: view all active notices
router.get('/', getClub);

// Admin or Coordinator: post a notice
router.post('/', authenticate, isAdmin, createClub);

router.delete('/:id', authenticate, isAdmin, deleteClub);

router.patch('/coordinator', authenticate, isAdmin, updateClub);

router.put("/remove-coordinator", authenticate, isAdmin, removeClubCoordinator);


export default router;