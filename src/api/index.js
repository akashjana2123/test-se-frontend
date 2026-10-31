// All API calls used by the app. Each call shows the backend endpoint it expects.
import { request, storage } from './client'
import db from '@/mock/db'

const byId = (list, id) => list.find((x) => x.id === id)
const me = (role) => {
  let saved = null
  try { saved = JSON.parse(storage.get('mc_user') || 'null') } catch { /* ignore */ }
  return db.users.find((u) => saved && u.id === saved.id) || db.users.find((u) => u.role === role)
}
const fail = (msg) => { throw new Error(msg) }
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* ---------------- Auth ---------------- */
export const authApi = {
  // POST /auth/login  { email, password } -> { token, user }
  login: (data) => request({ url: '/auth/login', method: 'POST', data }, () => {
    const user = db.users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())
    if (!user) fail('No account found with this email')
    if (!data.password) fail('Please enter your password')
    return { token: 'demo-token-' + user.id, user }
  }),

  // POST /auth/register  { name, email, password, role } -> { token, user }
  register: (data) => request({ url: '/auth/register', method: 'POST', data }, () => {
    if (db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) fail('Email already registered')
    const base = db.users.find((u) => u.role === data.role)
    const user = { ...base, id: 'u' + Date.now(), name: data.name, email: data.email, avatar: null, profileCompletion: 20 }
    db.users.push(user)
    return { token: 'demo-token-' + user.id, user }
  })
}

/* ---------------- Shared ---------------- */
export const commonApi = {
  // GET /resources?category=
  getResources: (params = {}) => request({ url: '/resources', params }, () =>
    db.resources.filter((r) => !params.category || params.category === 'All' || r.category === params.category)),

  // GET /notifications
  getNotifications: (role) => request({ url: '/notifications' }, () => db.notifications[role] || []),

  // GET /public/stats
  getPublicStats: () => request({ url: '/public/stats' }, () => ({ mentors: 150, areas: 10, sessions: 500, feedback: 90 })),

  // GET /public/mentors (featured mentors on landing page)
  getFeaturedMentors: () => request({ url: '/public/mentors' }, () => db.mentors.filter((m) => m.id !== 'm1').slice(0, 4))
}

/* ---------------- Student ---------------- */
export const studentApi = {
  // GET /student/profile
  getProfile: () => request({ url: '/student/profile' }, () => me('student')),

  // PUT /student/profile
  updateProfile: (data) => request({ url: '/student/profile', method: 'PUT', data }, () =>
    Object.assign(me('student'), data, { profileCompletion: 100 })),

  // GET /mentors?q=&domain=&availability=&sort=&goal=
  getMentors: (params = {}) => request({ url: '/mentors', params }, () => {
    const q = (params.q || '').toLowerCase()
    let list = db.mentors.filter((m) =>
      (!q || [m.name, m.title, m.company, ...m.tags].join(' ').toLowerCase().includes(q)) &&
      (!params.domain || m.domain === params.domain) &&
      (!params.goal || m.goals.includes(params.goal)) &&
      (params.availability !== 'available' || m.available))
    if (params.sort === 'experience') list = [...list].sort((a, b) => b.experience - a.experience)
    else list = [...list].sort((a, b) => b.match - a.match)
    return list
  }),

  // GET /mentors/:id
  getMentor: (id) => request({ url: `/mentors/${id}` }, () => byId(db.mentors, id) || fail('Mentor not found')),

  // GET /student/requests
  getRequests: () => request({ url: '/student/requests' }, () =>
    db.studentRequests.map((r) => ({ ...r, mentor: byId(db.mentors, r.mentorId) }))),

  // POST /student/requests  { mentorId, goal, message, slot }
  sendRequest: (data) => request({ url: '/student/requests', method: 'POST', data }, () => {
    if (db.studentRequests.some((r) => r.status === 'pending')) fail('You can have only one active request at a time')
    const req = { id: 'r' + Date.now(), studentId: 's1', status: 'pending', sentOn: today(), ...data }
    db.studentRequests.unshift(req)
    return req
  }),

  // PATCH /student/requests/:id/cancel
  cancelRequest: (id) => request({ url: `/student/requests/${id}/cancel`, method: 'PATCH' }, () => {
    const r = byId(db.studentRequests, id); r.status = 'cancelled'; return r
  }),

  // GET /student/mentorship (active mentorship, session, chat, action items)
  getMentorship: () => request({ url: '/student/mentorship' }, () => ({ ...db.mentorship, mentor: byId(db.mentors, db.mentorship.mentorId) })),

  // POST /student/mentorship/messages  { text }
  sendMessage: (text) => request({ url: '/student/mentorship/messages', method: 'POST', data: { text } }, () => {
    const msg = { from: 'student', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    db.mentorship.messages.push(msg)
    return msg
  }),

  // PATCH /student/mentorship  { actionItems, notes, completed }
  updateMentorship: (data) => request({ url: '/student/mentorship', method: 'PATCH', data }, () => Object.assign(db.mentorship, data))
}

/* ---------------- Mentor ---------------- */
export const mentorApi = {
  // GET /mentor/dashboard
  getDashboard: () => request({ url: '/mentor/dashboard' }, () => ({
    pending: db.incomingRequests.filter((r) => r.status === 'pending').length,
    mentees: db.mentees.length,
    capacity: db.availability.maxMentees,
    sessions: db.mentorSessions.length,
    rating: 4.8,
    upcoming: db.mentees.map((m) => ({ name: m.name, avatar: m.avatar, when: m.nextSession, goal: m.goal })),
    recentRequests: db.incomingRequests.filter((r) => r.status === 'pending').slice(0, 3)
  })),

  // GET /mentor/profile
  getProfile: () => request({ url: '/mentor/profile' }, () => me('mentor')),

  // PUT /mentor/profile
  updateProfile: (data) => request({ url: '/mentor/profile', method: 'PUT', data }, () => Object.assign(me('mentor'), data)),

  // GET /mentor/availability
  getAvailability: () => request({ url: '/mentor/availability' }, () => ({ ...db.availability, filled: db.mentees.length })),

  // PUT /mentor/availability
  updateAvailability: (data) => request({ url: '/mentor/availability', method: 'PUT', data }, () => Object.assign(db.availability, data)),

  // GET /mentor/requests
  getRequests: () => request({ url: '/mentor/requests' }, () => db.incomingRequests),

  // PATCH /mentor/requests/:id  { status: 'accepted' | 'declined', reason }
  respond: (id, status, reason = '') => request({ url: `/mentor/requests/${id}`, method: 'PATCH', data: { status, reason } }, () => {
    const r = byId(db.incomingRequests, id)
    if (status === 'accepted') {
      if (db.mentees.length >= db.availability.maxMentees) fail('You are at full capacity. Increase capacity in Availability.')
      db.mentees.push({ id: 'me' + Date.now(), name: r.name, avatar: r.avatar, course: r.course, institute: r.institute, goal: r.goal, nextSession: 'Not scheduled', lastNote: '—', progress: 5 })
    }
    Object.assign(r, { status, reason })
    return r
  }),

  // GET /mentor/mentees
  getMentees: () => request({ url: '/mentor/mentees' }, () => ({ list: db.mentees, capacity: db.availability.maxMentees })),

  // GET /mentor/sessions
  getSessions: () => request({ url: '/mentor/sessions' }, () => ({ list: db.mentorSessions, mentees: db.mentees.map((m) => m.name) })),

  // POST /mentor/sessions  { mentee, date, summary, actionItems }
  recordSession: (data) => request({ url: '/mentor/sessions', method: 'POST', data }, () => {
    const s = { id: 'ss' + Date.now(), status: 'Completed', time: '—', title: data.title || 'Mentoring session', ...data }
    db.mentorSessions.unshift(s)
    return s
  })
}

/* ---------------- Admin ---------------- */
export const adminApi = {
  // GET /admin/overview
  getOverview: () => request({ url: '/admin/overview' }, () => ({
    stats: {
      ...db.adminStats,
      pendingMentors: db.mentorApplications.filter((a) => a.status === 'pending').length,
      pendingGoals: db.careerGoalRequests.filter((g) => g.status === 'pending').length,
      openConcerns: db.concerns.filter((c) => ['Open', 'Under review'].includes(c.status)).length
    },
    requestStatus: db.requestStatus,
    trend: db.participation
  })),

  // GET /admin/mentor-applications?status=
  getApplications: (status) => request({ url: '/admin/mentor-applications', params: { status } }, () => db.mentorApplications.filter((a) => !status || a.status === status)),

  // GET /admin/mentor-applications/:id
  getApplication: (id) => request({ url: `/admin/mentor-applications/${id}` }, () => byId(db.mentorApplications, id) || fail('Application not found')),

  // PATCH /admin/mentor-applications/:id  { status: 'approved' | 'rejected' | 'changes_requested' }
  decideApplication: (id, status) => request({ url: `/admin/mentor-applications/${id}`, method: 'PATCH', data: { status } }, () => {
    const a = byId(db.mentorApplications, id); a.status = status
    if (status === 'approved') db.adminStats.approvedMentors++
    return a
  }),

  // GET /admin/career-goals
  getCareerGoals: () => request({ url: '/admin/career-goals' }, () => ({ requests: db.careerGoalRequests, approved: db.approvedGoals })),

  // PATCH /admin/career-goals/:id  { status }
  decideCareerGoal: (id, status) => request({ url: `/admin/career-goals/${id}`, method: 'PATCH', data: { status } }, () => {
    const g = byId(db.careerGoalRequests, id); g.status = status
    if (status === 'approved' && !db.approvedGoals.includes(g.goal)) db.approvedGoals.push(g.goal)
    return g
  }),

  // GET /admin/participation
  getParticipation: () => request({ url: '/admin/participation' }, () => ({ ...db.participation, requestStatus: db.requestStatus })),

  // GET /admin/concerns
  getConcerns: () => request({ url: '/admin/concerns' }, () => db.concerns),

  // PATCH /admin/concerns/:id  { status, notes }
  updateConcern: (id, data) => request({ url: `/admin/concerns/${id}`, method: 'PATCH', data }, () => {
    const c = byId(db.concerns, id)
    if (data.status !== c.status) c.timeline.push({ at: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }), text: `Status changed to ${data.status}` })
    Object.assign(c, data)
    return c
  })
}
