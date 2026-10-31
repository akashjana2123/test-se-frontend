<template>
  <div class="stack">
    <div class="page-head">
      <div>
        <h1 class="flex items-center gap-2">Hi {{ firstName }} <Hand class="wave" /></h1>
        <p>Here are mentors who match your profile.</p>
      </div>
      <RouterLink to="/student/mentors" class="btn btn-primary"><Search /> Find mentors</RouterLink>
    </div>

    <div class="grid grid-3 stagger">
      <div class="card completion">
        <ProgressRing :value="profile?.profileCompletion ?? 0" :size="64" />
        <div class="grow">
          <h4>Profile completion</h4>
          <p class="small muted">{{ (profile?.profileCompletion ?? 0) < 100 ? 'Add a few more details for better matches.' : 'Your profile is complete.' }}</p>
        </div>
        <RouterLink to="/student/profile" class="btn btn-outline btn-sm">{{ (profile?.profileCompletion ?? 0) < 100 ? 'Complete' : 'Edit' }}</RouterLink>
      </div>

      <div class="card session">
        <div class="icon-box"><CalendarDays /></div>
        <div class="grow">
          <h4>Upcoming session</h4>
          <p v-if="ship" class="small muted">{{ ship.session.date }} · {{ ship.session.time }}</p>
          <div v-else class="skeleton" style="height: 14px; width: 70%" />
        </div>
        <RouterLink to="/student/messages" class="btn btn-soft btn-sm">Open</RouterLink>
      </div>

      <div class="card session">
        <div class="icon-box" style="background: #fff7e6; color: #b45309"><Hourglass /></div>
        <div class="grow">
          <h4>Requests</h4>
          <p class="small muted">{{ pendingCount }} pending · one active request at a time</p>
        </div>
        <RouterLink to="/student/requests" class="btn btn-soft btn-sm">Track</RouterLink>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Top mentor recommendations</h3>
        <RouterLink to="/student/mentors" class="link-btn small">View all <ArrowRight /></RouterLink>
      </div>
      <div class="grid grid-3">
        <template v-if="loading">
          <div v-for="i in 3" :key="i" class="skeleton" style="height: 250px" />
        </template>
        <MentorCard v-for="m in top" v-else :key="m.id" :mentor="m" class="fade-up" />
      </div>
    </div>

    <div class="card">
      <h3>Search and filter mentors</h3>
      <form class="filters mt-4" @submit.prevent="go">
        <div class="input-icon grow"><Search /><input v-model="f.q" class="input" placeholder="Search by name, skills, company..." /></div>
        <select v-model="f.domain" class="select"><option value="">All domains</option><option v-for="d in DOMAINS" :key="d">{{ d }}</option></select>
        <select v-model="f.availability" class="select"><option value="">Any availability</option><option value="available">Available now</option></select>
        <button class="btn btn-primary">Search</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Hand, Search, CalendarDays, Hourglass, ArrowRight } from '@lucide/vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import MentorCard from '@/components/MentorCard.vue'
import { studentApi } from '@/api'
import { DOMAINS } from '@/mock/db'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const firstName = computed(() => auth.user?.name?.split(' ')[0])

const profile = ref(null)
const top = ref([])
const ship = ref(null)
const requests = ref([])
const loading = ref(true)
const pendingCount = computed(() => requests.value.filter((r) => r.status === 'pending').length)
const f = reactive({ q: '', domain: '', availability: '' })

onMounted(async () => {
  const [p, m, s, r] = await Promise.all([studentApi.getProfile(), studentApi.getMentors(), studentApi.getMentorship(), studentApi.getRequests()])
  profile.value = p
  top.value = m.slice(0, 3)
  ship.value = s
  requests.value = r
  loading.value = false
})

function go() {
  const query = Object.fromEntries(Object.entries(f).filter(([, v]) => v))
  router.push({ path: '/student/mentors', query })
}
</script>

<style scoped>
.completion, .session { display: flex; align-items: center; gap: 14px; }
.wave { width: 26px; height: 26px; color: #f59e0b; transform-origin: 70% 80%; animation: wave 2s ease-in-out 0.4s 2; }
@keyframes wave { 0%, 60%, 100% { transform: rotate(0); } 10%, 30% { transform: rotate(16deg); } 20%, 40% { transform: rotate(-8deg); } }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.filters .select { width: auto; min-width: 170px; }
@media (max-width: 680px) { .filters .select { flex: 1; } }
</style>
