import Registration from '../models/Registration.js';
import SubEvent from '../models/SubEvent.js';

// POST /api/registrations  { subEventId }  (participant only)
export async function createRegistration(req, res, next) {
  try {
    const { subEventId } = req.body;
    if (!subEventId) return res.status(400).json({ message: 'subEventId is required' });

    const event = await SubEvent.findById(subEventId);
    if (!event) return res.status(404).json({ message: 'Sub-event not found' });

    const count = await Registration.countDocuments({ subEventId });
    if (count >= event.capacity) {
      return res.status(400).json({ message: 'Sub-event is full' });
    }

    const existing = await Registration.findOne({ participantId: req.user.id, subEventId });
    if (existing) return res.status(400).json({ message: 'Already registered for this sub-event' });

    const registration = await Registration.create({
      participantId: req.user.id,
      subEventId,
    });
    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this sub-event' });
    }
    next(err);
  }
}

// GET /api/registrations/me  (participant only) -> "My Events"
export async function getMyRegistrations(req, res, next) {
  try {
    const regs = await Registration.find({ participantId: req.user.id })
      .populate('subEventId')
      .lean();
    const result = regs.map((r) => ({
      ...r,
      registrationId: r._id,
      event: r.subEventId ? { ...r.subEventId, subEventId: r.subEventId._id } : null,
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/registrations/subevent/:subEventId  (organizer only) -> registered list for check-in
export async function getRegistrationsForSubEvent(req, res, next) {
  try {
    const regs = await Registration.find({ subEventId: req.params.subEventId })
      .populate('participantId', 'name email')
      .lean();
    res.json(regs.map((r) => ({ ...r, registrationId: r._id })));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/registrations/:id/checkin  (organizer only)
export async function checkInRegistration(req, res, next) {
  try {
    const registration = await Registration.findById(req.params.id).populate('subEventId');
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.status === 'checked-in') {
      return res.status(400).json({ message: 'Participant already checked in' });
    }
    registration.status = 'checked-in';
    registration.checkedInAt = new Date();
    await registration.save();
    res.json(registration);
  } catch (err) {
    next(err);
  }
}
