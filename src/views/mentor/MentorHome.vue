<template>
  <div class="stack">
    <div class="page-head">
      <div>
        <h1>Welcome, {{ firstName }}</h1>
        <p>Here is what's happening with your mentees.</p>
      </div>
      <RouterLink to="/mentor/requests" class="btn btn-primary"><Inbox /> Review requests</RouterLink>
    </div>

    <div v-if="!d" class="grid grid-4"><div v-for="i in 4" :key="i" class="skeleton" style="height: 104px" /></div>
    <div v-else class="grid grid-4 stagger">
      <StatCard :icon="Inbox" label="Pending requests" :value="d.pending" color="amber" />
      <StatCard :icon="Users" :label="`Active mentees (of ${d.capacity})`" :value="d.mentees" color="indigo" />
      <StatCard :icon="NotebookPen" label="Sessions recorded" :value="d.sessions" color="teal" />
      <StatCard :icon="Star" label="Average rating" :value="d.rating" :decimals="1" color="rose" />
    </div>

    <div v-if="d" class="grid grid-2">
      <div class="card fade-up">
        <div class="card-head"><h3>Upcoming sessions</h3><RouterLink to="/mentor/sessions" class="link-btn small">All sessions <ArrowRight /></RouterLink></div>
        <div class="stack-sm">
          <div v-for="u in d.upcoming" :key="u.name" class="row">
            <UiAvatar :src="u.avatar" :name="u.name" :size="40" />
            <div class="grow"><b>{{ u.name }}</b><p class="small muted truncate">{{ u.goal }}</p></div>
            <span class="when"><CalendarDays /> {{ u.when }}</span>
          </div>
        </div>
      </div>

      <div class="card fade-up" style="animation-delay: 0.08s">
        <div class="card-head"><h3>New requests</h3><RouterLink to="/mentor/requests" class="link-btn small">View all <ArrowRight /></RouterLink></div>
        <div v-if="d.recentRequests.length" class="stack-sm">
          <RouterLink v-for="r in d.recentRequests" :key="r.id" to="/mentor/requests" class="row link-row">
            <UiAvatar :src="r.avatar" :name="r.name" :size="40" />
            <div class="grow"><b>{{ r.name }}</b><p class="small muted truncate">{{ r.course }}</p></div>
            <span class="tag">{{ r.topic }}</span>
          </RouterLink>
        </div>
        <EmptyState v-else title="All caught up" text="No new requests." />
      </div>
    </div>

    <div v-if="d" class="card capacity fade-up">
      <div class="grow">
        <h4>Mentee capacity</h4>
        <p class="small muted">{{ d.mentees }} of {{ d.capacity }} spaces filled</p>
        <div class="progress mt-2"><span :style="{ width: (d.mentees / d.capacity) * 100 + '%', background: d.mentees >= d.capacity ? '#f59e0b' : '#14b8a6' }" /></div>
      </div>
      <RouterLink to="/mentor/availability" class="btn btn-outline">Manage availability</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Inbox, Users, NotebookPen, Star, ArrowRight, CalendarDays } from '@lucide/vue'
import StatCard from '@/components/ui/StatCard.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { mentorApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const firstName = computed(() => auth.user?.name?.split(' ')[0])
const d = ref(null)
onMounted(async () => (d.value = await mentorApi.getDashboard()))
</script>

<style scoped>
.row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; transition: background 0.2s; color: inherit; }
.link-row:hover { background: var(--surface-2); }
.when { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--primary); background: var(--primary-50); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
.when svg { width: 14px; height: 14px; }
.capacity { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
@media (max-width: 600px) { .when { display: none; } }
</style>
