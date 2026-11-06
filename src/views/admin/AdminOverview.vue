<template>
  <div class="stack">
    <div class="page-head">
      <div>
        <h1>Programme overview</h1>
        <p>Track progress, participation and key updates across the mentoring programme.</p>
      </div>
      <select class="select year"><option>Academic Year 2026–27</option><option>Academic Year 2025–26</option></select>
    </div>

    <div v-if="!d" class="grid grid-4"><div v-for="i in 4" :key="i" class="skeleton" style="height: 104px" /></div>
    <div v-else class="grid stats stagger">
      <StatCard :icon="GraduationCap" label="Total students" :value="d.stats.totalStudents" :delta="8" color="indigo" />
      <StatCard :icon="UserCheck" label="Approved mentors" :value="d.stats.approvedMentors" :delta="5" color="teal" />
      <StatCard :icon="Inbox" label="Pending requests" :value="d.stats.pendingRequests" color="amber" />
      <StatCard :icon="HeartHandshake" label="Active mentorships" :value="d.stats.activeMentorships" :delta="12" color="rose" />
      <StatCard :icon="CalendarCheck" label="Completed sessions" :value="d.stats.completedSessions" :delta="18" color="blue" />
    </div>

    <div v-if="d" class="grid grid-2">
      <RouterLink to="/admin/all-mentors" class="card card-hover dir fade-up">
        <span class="icon-box"><Briefcase /></span>
        <div class="grow">
          <h4>All mentors</h4>
          <p class="small muted">{{ d.directory.mentors }} approved · {{ d.directory.availableMentors }} available now</p>
        </div>
        <div class="faces"><UiAvatar v-for="m in d.directory.mentorAvatars" :key="m.name" :src="m.avatar" :name="m.name" :size="30" /></div>
        <ArrowRight class="go" />
      </RouterLink>
      <RouterLink to="/admin/all-mentees" class="card card-hover dir fade-up" style="animation-delay: 0.06s">
        <span class="icon-box" style="background: var(--success-bg); color: var(--success)"><GraduationCap /></span>
        <div class="grow">
          <h4>All mentees</h4>
          <p class="small muted">{{ d.directory.activeMentees }} in active mentorships · {{ d.directory.unmatchedMentees }} not matched</p>
        </div>
        <div class="faces"><UiAvatar v-for="s in d.directory.menteeAvatars" :key="s.name" :src="s.avatar" :name="s.name" :size="30" /></div>
        <ArrowRight class="go" />
      </RouterLink>
    </div>

    <div v-if="d" class="grid main-grid">
      <div class="card fade-up">
        <div class="card-head"><h3>Participation trend</h3><RouterLink to="/admin/participation" class="link-btn small">Details <ArrowRight /></RouterLink></div>
        <LineChart :labels="d.trend.months" :series="[{ name: 'Requests', color: '#d5a64a', values: d.trend.requests }, { name: 'Completed', color: '#2e7d32', values: d.trend.completed }]" />
      </div>

      <div class="card fade-up" style="animation-delay: 0.06s">
        <h3>Mentor request status</h3>
        <div class="stack mt-4">
          <div v-for="s in d.requestStatus" :key="s.label" class="bar-row">
            <span class="small bold lbl">{{ s.label }}</span>
            <span class="small muted num">{{ s.value }}</span>
            <div class="progress grow"><span :style="{ width: grown ? (s.value / totalReq) * 100 + '%' : 0, background: s.color }" /></div>
            <span class="small muted pct">{{ Math.round((s.value / totalReq) * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="d" class="grid grid-2">
      <div class="card insight fade-up">
        <div class="flex items-center gap-2"><Sparkles class="spark" /><h4>Key insights</h4></div>
        <div class="flex items-start gap-3 mt-3">
          <span class="icon-box"><Lightbulb /></span>
          <div>
            <h3 class="hl">6 students need higher-studies guidance</h3>
            <p class="small muted mt-1">These students chose 'Higher studies' as their primary goal and are awaiting mentor matches.</p>
          </div>
        </div>
        <RouterLink to="/admin/participation" class="btn btn-soft btn-sm mt-4">View unmet needs <ArrowRight /></RouterLink>
      </div>

      <div class="card fade-up" style="animation-delay: 0.06s">
        <div class="card-head"><h3>Awaiting your action</h3></div>
        <div class="stack-sm">
          <RouterLink to="/admin/mentors" class="todo-row">
            <span class="icon-box"><UserCheck /></span>
            <div class="grow"><b>Mentor applications</b><p class="small muted">Review and approve new mentors</p></div>
            <span class="count">{{ d.stats.pendingMentors }}</span>
          </RouterLink>
          <RouterLink to="/admin/concerns" class="todo-row">
            <span class="icon-box" style="background: var(--danger-bg); color: var(--danger)"><Flag /></span>
            <div class="grow"><b>Reported concerns</b><p class="small muted">Open reports need a decision</p></div>
            <span class="count">{{ d.stats.openConcerns }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { GraduationCap, UserCheck, Inbox, HeartHandshake, CalendarCheck, ArrowRight, Sparkles, Lightbulb, Flag, Briefcase } from '@lucide/vue'
import StatCard from '@/components/ui/StatCard.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import LineChart from '@/components/ui/LineChart.vue'
import { adminApi } from '@/api'

const d = ref(null)
const grown = ref(false)
const totalReq = computed(() => d.value.requestStatus.reduce((a, b) => a + b.value, 0))

onMounted(async () => {
  d.value = await adminApi.getOverview()
  setTimeout(() => (grown.value = true), 100)
})
</script>

<style scoped>
.year { width: auto; }
.stats { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.main-grid { grid-template-columns: 1.4fr 1fr; }
.bar-row { display: flex; align-items: center; gap: 10px; }
.lbl { width: 70px; }
.num { width: 34px; text-align: right; }
.pct { width: 36px; text-align: right; }
.bar-row .progress span { transition: width 1.1s var(--ease); }
.insight { background: linear-gradient(135deg, #fff, var(--primary-50)); }
.spark { width: 18px; height: 18px; color: var(--primary); }
.hl { color: var(--primary-text); }
.todo-row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; color: inherit; transition: background 0.2s, transform 0.2s; }
.todo-row:hover { background: var(--surface-2); transform: translateX(3px); }
.dir { display: flex; align-items: center; gap: 14px; color: inherit; }
.dir h4 { margin: 0; }
.faces { display: flex; }
.faces > * { margin-left: -8px; box-shadow: 0 0 0 2px var(--surface); border-radius: 50%; }
.go { width: 18px; height: 18px; color: var(--muted); transition: transform 0.2s var(--ease), color 0.2s; }
.dir:hover .go { transform: translateX(3px); color: var(--primary); }
@media (max-width: 560px) { .faces { display: none; } }
.count { min-width: 28px; height: 24px; padding: 0 8px; border-radius: 999px; background: var(--primary); color: #fff; font-size: 12px; font-weight: 700; display: grid; place-items: center; }
@media (max-width: 1200px) { .stats { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 1024px) { .main-grid { grid-template-columns: 1fr; } }
@media (max-width: 680px) { .stats { grid-template-columns: 1fr; } }
</style>
