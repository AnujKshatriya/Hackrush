import express from 'express';
import {
  createEvent,
  deleteEvent,
  approveEvent,
  getApprovedEvents,
  rsvpEvent,
  getEvents,
  getUnapprovedEvents,
} from '../controller/eventController.js';
import { authenticate, isAdmin, isAdminOrCoordinator } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, isAdminOrCoordinator, createEvent);
router.delete('/:id', authenticate, isAdminOrCoordinator, deleteEvent);
router.get('/approve/:id', authenticate, isAdmin, approveEvent);
router.get('/', authenticate, getApprovedEvents);
router.get('/unapproved', authenticate, isAdmin, getUnapprovedEvents);
router.get('/all', authenticate, getEvents);
router.post('/rsvp/:eventId', authenticate, rsvpEvent);

export default router;
