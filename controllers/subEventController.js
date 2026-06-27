import SubEvent from '../models/SubEvent.js';
import Registration from '../models/Registration.js';

// GET /api/subevents  (public) - card grid + schedule, with registered count & seats left
export async function getSubEvents(req, res, next) {
  try {
    const { category, day } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const events = await SubEvent.find(filter).sort({ dateTime: 1 }).lean();
    const counts = await Registration.aggregate([
      { $group: { _id: '$subEventId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    let result = events.map((e) => ({
      ...e,
      subEventId: e._id,
      registered: countMap[String(e._id)] || 0,
      seatsLeft: e.capacity - (countMap[String(e._id)] || 0),
    }));

    if (day) {
      result = result.filter((e) => new Date(e.dateTime).toISOString().slice(0, 10) === day);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSubEvent(req, res, next) {
  try {
    const event = await SubEvent.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: 'Sub-event not found' });
    const registered = await Registration.countDocuments({ subEventId: event._id });
    res.json({ ...event, subEventId: event._id, registered, seatsLeft: event.capacity - registered });
  } catch (err) {
    next(err);
  }
}

// POST /api/subevents (organizer only)
export async function createSubEvent(req, res, next) {
  try {
    const { title, description, category, venue, dateTime, durationMins, capacity, points } = req.body;
    if (!title || !venue || !dateTime || !capacity) {
      return res.status(400).json({ message: 'title, venue, dateTime, capacity are required' });
    }
    if (Number(capacity) <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than zero' });
    }
    const event = await SubEvent.create({
      title, description, category, venue, dateTime, durationMins, capacity, points,
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

// PUT /api/subevents/:id (organizer only)
export async function updateSubEvent(req, res, next) {
  try {
    if (req.body.capacity !== undefined && Number(req.body.capacity) <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than zero' });
    }
    const event = await SubEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Sub-event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/subevents/:id (organizer only)
export async function deleteSubEvent(req, res, next) {
  try {
    const event = await SubEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Sub-event not found' });
    await Registration.deleteMany({ subEventId: req.params.id });
    res.json({ message: 'Sub-event deleted' });
  } catch (err) {
    next(err);
  }
}
