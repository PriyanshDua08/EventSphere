import express from 'express';
import {
  createRegistration, getMyRegistrations, getRegistrationsForSubEvent, checkInRegistration,
} from '../controllers/registrationController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, requireRole('participant'), createRegistration);
router.get('/me', protect, requireRole('participant'), getMyRegistrations);
router.get('/subevent/:subEventId', protect, requireRole('organizer'), getRegistrationsForSubEvent);
router.patch('/:id/checkin', protect, requireRole('organizer'), checkInRegistration);

export default router;
