<template>
  <div>
    <div class="page-head">
      <div>
        <h1>All mentors</h1>
        <p>Every approved mentor in the programme, their load and availability.</p>
      </div>
      <UiTabs v-model="tab" :tabs="tabs" />
    </div>

    <div v-if="loading" class="grid grid-4 mb"><div v-for="i in 4" :key="i" class="skeleton" style="height: 96px" /></div>
    <div v-else class="grid grid-4 mb stagger">
      <StatCard :icon="Briefcase" label="Approved mentors" :value="list.length" color="indigo" />
      <StatCard :icon="CircleCheck" label="Available now" :value="count('available')" color="teal" />
      <StatCard :icon="Gauge" label="At full capacity" :value="atCapacity" color="amber" />
      <StatCard :icon="Users" label="Active mentees" :value="totalMentees" color="blue" />
    </div>

    <div class="card">
      <div class="toolbar">
        <div class="input-icon search"><Search /><input v-model="q" class="input" placeholder="Search by name, company or expertise..." /></div>
        <select v-model="domain" class="select domain"><option value="">All domains</option><option v-for="d in domains" :key="d">{{ d }}</option></select>
      </div>

      <div v-if="loading" class="stack-sm mt-3"><div v-for="i in 4" :key="i" class="skeleton" style="height: 56px" /></div>
      <div v-else class="table-wrap mt-3">
        <table class="table">
          <thead><tr><th>Mentor</th><th>Domain</th><th>Expertise</th><th>Mentees</th><th>Sessions</th><th>Rating</th><th>Status</th><th class="right">Actions</th></tr></thead>
          <TransitionGroup tag="tbody" name="row">
            <tr v-for="m in shown" :key="m.id" :class="{ dim: m.accountStatus === 'suspended' }">
              <td>
                <div class="flex items-center gap-3">
                  <UiAvatar :src="m.avatar" :name="m.name" :size="38" />
                  <div><b>{{ m.name }}</b><p class="tiny muted">{{ m.title }} at {{ m.company }}</p></div>
                </div>
              </td>
              <td>{{ m.domain }}</td>
              <td><div class="flex wrap gap-1"><span v-for="t in m.tags.slice(0, 2)" :key="t" class="tag">{{ t }}</span><span v-if="m.tags.length > 2" class="tag tag-gray">+{{ m.tags.length - 2 }}</span></div></td>
              <td class="load">
                <span class="small"><b>{{ m.activeMentees }}</b> / {{ m.capacity }}</span>
                <div class="progress mt-1"><span :style="{ width: Math.min(100, (m.activeMentees / m.capacity) * 100) + '%', background: m.activeMentees >= m.capacity ? 'var(--danger)' : 'var(--primary)' }" /></div>
              </td>
              <td>{{ m.sessions }}</td>
              <td><span class="rating"><Star /> {{ m.rating }}</span></td>
              <td><StatusBadge :status="m.accountStatus === 'suspended' ? 'suspended' : m.available ? 'available' : 'busy'" /></td>
              <td class="right">
                <div class="flex gap-2 justify-end">
                  <button class="btn btn-outline btn-sm" @click="open(m)">View</button>
                  <button v-if="m.accountStatus === 'suspended'" class="btn btn-soft btn-sm" :disabled="busy === m.id" @click="setStatus(m, 'active')">Reactivate</button>
                  <button v-else class="btn btn-danger-outline btn-sm" :disabled="busy === m.id" @click="setStatus(m, 'suspended')">Suspend</button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
        <EmptyState v-if="!shown.length" title="No mentors found" text="Try a different search or filter." />
      </div>
    </div>

    <UiModal v-model="detailOpen" title="Mentor details" :width="640">
      <div v-if="sel" class="stack-sm pf">
        <div class="pf-head">
          <UiAvatar :src="sel.avatar" :name="sel.name" :size="64" />
          <div class="grow min0">
            <h3>{{ sel.name }}</h3>
            <p class="small muted">{{ sel.title }} at {{ sel.company }} · {{ sel.location }}</p>
            <div class="flex gap-2 wrap mt-2">
              <span class="tag">{{ sel.domain }}</span>
              <span class="tag tag-gray">{{ sel.experience }}+ yrs experience</span>
              <span class="tag tag-gray"><Star class="ic" /> {{ sel.rating }} · {{ sel.sessions }} sessions</span>
            </div>
          </div>
          <StatusBadge :status="sel.accountStatus === 'suspended' ? 'suspended' : sel.available ? 'available' : 'busy'" />
        </div>

        <div v-if="sel.about"><span class="lbl"><UserRound /> About</span><p class="small">{{ sel.about }}</p></div>

        <div class="grid grid-2 pf-grid">
          <div><span class="lbl"><Target /> Mentoring goals</span><div class="flex wrap gap-1"><span v-for="g in sel.goals" :key="g" class="tag">{{ g }}</span></div></div>
          <div><span class="lbl"><Gauge /> Capacity</span><p class="small"><b>{{ sel.activeMentees }}</b> of {{ sel.capacity }} filled · {{ sel.pendingRequests }} pending request(s)</p></div>
        </div>

        <div><span class="lbl"><Sparkles /> Expertise</span><div class="flex wrap gap-2"><span v-for="t in sel.tags" :key="t" class="chip active">{{ t }}</span></div></div>

        <div>
          <span class="lbl"><Users /> Current mentees</span>
          <div v-if="sel.menteeList.length" class="stack-sm">
            <div v-for="s in sel.menteeList" :key="s.id" class="mini-row">
              <UiAvatar :src="s.avatar" :name="s.name" :size="30" />
              <b class="small grow">{{ s.name }}</b>
              <span class="tag tag-gray">{{ s.careerGoal }}</span>
            </div>
          </div>
          <p v-else class="small muted">No active mentees.</p>
        </div>

        <div v-if="sel.careerPath?.length">
          <span class="lbl"><Route /> Career path</span>
          <ul class="path">
            <li v-for="c in sel.careerPath" :key="c.title + c.period"><b class="small">{{ c.title }}</b><span class="tiny muted"> · {{ c.org }} · {{ c.period }}</span></li>
          </ul>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="detailOpen = false">Close</button>
        <template v-if="sel">
          <button v-if="sel.accountStatus === 'suspended'" class="btn btn-primary" :disabled="busy === sel.id" @click="setStatus(sel, 'active')">Reactivate</button>
          <button v-else class="btn btn-danger" :disabled="busy === sel.id" @click="setStatus(sel, 'suspended')">Suspend mentor</button>
        </template>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Briefcase, CircleCheck, Gauge, Users, Star, UserRound, Target, Sparkles, Route } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiModal from '@/components/ui/UiModal.vue'
import StatCard from '@/components/ui/StatCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const list = ref([])
const loading = ref(true)
const tab = ref('all')
const q = ref('')
const domain = ref('')
const busy = ref(null)
const detailOpen = ref(false)
const sel = ref(null)

const matchTab = {
  all: () => true,
  available: (m) => m.available && m.accountStatus !== 'suspended',
  unavailable: (m) => !m.available && m.accountStatus !== 'suspended',
  suspended: (m) => m.accountStatus === 'suspended'
}
const count = (k) => list.value.filter(matchTab[k]).length
const tabs = computed(() => [
  { key: 'all', label: 'All', count: list.value.length },
  { key: 'available', label: 'Available', count: count('available') },
  { key: 'unavailable', label: 'Unavailable', count: count('unavailable') },
  { key: 'suspended', label: 'Suspended', count: count('suspended') }
])
const domains = computed(() => [...new Set(list.value.map((m) => m.domain))].sort())
const atCapacity = computed(() => list.value.filter((m) => m.activeMentees >= m.capacity).length)
const totalMentees = computed(() => list.value.reduce((s, m) => s + m.activeMentees, 0))

const shown = computed(() => {
  const s = q.value.trim().toLowerCase()
  return list.value.filter((m) =>
    matchTab[tab.value](m) &&
    (!domain.value || m.domain === domain.value) &&
    (!s || [m.name, m.title, m.company, ...m.tags].join(' ').toLowerCase().includes(s)))
})

onMounted(async () => {
  list.value = await adminApi.getAllMentors()
  loading.value = false
})

function open(m) { sel.value = m; detailOpen.value = true }

async function setStatus(m, status) {
  busy.value = m.id
  try {
    await adminApi.setAccountStatus(m.id, 'mentor', status)
    m.accountStatus = status
    toast.success(status === 'suspended' ? `${m.name} suspended and hidden from students` : `${m.name} reactivated`)
  } catch (e) {
    toast.error(e.message)
  } finally {
    busy.value = null
  }
}
</script>

<style scoped>
.mb { margin-bottom: 20px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; }
.search { flex: 1; max-width: 360px; min-width: 200px; }
.domain { width: auto; min-width: 160px; }
.right { text-align: right; }
.load { min-width: 90px; }
.rating { display: inline-flex; align-items: center; gap: 4px; font-weight: 600; }
.rating svg, .ic { width: 13px; height: 13px; color: var(--primary); fill: var(--primary); }
.dim td { opacity: 0.6; }
.dim td:last-child { opacity: 1; }
.row-enter-active, .row-leave-active { transition: all 0.35s var(--ease); }
.row-enter-from { opacity: 0; transform: translateY(8px); }
.row-leave-to { opacity: 0; transform: translateX(24px); }
.min0 { min-width: 0; }
.pf { gap: 16px; }
.pf-head { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.pf-head h3 { margin: 0; }
.pf-grid { gap: 14px; }
.pf .chip { cursor: default; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 6px; }
.lbl svg { width: 14px; height: 14px; color: var(--primary); }
.mini-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; background: var(--surface-2); }
.path { list-style: none; margin: 0; padding: 0 0 0 14px; border-left: 2px solid var(--primary-100); display: flex; flex-direction: column; gap: 6px; }
@media (max-width: 560px) { .pf-grid { grid-template-columns: 1fr; } }
</style>
