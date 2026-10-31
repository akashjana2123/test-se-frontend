# MentorConnect – Frontend

Vue 3 + Vite + Vue Router + Pinia + GSAP. Plain CSS (no UI framework).

## Run

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Demo logins (dummy data)

| Role    | Email              | Password |
|---------|--------------------|----------|
| Student | student@demo.com   | anything |
| Mentor  | mentor@demo.com    | anything |
| Admin   | admin@demo.com     | anything |

The login page also has one-click demo buttons.

## Connecting the backend

1. Copy `.env.example` to `.env`
2. Set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL` to the Flask API URL
3. Every API call is in `src/api/index.js`, with the endpoint it expects written above it.
   The backend should return the same JSON shape as the dummy data in `src/mock/db.js`.

Auth: `POST /auth/login` returns `{ token, user }`. The token is sent as `Authorization: Bearer <token>`.

## Structure

```
src/
  api/          client.js (mock/real switch), index.js (all endpoints)
  mock/         db.js (dummy data)
  stores/       auth.js (Pinia)
  router/       routes + role guards
  components/   layout/ (sidebar, topbar), ui/ (charts, modal, tabs, toast...)
  views/
    public/     Landing, Login, Signup
    student/    Home, Profile, Find Mentors, Mentor Detail, Send Request, My Requests, Messages
    mentor/     Dashboard, Profile, Availability, Mentee Requests, My Mentees, Sessions
    admin/      Overview, Mentor Approvals, Review Mentor, Career Goals, Participation, Reports
    shared/     Resources, Settings
```
