# EventSphere — Frontend (Phase 1 MVP)

College fest management platform. This is the **frontend only**, built per the PRD's tech stack (React + TailwindCSS + React Router + Axios-ready), running on **mock data** so you can demo the full flow before the backend exists.

## Run it in VS Code

```bash
npm install
npm run dev
```

Open the URL it displays (usually `http://localhost:5173`).

## What's wired up

- **Public pages**: Home (hero, countdown, highlights), All Sub-Events (filter by category/day), Sub-Event detail, Fest Schedule (**signature feature — flags time clashes**), Leaderboard, Contact.
- **Auth (demo)**: `/login` — pick "participant" or "organizer", any email logs you in. No real backend yet, so this just sets a role in memory.
- **Participant Dashboard**: registered events, points, rank.
- **Organizer Dashboard**: create / edit / delete sub-events, per-event registration list, "Mark Present" check-in (auto-awards points on check-in, blocks double check-in).
- **Protected routes**: `/dashboard` (participant-only) and `/organizer` (organizer-only) redirect to `/login` if you're not signed in with the right role — mirrors the PRD's role-based routing requirement.

## Where the mock data lives

`src/data/mockData.js` — shaped exactly like the schemas in PRD Section 10 (`User`, `SubEvent`, `Registration`). All state mutations (register, check-in, create/edit/delete event) happen in `src/context/AppContext.jsx` using React state — nothing persists on refresh yet, since there's no database wired up.

## Wiring to the real backend later

Replace the functions in `AppContext.jsx` (`register`, `checkIn`, `createSubEvent`, etc.) with `axios` calls to your Express API. The shapes already match the PRD's models, so the swap should be mostly 1:1 — keep the same function signatures and just change what's inside them.

## Stack used (per PRD §9.1)

React.js, TailwindCSS, React Router, Axios (not yet called — no backend to call), Vite as the build tool.
