import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const shared = [
  { path: 'resources', name: 'resources', component: () => import('@/views/shared/ResourcesView.vue'), meta: { title: 'Resources' } },
  { path: 'settings', name: 'settings', component: () => import('@/views/shared/SettingsView.vue'), meta: { title: 'Settings' } }
]

const routes = [
  { path: '/', name: 'landing', component: () => import('@/views/public/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/public/LoginView.vue'), meta: { guest: true } },
  { path: '/signup', name: 'signup', component: () => import('@/views/public/SignupView.vue'), meta: { guest: true } },

  {
    path: '/student',
    component: DashboardLayout,
    meta: { role: 'student', layout: 'student' },
    children: [
      { path: '', name: 'student-home', component: () => import('@/views/student/StudentHome.vue'), meta: { title: 'Home' } },
      { path: 'profile', name: 'student-profile', component: () => import('@/views/student/StudentProfile.vue'), meta: { title: 'My Profile' } },
      { path: 'mentors', name: 'find-mentors', component: () => import('@/views/student/FindMentors.vue'), meta: { title: 'Find Mentors' } },
      { path: 'mentors/:id', name: 'mentor-detail', component: () => import('@/views/student/MentorDetail.vue'), meta: { title: 'Mentor' } },
      { path: 'mentors/:id/request', name: 'send-request', component: () => import('@/views/student/SendRequest.vue'), meta: { title: 'Send Request' } },
      { path: 'requests', name: 'my-requests', component: () => import('@/views/student/MyRequests.vue'), meta: { title: 'My Requests' } },
      { path: 'messages', name: 'messages', component: () => import('@/views/student/SessionView.vue'), meta: { title: 'Messages' } },
      ...shared.map((r) => ({ ...r, name: 'student-' + r.name }))
    ]
  },

  {
    path: '/mentor',
    component: DashboardLayout,
    meta: { role: 'mentor', layout: 'mentor' },
    children: [
      { path: '', name: 'mentor-home', component: () => import('@/views/mentor/MentorHome.vue'), meta: { title: 'Dashboard' } },
      { path: 'profile', name: 'mentor-profile', component: () => import('@/views/mentor/MentorProfile.vue'), meta: { title: 'My Profile' } },
      { path: 'availability', name: 'availability', component: () => import('@/views/mentor/AvailabilityView.vue'), meta: { title: 'Availability' } },
      { path: 'requests', name: 'mentee-requests', component: () => import('@/views/mentor/MenteeRequests.vue'), meta: { title: 'Mentee Requests' } },
      { path: 'mentees', name: 'my-mentees', component: () => import('@/views/mentor/MyMentees.vue'), meta: { title: 'My Mentees' } },
      { path: 'sessions', name: 'sessions', component: () => import('@/views/mentor/SessionsView.vue'), meta: { title: 'Sessions' } },
      ...shared.map((r) => ({ ...r, name: 'mentor-' + r.name }))
    ]
  },

  {
    path: '/admin',
    component: DashboardLayout,
    meta: { role: 'admin', layout: 'admin' },
    children: [
      { path: '', name: 'admin-home', component: () => import('@/views/admin/AdminOverview.vue'), meta: { title: 'Overview' } },
      { path: 'mentors', name: 'mentor-approvals', component: () => import('@/views/admin/MentorApprovals.vue'), meta: { title: 'Mentor Approvals' } },
      { path: 'mentors/:id', name: 'mentor-review', component: () => import('@/views/admin/MentorReview.vue'), meta: { title: 'Review Mentor' } },
      { path: 'goals', name: 'career-goals', component: () => import('@/views/admin/CareerGoals.vue'), meta: { title: 'Career Goals' } },
      { path: 'participation', name: 'participation', component: () => import('@/views/admin/ParticipationView.vue'), meta: { title: 'Participation' } },
      { path: 'concerns', name: 'concerns', component: () => import('@/views/admin/ConcernsView.vue'), meta: { title: 'Reports' } },
      { path: 'settings', name: 'admin-settings', component: () => import('@/views/shared/SettingsView.vue'), meta: { title: 'Settings' } }
    ]
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const role = to.meta.role
  if (role && !auth.isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
  if (role && auth.role !== role) return auth.home
  if (to.meta.guest && auth.isLoggedIn) return auth.home
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · MentorConnect` : 'MentorConnect'
})

export default router
