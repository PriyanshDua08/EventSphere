import Registration from '../models/Registration.js';

// GET /api/leaderboard  (public) - total points by participant, ranked
// Tie-break: higher points first, then earliest check-in (PRD 13.1)
export async function getLeaderboard(req, res, next) {
  try {
    const { category } = req.query;

    const matchStage = { status: 'checked-in' };
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'subevents',
          localField: 'subEventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
    ];

    if (category) {
      pipeline.push({ $match: { 'event.category': category } });
    }

    pipeline.push(
      {
        $group: {
          _id: '$participantId',
          points: { $sum: '$event.points' },
          earliestCheckIn: { $min: '$checkedInAt' },
        },
      },
      { $sort: { points: -1, earliestCheckIn: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          points: 1,
        },
      }
    );

    const results = await Registration.aggregate(pipeline);
    const ranked = results.map((r, i) => ({ rank: i + 1, ...r }));
    res.json(ranked);
  } catch (err) {
    next(err);
  }
}
