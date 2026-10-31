<template>
  <div class="shell" :class="[`is-${layout}`, { open: menuOpen }]">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="side-top">
        <AppLogo :to="auth.home" :light="isAdmin" />
        <button class="btn btn-ghost btn-icon btn-sm close-btn" aria-label="Close menu" @click="menuOpen = false"><X /></button>
      </div>
      <span class="role-pill">{{ roleLabel }}</span>

      <nav class="nav">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item) }"
          @click="menuOpen = false"
        >
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="side-bottom">
        <div v-if="!isAdmin" class="side-quote">
          <Sparkles />
          <p>“Share your journey.<br />Create brighter futures.”</p>
        </div>
        <RouterLink :to="`/${layout}/settings`" class="nav-item" :class="{ active: route.path.endsWith('/settings') }" @click="menuOpen = false"><Settings /><span>Settings</span></RouterLink>
        <button class="nav-item" @click="logout"><LogOut /><span>Log out</span></button>
      </div>
    </aside>
    <div class="scrim" @click="menuOpen = false" />

    <!-- Main -->
    <div class="main">
      <header class="topbar">
        <button class="btn btn-ghost btn-icon menu-btn" aria-label="Open menu" @click="menuOpen = true"><Menu /></button>
        <form v-if="layout === 'student'" class="input-icon search" @submit.prevent="search">
          <Search />
          <input v-model="q" class="input" placeholder="Search mentors, skills or careers..." />
        </form>
        <h3 v-else class="top-title">{{ route.meta.title }}</h3>

        <div class="top-actions">
          <div class="dropdown" v-click-outside="() => (bellOpen = false)">
            <button class="btn btn-ghost btn-icon bell" aria-label="Notifications" @click="bellOpen = !bellOpen">
              <Bell />
              <span v-if="unread" class="dot">{{ unread }}</span>
            </button>
            <Transition name="drop">
              <div v-if="bellOpen" class="menu notif">
                <div class="menu-head">
                  <b>Notifications</b>
                  <button class="link-btn small" @click="markAll">Mark all read</button>
                </div>
                <div v-for="n in notes" :key="n.id" class="notif-item" :class="{ unread: n.unread }" @click="n.unread = false">
                  <span class="bullet" />
                  <div><p>{{ n.text }}</p><span class="tiny muted">{{ n.time }}</span></div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="dropdown" v-click-outside="() => (userOpen = false)">
            <button class="user-btn" @click="userOpen = !userOpen">
              <UiAvatar :src="auth.user?.avatar" :name="auth.user?.name" :size="34" />
              <div class="user-meta">
                <b>{{ auth.user?.name }}</b>
                <span>{{ roleLabel }}</span>
              </div>
              <ChevronDown class="chev" />
            </button>
            <Transition name="drop">
              <div v-if="userOpen" class="menu">
                <RouterLink v-if="!isAdmin" :to="`/${layout}/profile`" class="menu-item" @click="userOpen = false"><User /> My profile</RouterLink>
                <RouterLink :to="`/${layout}/settings`" class="menu-item" @click="userOpen = false"><Settings /> Settings</RouterLink>
                <button class="menu-item danger" @click="logout"><LogOut /> Log out</button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <main class="content">
        <RouterView v-slot="{ Component, route: r }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="r.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House, User, Search, Inbox, MessageSquare, BookOpen, Settings, LogOut, Bell, Menu, X, ChevronDown, Sparkles,
  LayoutDashboard, CalendarDays, Users, NotebookPen, UserCheck, Target, ChartBar, Flag
} from '@lucide/vue'
import AppLogo from './AppLogo.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { commonApi } from '@/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const layout = computed(() => route.meta.layout)
const isAdmin = computed(() => layout.value === 'admin')
const roleLabel = computed(() => ({ student: 'Student', mentor: 'Mentor', admin: 'Programme Admin' })[layout.value])

const NAV = {
  student: [
    { to: '/student', label: 'Home', icon: House, exact: true },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/mentors', label: 'Find Mentors', icon: Search },
    { to: '/student/requests', label: 'My Requests', icon: Inbox },
    { to: '/student/messages', label: 'Messages', icon: MessageSquare },
    { to: '/student/resources', label: 'Resources', icon: BookOpen }
  ],
  mentor: [
    { to: '/mentor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/mentor/profile', label: 'My Profile', icon: User },
    { to: '/mentor/availability', label: 'Availability', icon: CalendarDays },
    { to: '/mentor/requests', label: 'Mentee Requests', icon: Inbox },
    { to: '/mentor/mentees', label: 'My Mentees', icon: Users },
    { to: '/mentor/sessions', label: 'Sessions', icon: NotebookPen },
    { to: '/mentor/resources', label: 'Resources', icon: BookOpen }
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/mentors', label: 'Mentor Approvals', icon: UserCheck },
    { to: '/admin/goals', label: 'Career Goals', icon: Target },
    { to: '/admin/participation', label: 'Participation', icon: ChartBar },
    { to: '/admin/concerns', label: 'Reports', icon: Flag }
  ]
}
const nav = computed(() => NAV[layout.value] || [])
const isActive = (item) => (item.exact ? route.path === item.to : route.path.startsWith(item.to))

const menuOpen = ref(false)
const bellOpen = ref(false)
const userOpen = ref(false)
const q = ref('')
const notes = ref([])
const unread = computed(() => notes.value.filter((n) => n.unread).length)

commonApi.getNotifications(layout.value).then((n) => (notes.value = n))
const markAll = () => notes.value.forEach((n) => (n.unread = false))

function search() {
  router.push({ path: '/student/mentors', query: q.value ? { q: q.value } : {} })
}
watch(() => route.query.q, (v) => (q.value = v || ''), { immediate: true })

function logout() {
  auth.logout()
  router.push('/login')
}

// close dropdowns when clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el._out = (e) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener('click', el._out)
  },
  unmounted(el) { document.removeEventListener('click', el._out) }
}
</script>

<style scoped>
.shell { display: flex; min-height: 100vh; }

/* ---- sidebar ---- */
.sidebar {
  position: sticky; top: 0; height: 100vh; width: 248px; flex-shrink: 0;
  display: flex; flex-direction: column; padding: 18px 14px;
  background: var(--surface); border-right: 1px solid var(--border);
  z-index: 40;
}
.side-top { display: flex; align-items: center; justify-content: space-between; padding: 2px 8px; }
.close-btn { display: none; }
.role-pill { align-self: flex-start; margin: 14px 8px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.nav { display: flex; flex-direction: column; gap: 2px; }
.nav-item {
  position: relative; display: flex; align-items: center; gap: 12px;
  height: 40px; padding: 0 12px; border-radius: 10px; border: 0; background: none; width: 100%;
  font-size: 13.5px; font-weight: 600; color: var(--text-2); text-align: left;
  transition: background 0.2s, color 0.2s;
}
.nav-item svg { width: 18px; height: 18px; flex-shrink: 0; transition: transform 0.3s var(--ease); }
.nav-item:hover { background: var(--surface-2); color: var(--text); }
.nav-item:hover svg { transform: translateX(2px); }
.nav-item.active { background: var(--primary-50); color: var(--primary); }
.nav-item.active::before { content: ''; position: absolute; left: -14px; top: 9px; bottom: 9px; width: 3px; border-radius: 0 3px 3px 0; background: var(--primary); animation: pop 0.3s var(--ease); }
.side-bottom { margin-top: auto; display: flex; flex-direction: column; gap: 2px; }
.side-quote { margin-bottom: 10px; padding: 14px; border-radius: 12px; background: linear-gradient(135deg, #eef0ff, #e7faf6); font-size: 12.5px; font-weight: 600; color: var(--text-2); }
.side-quote svg { width: 18px; height: 18px; color: var(--primary); margin-bottom: 6px; }

/* admin = dark sidebar */
.is-admin .sidebar { background: linear-gradient(180deg, var(--navy), var(--navy-2)); border-right: 0; }
.is-admin .role-pill { color: #a5a6d6; }
.is-admin .nav-item { color: #c9caf0; }
.is-admin .nav-item:hover { background: rgba(255, 255, 255, 0.07); color: #fff; }
.is-admin .nav-item.active { background: rgba(255, 255, 255, 0.12); color: #fff; }
.is-admin .nav-item.active::before { background: #2dd4bf; }
.is-admin .close-btn { color: #fff; }

/* ---- main ---- */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; gap: 12px;
  height: 64px; padding: 0 28px;
  background: rgba(246, 246, 251, 0.82); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.menu-btn { display: none; }
.search { width: 100%; max-width: 380px; }
.search .input { background: var(--surface); }
.top-title { font-size: 1rem; }
.top-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.bell { position: relative; }
.bell .dot { position: absolute; top: 3px; right: 3px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px; background: var(--danger); color: #fff; font-size: 10px; font-weight: 700; display: grid; place-items: center; animation: pulseRing 1.6s infinite; }
.user-btn { display: flex; align-items: center; gap: 10px; border: 0; background: none; padding: 4px 6px; border-radius: 12px; transition: background 0.2s; }
.user-btn:hover { background: var(--surface-2); }
.user-meta { display: flex; flex-direction: column; text-align: left; line-height: 1.25; }
.user-meta b { font-size: 13px; }
.user-meta span { font-size: 11.5px; color: var(--muted); }
.chev { width: 16px; height: 16px; color: var(--muted); }

.dropdown { position: relative; }
.menu {
  position: absolute; right: 0; top: calc(100% + 8px); min-width: 200px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-lg);
  padding: 6px; z-index: 50;
}
.menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border-radius: 8px; border: 0; background: none; color: var(--text-2); font-size: 13.5px; font-weight: 550; }
.menu-item svg { width: 16px; height: 16px; }
.menu-item:hover { background: var(--surface-2); }
.menu-item.danger { color: var(--danger); }
.notif { width: 320px; }
.menu-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; }
.notif-item { display: flex; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 13px; }
.notif-item:hover { background: var(--surface-2); }
.notif-item .bullet { width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: transparent; flex-shrink: 0; }
.notif-item.unread .bullet { background: var(--primary); }
.notif-item.unread p { font-weight: 650; }

.content { padding: 28px; max-width: 1320px; width: 100%; }
.scrim { display: none; }

@media (max-width: 960px) {
  .sidebar { position: fixed; left: 0; top: 0; transform: translateX(-100%); transition: transform 0.35s var(--ease); box-shadow: var(--shadow-lg); }
  .open .sidebar { transform: none; }
  .scrim { display: block; position: fixed; inset: 0; background: rgba(19, 19, 47, 0.4); z-index: 35; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .open .scrim { opacity: 1; pointer-events: auto; }
  .close-btn, .menu-btn { display: inline-flex; }
  .topbar { padding: 0 16px; }
  .content { padding: 20px 16px; }
  .user-meta, .chev { display: none; }
}
@media (max-width: 520px) {
  .notif { position: fixed; left: 12px; right: 12px; top: 60px; width: auto; }
}
</style>
