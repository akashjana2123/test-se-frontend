<template>
  <div class="stack">
    <div class="page-head">
      <div>
        <h1>Participation analytics</h1>
        <p>Anonymised and aggregated data only. No student identities are shown.</p>
      </div>
      <div class="flex gap-2 wrap">
        <select v-model="range" class="select auto"><option value="6">Last 6 months</option><option value="3">Last 3 months</option></select>
        <select v-model="topic" class="select auto"><option value="">All topics</option><option v-for="t in d?.topics || []" :key="t.topic">{{ t.topic }}</option></select>
      </div>
    </div>

    <div v-if="!d" class="grid grid-2"><div class="skeleton" style="height: 300px" /><div class="skeleton" style="height: 300px" /></div>

    <template v-else>
      <div class="grid main">
        <div class="card fade-up">
          <div class="card-head"><h3>Requests and completed sessions</h3></div>
          <BarChart :key="chartKey" :labels="months" :series="[{ name: 'Mentor requests', color: '#4f46e5', values: reqs }, { name: 'Completed sessions', color: '#14b8a6', values: done }]" :height="210" />
        </div>
        <div class="card fade-up" style="animation-delay: 0.06s">
          <h3>Request status</h3>
          <div class="mt-4"><DonutChart :data="d.requestStatus" caption="Total requests" /></div>
        </div>
      </div>

      <div class="grid grid-3">
        <StatCard :icon="Users" label="Mentors available" :value="d.mentorsAvailable" color="teal" />
        <div class="card cap">
          <ProgressRing :value="d.capacityUsed" :size="64" color="#4f46e5" />
          <div><h4>Capacity used</h4><p class="small muted">Based on mentors' declared monthly capacity</p></div>
        </div>
        <StatCard :icon="TrendingUp" label="Requests this period" :value="reqs.reduce((a, b) => a + b, 0)" color="indigo" />
      </div>

      <div class="card fade-up">
        <div class="card-head">
          <div><h3>Unmet needs</h3><p class="small muted">Demand vs mentor availability by topic</p></div>
        </div>
        <div v-if="gap" class="notice notice-warning mb"><TriangleAlert /> <span><b>{{ gap.topic }}: high demand, limited mentor capacity.</b> Consider requesting more mentors for this topic.</span></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Mentoring topic</th><th>Requests</th><th>Mentors</th><th>Capacity (slots)</th><th>Demand vs availability</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="t in topics" :key="t.topic">
                <td><b>{{ t.topic }}</b></td>
                <td>{{ t.requests }}</td>
                <td>{{ t.mentors }}</td>
                <td>{{ t.slots }}</td>
                <td class="vs">
                  <div class="vs-bar"><span class="r" :style="{ width: (t.requests / maxReq) * 100 + '%' }" /></div>
                  <div class="vs-bar"><span class="c" :style="{ width: (t.slots / maxReq) * 100 + '%' }" /></div>
                </td>
                <td><span class="badge" :class="level(t).cls">{{ level(t).label }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex gap-4 small muted mt-3"><span class="key"><i class="r" /> Requests</span><span class="key"><i class="c" /> Mentor capacity</span></div>
      </div>

      <div class="card fade-up">
        <div class="card-head"><h3>Mentors with low availability</h3></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Mentor</th><th>Current mentees</th><th>Declared capacity</th><th>Availability</th></tr></thead>
            <tbody>
              <tr v-for="m in d.lowAvailability" :key="m.name">
                <td><div class="flex items-center gap-3"><UiAvatar :src="m.avatar" :name="m.name" :size="32" /><b>{{ m.name }}</b></div></td>
                <td>{{ m.current }} / {{ m.capacity }}</td>
                <td style="min-width: 160px"><div class="progress"><span :style="{ width: (m.current / m.capacity) * 100 + '%', background: avColor(m) }" /></div></td>
                <td><b :style="{ color: avColor(m) }">{{ Math.round((1 - m.current / m.capacity) * 100) }}%</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, TrendingUp, TriangleAlert } from '@lucide/vue'
import BarChart from '@/components/ui/BarChart.vue'
import DonutChart from '@/components/ui/DonutChart.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import { adminApi } from '@/api'

const d = ref(null)
const range = ref('6')
const topic = ref('')

onMounted(async () => (d.value = await adminApi.getParticipation()))

// filters (client-side for the demo; send as query params once the API supports them)
const n = computed(() => Number(range.value))
const share = computed(() => {
  if (!topic.value) return 1
  const total = d.value.topics.reduce((a, t) => a + t.requests, 0)
  return d.value.topics.find((t) => t.topic === topic.value).requests / total
})
const months = computed(() => d.value.months.slice(-n.value))
const reqs = computed(() => d.value.requests.slice(-n.value).map((v) => Math.round(v * share.value)))
const done = computed(() => d.value.completed.slice(-n.value).map((v) => Math.round(v * share.value)))
const chartKey = computed(() => range.value + topic.value)

const topics = computed(() => d.value.topics.filter((t) => !topic.value || t.topic === topic.value))
const maxReq = computed(() => Math.max(...d.value.topics.map((t) => Math.max(t.requests, t.slots))))
const gap = computed(() => topics.value.find((t) => t.requests / t.slots > 3))

function level(t) {
  const r = t.requests / t.slots
  if (r > 3) return { label: 'High demand · low availability', cls: 'badge-danger' }
  if (r > 1.4) return { label: 'Moderate demand', cls: 'badge-warning' }
  return { label: 'Balanced', cls: 'badge-success' }
}
const avColor = (m) => {
  const free = 1 - m.current / m.capacity
  return free === 0 ? '#ef4444' : free < 0.35 ? '#f59e0b' : '#16a34a'
}
</script>

<style scoped>
.auto { width: auto; }
.main { grid-template-columns: 1.4fr 1fr; }
.cap { display: flex; align-items: center; gap: 14px; }
.mb { margin-bottom: 14px; }
.vs { min-width: 180px; }
.vs-bar { height: 7px; border-radius: 999px; background: var(--surface-2); overflow: hidden; margin: 3px 0; }
.vs-bar span { display: block; height: 100%; border-radius: inherit; animation: grow 1s var(--ease) both; transform-origin: left; }
.r { background: #4f46e5; }
.c { background: #14b8a6; }
@keyframes grow { from { transform: scaleX(0); } }
.key { display: flex; align-items: center; gap: 6px; }
.key i { width: 10px; height: 10px; border-radius: 3px; }
@media (max-width: 1024px) { .main { grid-template-columns: 1fr; } }
</style>
