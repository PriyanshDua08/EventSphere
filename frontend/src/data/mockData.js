// Mock data shaped exactly like the PRD's MongoDB schemas (Section 10).
// Swap this file for real API calls once the Express backend is ready.

export const FEST = {
  name: "Aarohan '26",
  tagline: 'One pass. Every event. Two days.',
  startDate: '2026-09-12T09:00:00',
  endDate: '2026-09-13T20:00:00',
  venue: 'Central Campus Grounds',
};

export const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Workshop'];

export const SUB_EVENTS = [
  { subEventId: 'se1', title: 'CodeRush — 24hr Hackathon', description: 'Build a working prototype in 24 hours. Teams of 2-4.', category: 'Tech', venue: 'CS Block, Lab 3', dateTime: '2026-09-12T10:00:00', durationMins: 1440, capacity: 80, registered: 62, points: 100, createdBy: 'org1' },
  { subEventId: 'se2', title: 'Pixel Pitch — UI/UX Sprint', description: 'Design a screen flow for a surprise brief in 3 hours.', category: 'Tech', venue: 'Design Studio', dateTime: '2026-09-12T11:00:00', durationMins: 180, capacity: 40, registered: 40, points: 60, createdBy: 'org1' },
  { subEventId: 'se3', title: 'Open Mic Night', description: 'Music, poetry, stand-up — 5 minutes, any act.', category: 'Cultural', venue: 'Amphitheatre', dateTime: '2026-09-12T18:00:00', durationMins: 120, capacity: 150, registered: 98, points: 30, createdBy: 'org2' },
  { subEventId: 'se4', title: 'Street Dance Battle', description: 'Solo and crew battles, judged on the spot.', category: 'Cultural', venue: 'Open Air Theatre', dateTime: '2026-09-12T16:00:00', durationMins: 150, capacity: 60, registered: 45, points: 50, createdBy: 'org2' },
  { subEventId: 'se5', title: '5-a-Side Football', description: 'Knockout format, 15-min halves.', category: 'Sports', venue: 'Sports Ground A', dateTime: '2026-09-12T07:00:00', durationMins: 240, capacity: 100, registered: 88, points: 70, createdBy: 'org3' },
  { subEventId: 'se6', title: 'Photography Walk & Contest', description: 'Theme revealed at check-in. Submit by 6pm.', category: 'Workshop', venue: 'Campus-wide', dateTime: '2026-09-12T09:00:00', durationMins: 540, capacity: 50, registered: 31, points: 40, createdBy: 'org1' },
  { subEventId: 'se7', title: 'AI/ML Workshop', description: 'Hands-on intro to building your first model.', category: 'Workshop', venue: 'Seminar Hall 2', dateTime: '2026-09-13T10:00:00', durationMins: 120, capacity: 70, registered: 70, points: 20, createdBy: 'org1' },
  { subEventId: 'se8', title: 'Quiz Maelstrom', description: 'General + tech quiz, prelims then finals.', category: 'Tech', venue: 'Auditorium', dateTime: '2026-09-13T13:00:00', durationMins: 120, capacity: 120, registered: 76, points: 45, createdBy: 'org3' },
  { subEventId: 'se9', title: 'Closing Ceremony & Award Night', description: 'Leaderboard reveal, prizes, performances.', category: 'Cultural', venue: 'Main Stage', dateTime: '2026-09-13T18:00:00', durationMins: 120, capacity: 400, registered: 210, points: 10, createdBy: 'org2' },
];

export const ORGANIZER = { userId: 'org1', name: 'Aditi Sharma', role: 'organizer', email: 'aditi@college.edu' };

export const PARTICIPANT_DEMO = { userId: 'p1', name: 'Rohan Mehta', role: 'participant', email: 'rohan@college.edu' };

// registrationId, participantId, subEventId, status, registeredAt, checkedInAt
export const DEMO_REGISTRATIONS = [
  { registrationId: 'r1', participantId: 'p1', subEventId: 'se1', status: 'checked-in', registeredAt: '2026-09-01T10:00:00', checkedInAt: '2026-09-12T10:05:00' },
  { registrationId: 'r2', participantId: 'p1', subEventId: 'se4', status: 'registered', registeredAt: '2026-09-02T14:00:00', checkedInAt: null },
  { registrationId: 'r3', participantId: 'p1', subEventId: 'se8', status: 'registered', registeredAt: '2026-09-03T09:00:00', checkedInAt: null },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Sanya Kapoor', points: 280 },
  { rank: 2, name: 'Rohan Mehta', points: 230 },
  { rank: 3, name: 'Vikram Rao', points: 215 },
  { rank: 4, name: 'Meera Iyer', points: 190 },
  { rank: 5, name: 'Arjun Nair', points: 175 },
  { rank: 6, name: 'Diya Shah', points: 160 },
  { rank: 7, name: 'Kabir Singh', points: 145 },
  { rank: 8, name: 'Ishita Joshi', points: 130 },
];
