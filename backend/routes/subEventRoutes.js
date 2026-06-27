import express from 'express';
import {
  getSubEvents, getSubEvent, createSubEvent, updateSubEvent, deleteSubEvent,
} from '../controllers/subEventController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSubEvents);
router.get('/:id', getSubEvent);
router.post('/', protect, requireRole('organizer'), createSubEvent);
router.put('/:id', protect, requireRole('organizer'), updateSubEvent);
router.delete('/:id', protect, requireRole('organizer'), deleteSubEvent);

export default router;
