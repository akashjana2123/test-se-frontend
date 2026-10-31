<template>
  <div>
    <div class="page-head">
      <div>
        <h1>My mentorship requests</h1>
        <p>Track your requests and upcoming sessions.</p>
      </div>
      <UiTabs v-model="tab" :tabs="[{ key: 'active', label: 'Active', count: active.length }, { key: 'past', label: 'Past', count: past.length }]" />
    </div>

    <div v-if="loading" class="stack"><div v-for="i in 2" :key="i" class="skeleton" style="height: 180px" /></div>

    <Transition v-else name="fade" mode="out-in">
      <TransitionGroup v-if="tab === 'active'" key="a" tag="div" name="list" class="stack">
        <div v-for="r in active" :key="r.id" class="card">
          <div class="row-head">
            <UiAvatar :src="r.mentor?.avatar" :name="r.mentor?.name" :size="48" />
            <div class="grow">
              <b>{{ r.mentor?.name }}</b>
              <p class="small muted">{{ r.mentor?.title }} at {{ r.mentor?.company }} · Requested on {{ r.sentOn }}</p>
            </div>
            <StatusBadge :status="r.status" />
          </div>

          <div class="stepper">
            <div v-for="(s, i) in stepsFor(r)" :key="s.label" class="st" :class="s.state">
              <span class="st-dot"><Check v-if="s.state === 'done'" /></span>
              <b>{{ s.label }}</b>
              <span class="tiny muted">{{ s.sub }}</span>
              <i v-if="i < 2" class="st-line" />
            </div>
          </div>

          <template v-if="r.status === 'pending'">
            <div class="info-row"><CalendarDays /> Calendar invite will be available once your request is accepted. <button class="btn btn-outline btn-sm" disabled>View calendar</button></div>
            <div class="info-row"><MessageSquare /> Messaging will be enabled after acceptance. <button class="btn btn-outline btn-sm" disabled>Open chat</button></div>
            <button class="btn btn-danger-outline btn-sm mt-3" @click="toCancel = r">Cancel request</button>
          </template>
          <div v-else class="flex gap-2 mt-3 wrap">
            <RouterLink to="/student/messages" class="btn btn-primary btn-sm"><MessageSquare /> Open conversation</RouterLink>
            <RouterLink :to="`/student/mentors/${r.mentorId}`" class="btn btn-outline btn-sm">View profile</RouterLink>
          </div>
        </div>
        <div v-if="!active.length" key="empty" class="card">
          <EmptyState title="No active requests" text="Find a mentor and send your first request.">
            <RouterLink to="/student/mentors" class="btn btn-primary btn-sm">Find mentors</RouterLink>
          </EmptyState>
        </div>
      </TransitionGroup>

      <div v-else key="p" class="card">
        <h3>Request history</h3>
        <div class="table-wrap mt-3">
          <table class="table">
            <thead><tr><th>Mentor</th><th>Goal</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              <tr v-for="r in past" :key="r.id">
                <td><div class="flex items-center gap-3"><UiAvatar :src="r.mentor?.avatar" :name="r.mentor?.name" :size="34" /><div><b>{{ r.mentor?.name }}</b><p class="tiny muted">{{ r.mentor?.title }}</p></div></div></td>
                <td>{{ r.goal }}</td>
                <td><StatusBadge :status="r.status" /></td>
                <td class="muted">{{ r.sentOn }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <UiModal :model-value="!!toCancel" title="Cancel this request?" @update:model-value="toCancel = null">
      <p class="muted">Your request to {{ toCancel?.mentor?.name }} will be withdrawn. You can send a new request after this.</p>
      <template #footer>
        <button class="btn btn-outline" @click="toCancel = null">Keep request</button>
        <button class="btn btn-danger" @click="cancel">Cancel request</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Check, CalendarDays, MessageSquare } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiModal from '@/components/ui/UiModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { studentApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const tab = ref('active')
const list = ref([])
const loading = ref(true)
const toCancel = ref(null)

const active = computed(() => list.value.filter((r) => ['pending', 'accepted'].includes(r.status)))
const past = computed(() => list.value.filter((r) => ['declined', 'cancelled'].includes(r.status)))

function stepsFor(r) {
  const accepted = r.status === 'accepted'
  return [
    { label: 'Sent', sub: r.sentOn, state: 'done' },
    { label: accepted ? 'Reviewed' : 'Pending', sub: accepted ? 'By mentor' : 'Awaiting mentor', state: accepted ? 'done' : 'current' },
    { label: 'Accepted', sub: accepted ? 'Mentorship active' : '—', state: accepted ? 'done' : '' }
  ]
}

async function load() {
  list.value = await studentApi.getRequests()
  loading.value = false
}
onMounted(load)

async function cancel() {
  const r = toCancel.value
  toCancel.value = null
  await studentApi.cancelRequest(r.id)
  toast.success('Request cancelled')
  load()
}
</script>

<style scoped>
.row-head { display: flex; align-items: center; gap: 14px; }
.stepper { display: grid; grid-template-columns: repeat(3, 1fr); margin: 22px 0 10px; }
.st { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; font-size: 13px; }
.st-dot { position: relative; z-index: 1; width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--border-strong); background: #fff; display: grid; place-items: center; margin-bottom: 6px; }
.st-dot svg { width: 14px; height: 14px; color: #fff; stroke-width: 3; }
.st.done .st-dot { background: #16a34a; border-color: #16a34a; animation: pop 0.4s var(--ease); }
.st.current .st-dot { border-color: var(--primary); box-shadow: inset 0 0 0 5px #fff; background: var(--primary); animation: pulseRing 1.6s infinite; }
.st-line { position: absolute; top: 12px; left: calc(50% + 16px); right: calc(-50% + 16px); height: 2px; background: var(--border); }
.st.done .st-line { background: linear-gradient(90deg, #16a34a, var(--border)); }
.info-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; padding: 12px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; color: var(--muted); }
.info-row svg { width: 18px; height: 18px; flex-shrink: 0; }
.info-row .btn { margin-left: auto; }
@media (max-width: 600px) { .info-row { flex-wrap: wrap; } }
</style>
