<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Manage career goals</h1>
        <p>Review 'Other career goal' requests and add them to the available list.</p>
      </div>
      <UiTabs v-model="tab" :tabs="tabs" />
    </div>

    <div class="layout">
      <div class="card">
        <div v-if="loading" class="stack-sm"><div v-for="i in 4" :key="i" class="skeleton" style="height: 52px" /></div>
        <div v-else class="table-wrap">
          <table class="table">
            <thead><tr><th>Proposed goal</th><th>Requester</th><th>Rationale</th><th>Date</th><th>Status</th></tr></thead>
            <TransitionGroup tag="tbody" name="row">
              <tr v-for="g in shown" :key="g.id" class="click" @click="open(g)">
                <td><b>{{ g.goal }}</b></td>
                <td><span class="who"><component :is="g.requester === 'Mentor' ? HeartHandshake : GraduationCap" /> {{ g.requester }}</span><p class="tiny muted">{{ g.requesterName }}</p></td>
                <td class="small muted rat">{{ g.rationale }}</td>
                <td class="muted nowrap">{{ g.date }}</td>
                <td><StatusBadge :status="g.status" /></td>
              </tr>
            </TransitionGroup>
          </table>
          <EmptyState v-if="!shown.length" :title="`No ${tab} goals`" />
        </div>
      </div>

      <aside class="card">
        <h4>Available career goals ({{ approved.length }})</h4>
        <p class="small muted mt-1">Visible to students and mentors.</p>
        <TransitionGroup tag="ul" name="list" class="goals">
          <li v-for="g in approved" :key="g" :class="{ fresh: g === fresh }">
            <CircleCheck /> {{ g }}<span v-if="g === fresh" class="tag">New</span>
          </li>
        </TransitionGroup>
      </aside>
    </div>

    <UiModal v-model="modal" title="Review career goal request" :width="520">
      <template v-if="cur">
        <div class="stack">
          <div><span class="lbl">Proposed goal</span><h3>{{ cur.goal }}</h3></div>
          <div><span class="lbl">Requested by</span><p>{{ cur.requesterName }} ({{ cur.requester }})</p></div>
          <div><span class="lbl">Rationale</span><p class="muted">{{ cur.rationale }}</p></div>
          <div class="notice small"><Info /> Approved goals are added to the list shown to students and mentors.</div>
        </div>
      </template>
      <template v-if="cur?.status === 'pending'" #footer>
        <button class="btn btn-danger-outline" @click="decide('declined')">Decline</button>
        <button class="btn btn-primary" @click="decide('approved')">Add to approved goals</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { HeartHandshake, GraduationCap, CircleCheck, Info } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiModal from '@/components/ui/UiModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const tab = ref('pending')
const list = ref([])
const approved = ref([])
const loading = ref(true)
const modal = ref(false)
const cur = ref(null)
const fresh = ref('')

const count = (s) => list.value.filter((g) => g.status === s).length
const tabs = computed(() => [
  { key: 'pending', label: 'Pending', count: count('pending') },
  { key: 'approved', label: 'Approved', count: count('approved') },
  { key: 'declined', label: 'Declined', count: count('declined') }
])
const shown = computed(() => list.value.filter((g) => g.status === tab.value))

onMounted(async () => {
  const r = await adminApi.getCareerGoals()
  list.value = r.requests
  approved.value = r.approved
  loading.value = false
})

function open(g) { cur.value = g; modal.value = true }

async function decide(status) {
  const g = cur.value
  modal.value = false
  await adminApi.decideCareerGoal(g.id, status)
  g.status = status
  if (status === 'approved' && !approved.value.includes(g.goal)) {
    approved.value.push(g.goal)
    fresh.value = g.goal
  }
  toast.success(status === 'approved' ? `'${g.goal}' added to career goals` : `'${g.goal}' declined`)
}
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
.click { cursor: pointer; }
.who { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
.who svg { width: 15px; height: 15px; color: var(--primary); }
.rat { max-width: 300px; }
.nowrap { white-space: nowrap; }
.lbl { display: block; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 4px; }
.goals { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-direction: column; gap: 6px; }
.goals li { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; font-size: 13.5px; font-weight: 550; transition: background 0.3s; }
.goals li svg { width: 16px; height: 16px; color: #16a34a; }
.goals li .tag { margin-left: auto; }
.goals li.fresh { background: var(--success-bg); animation: pop 0.5s var(--ease); }
.row-enter-active, .row-leave-active { transition: all 0.35s var(--ease); }
.row-enter-from { opacity: 0; transform: translateY(8px); }
.row-leave-to { opacity: 0; transform: translateX(24px); }
@media (max-width: 1024px) { .layout { grid-template-columns: 1fr; } }
</style>
