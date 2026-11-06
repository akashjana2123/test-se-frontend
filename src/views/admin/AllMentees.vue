<template>
  <div>
    <div class="page-head">
      <div>
        <h1>All mentees</h1>
        <p>Every student in the programme and where they are in their mentorship.</p>
      </div>
      <UiTabs v-model="tab" :tabs="tabs" />
    </div>

    <div v-if="loading" class="grid grid-4 mb"><div v-for="i in 4" :key="i" class="skeleton" style="height: 96px" /></div>
    <div v-else class="grid grid-4 mb stagger">
      <StatCard :icon="GraduationCap" label="Students" :value="list.length" color="indigo" />
      <StatCard :icon="HeartHandshake" label="Active mentorships" :value="count('active')" color="teal" />
      <StatCard :icon="Hourglass" label="Awaiting mentor reply" :value="count('pending')" color="amber" />
      <StatCard :icon="UserX" label="Not yet matched" :value="count('unmatched')" color="rose" />
    </div>

    <div class="card">
      <div class="toolbar">
        <div class="input-icon search"><Search /><input v-model="q" class="input" placeholder="Search by name, institute or skill..." /></div>
        <select v-model="goal" class="select goal"><option value="">All career goals</option><option v-for="g in goals" :key="g">{{ g }}</option></select>
        <select v-model="level" class="select goal"><option value="">All levels</option><option v-for="l in levels" :key="l">{{ l }}</option></select>
      </div>

      <div v-if="loading" class="stack-sm mt-3"><div v-for="i in 4" :key="i" class="skeleton" style="height: 56px" /></div>
      <div v-else class="table-wrap mt-3">
        <table class="table">
          <thead><tr><th>Student</th><th>Programme</th><th>Career goal</th><th>Mentor</th><th>Progress</th><th>Status</th><th class="right">Actions</th></tr></thead>
          <TransitionGroup tag="tbody" name="row">
            <tr v-for="s in shown" :key="s.id" :class="{ dim: s.accountStatus === 'suspended' }">
              <td>
                <div class="flex items-center gap-3">
                  <UiAvatar :src="s.avatar" :name="s.name" :size="38" />
                  <div><b>{{ s.name }}</b><p class="tiny muted">{{ s.institute }}</p></div>
                </div>
              </td>
              <td><span class="small">{{ s.programme }}</span><p class="tiny muted">{{ s.academicLevel }} · {{ s.year }}</p></td>
              <td><span class="tag">{{ s.careerGoal }}</span></td>
              <td>
                <div v-if="s.mentor" class="flex items-center gap-2">
                  <UiAvatar :src="s.mentor.avatar" :name="s.mentor.name" :size="26" />
                  <span class="small">{{ s.mentor.name }}</span>
                </div>
                <span v-else class="small muted">—</span>
              </td>
              <td class="prog">
                <template v-if="s.progress != null">
                  <span class="small"><b>{{ s.progress }}%</b></span>
                  <div class="progress mt-1"><span :style="{ width: s.progress + '%' }" /></div>
                </template>
                <span v-else class="small muted">—</span>
              </td>
              <td><StatusBadge :status="s.accountStatus === 'suspended' ? 'suspended' : s.status" /></td>
              <td class="right">
                <div class="flex gap-2 justify-end">
                  <button class="btn btn-outline btn-sm" @click="open(s)">View</button>
                  <button v-if="s.accountStatus === 'suspended'" class="btn btn-soft btn-sm" :disabled="busy === s.id" @click="setStatus(s, 'active')">Reactivate</button>
                  <button v-else class="btn btn-danger-outline btn-sm" :disabled="busy === s.id" @click="setStatus(s, 'suspended')">Suspend</button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
        <EmptyState v-if="!shown.length" title="No students found" text="Try a different search or filter." />
      </div>
    </div>

    <StudentProfileModal v-model="profileOpen" :student-id="sel?.id" :loader="adminApi.getStudentProfile">
      <div v-if="sel" class="mentorship">
        <div class="flex items-center justify-between gap-2 wrap">
          <span class="lbl"><HeartHandshake /> Mentorship</span>
          <StatusBadge :status="sel.status" />
        </div>
        <div v-if="sel.mentor" class="flex items-center gap-3 mt-2">
          <UiAvatar :src="sel.mentor.avatar" :name="sel.mentor.name" :size="36" />
          <div class="grow"><b class="small">{{ sel.mentor.name }}</b><p class="tiny muted">{{ sel.mentor.title }}</p></div>
          <span v-if="sel.nextSession" class="tiny muted"><CalendarDays class="ic" /> {{ sel.nextSession }}</span>
        </div>
        <p v-else class="small muted mt-2">This student has not been matched with a mentor yet.</p>
        <div v-if="sel.progress != null" class="mt-3">
          <div class="flex justify-between small"><span class="muted">Goal progress</span><b>{{ sel.progress }}%</b></div>
          <div class="progress mt-1"><span :style="{ width: sel.progress + '%' }" /></div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="profileOpen = false">Close</button>
        <template v-if="sel">
          <button v-if="sel.accountStatus === 'suspended'" class="btn btn-primary" :disabled="busy === sel.id" @click="setStatus(sel, 'active')">Reactivate</button>
          <button v-else class="btn btn-danger" :disabled="busy === sel.id" @click="setStatus(sel, 'suspended')">Suspend student</button>
        </template>
      </template>
    </StudentProfileModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, GraduationCap, HeartHandshake, Hourglass, UserX, CalendarDays } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatCard from '@/components/ui/StatCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import StudentProfileModal from '@/components/StudentProfileModal.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const list = ref([])
const loading = ref(true)
const tab = ref('all')
const q = ref('')
const goal = ref('')
const level = ref('')
const busy = ref(null)
const profileOpen = ref(false)
const sel = ref(null)

const count = (k) => list.value.filter((s) => s.status === k).length
const tabs = computed(() => [
  { key: 'all', label: 'All', count: list.value.length },
  { key: 'active', label: 'Active', count: count('active') },
  { key: 'pending', label: 'Pending', count: count('pending') },
  { key: 'completed', label: 'Completed', count: count('completed') },
  { key: 'unmatched', label: 'Unmatched', count: count('unmatched') }
])
const goals = computed(() => [...new Set(list.value.map((s) => s.careerGoal))].sort())
const levels = computed(() => [...new Set(list.value.map((s) => s.academicLevel))].sort())

const shown = computed(() => {
  const t = q.value.trim().toLowerCase()
  return list.value.filter((s) =>
    (tab.value === 'all' || s.status === tab.value) &&
    (!goal.value || s.careerGoal === goal.value) &&
    (!level.value || s.academicLevel === level.value) &&
    (!t || [s.name, s.institute, s.programme, ...(s.skills || [])].join(' ').toLowerCase().includes(t)))
})

onMounted(async () => {
  list.value = await adminApi.getAllMentees()
  loading.value = false
})

function open(s) { sel.value = s; profileOpen.value = true }

async function setStatus(s, status) {
  busy.value = s.id
  try {
    await adminApi.setAccountStatus(s.id, 'student', status)
    s.accountStatus = status
    toast.success(status === 'suspended' ? `${s.name}'s account suspended` : `${s.name}'s account reactivated`)
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
.goal { width: auto; min-width: 150px; }
.right { text-align: right; }
.prog { min-width: 90px; }
.dim td { opacity: 0.6; }
.dim td:last-child { opacity: 1; }
.row-enter-active, .row-leave-active { transition: all 0.35s var(--ease); }
.row-enter-from { opacity: 0; transform: translateY(8px); }
.row-leave-to { opacity: 0; transform: translateX(24px); }
.mentorship { padding: 14px; border-radius: 12px; background: var(--surface-2); }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 650; color: var(--muted); }
.lbl svg, .ic { width: 14px; height: 14px; color: var(--primary); vertical-align: -2px; }
</style>
