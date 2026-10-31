<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Incoming mentoring requests</h1>
        <p>Review requests and choose who you'd like to mentor.</p>
      </div>
      <UiTabs v-model="tab" :tabs="tabs" />
    </div>

    <div class="layout">
      <div>
        <div v-if="loading" class="stack"><div v-for="i in 2" :key="i" class="skeleton" style="height: 220px" /></div>
        <TransitionGroup v-else tag="div" name="list" class="stack">
          <div v-for="r in shown" :key="r.id" class="card req">
            <div class="flex items-start gap-3">
              <UiAvatar :src="r.avatar" :name="r.name" :size="50" />
              <div class="grow">
                <div class="flex items-center gap-2 wrap"><b>{{ r.name }}</b><StatusBadge :status="r.status" /></div>
                <p class="small muted">{{ r.course }} · {{ r.institute }}</p>
              </div>
              <span class="tiny muted">{{ r.receivedAgo }}</span>
            </div>

            <div class="grid grid-2 mt-4 info">
              <div><span class="lbl"><Target /> Career goal</span><p>{{ r.goal }}</p></div>
              <div><span class="lbl"><Tag /> Requested topic</span><span class="tag">{{ r.topic }}</span><span class="tag tag-gray" style="margin-left: 6px">{{ r.mode }}</span></div>
            </div>

            <div class="msg mt-3">
              <Quote />
              <p>{{ r.message }}</p>
            </div>
            <p v-if="r.reason" class="small muted mt-2">Reason: {{ r.reason }}</p>

            <div v-if="r.status === 'pending'" class="flex gap-2 mt-4 justify-end">
              <button class="btn btn-outline" :disabled="busy === r.id" @click="openDecline(r)">Decline</button>
              <button class="btn btn-primary" :disabled="busy === r.id" @click="accept(r)"><span v-if="busy === r.id" class="spinner" /><template v-else><Check /> Accept</template></button>
            </div>
          </div>
          <div v-if="!shown.length" key="empty" class="card">
            <EmptyState :title="`No ${tab} requests`" text="New requests will appear here." />
          </div>
        </TransitionGroup>
      </div>

      <aside v-if="avail" class="card side">
        <h4>Your availability</h4>
        <div class="flex items-center gap-2 mt-3 small">
          <span class="dot" :class="{ on: avail.available }" /> {{ avail.available ? 'Available for mentoring' : 'Not accepting requests' }}
        </div>
        <hr class="divider" />
        <p class="small muted">Maximum active mentees</p>
        <b class="big">{{ avail.maxMentees }}</b>
        <p class="small mt-3"><b>{{ avail.filled }} of {{ avail.maxMentees }}</b> spaces filled</p>
        <div class="progress mt-2"><span :style="{ width: (avail.filled / avail.maxMentees) * 100 + '%', background: avail.filled >= avail.maxMentees ? '#f59e0b' : '#14b8a6' }" /></div>
        <p class="tiny muted mt-2">{{ avail.maxMentees - avail.filled }} space(s) remaining</p>
        <RouterLink to="/mentor/availability" class="btn btn-outline btn-sm btn-block mt-4">Edit availability</RouterLink>
      </aside>
    </div>

    <UiModal v-model="declineOpen" title="Decline this request?">
      <p class="muted small">Are you sure you want to decline {{ target?.name }}'s request? You can share an optional reason (visible to the student).</p>
      <textarea v-model="reason" class="textarea mt-3" maxlength="200" placeholder="e.g. I'm currently at full capacity, please consider reaching out later." />
      <p class="tiny muted" style="text-align: right">{{ reason.length }}/200</p>
      <template #footer>
        <button class="btn btn-outline" @click="declineOpen = false">Cancel</button>
        <button class="btn btn-danger" @click="decline">Decline request</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Check, Target, Tag, Quote } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiModal from '@/components/ui/UiModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { mentorApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const tab = ref('pending')
const list = ref([])
const avail = ref(null)
const loading = ref(true)
const busy = ref(null)
const declineOpen = ref(false)
const target = ref(null)
const reason = ref('')

const count = (s) => list.value.filter((r) => r.status === s).length
const tabs = computed(() => [
  { key: 'pending', label: 'Pending', count: count('pending') },
  { key: 'accepted', label: 'Accepted', count: count('accepted') },
  { key: 'declined', label: 'Declined', count: count('declined') }
])
const shown = computed(() => list.value.filter((r) => r.status === tab.value))

async function load() {
  const [r, a] = await Promise.all([mentorApi.getRequests(), mentorApi.getAvailability()])
  list.value = r
  avail.value = a
  loading.value = false
}
onMounted(load)

async function accept(r) {
  busy.value = r.id
  try {
    await mentorApi.respond(r.id, 'accepted')
    r.status = 'accepted'
    avail.value.filled++
    toast.success(`You are now mentoring ${r.name}`)
  } catch (e) {
    toast.error(e.message)
  } finally {
    busy.value = null
  }
}

function openDecline(r) { target.value = r; reason.value = ''; declineOpen.value = true }
async function decline() {
  const r = target.value
  declineOpen.value = false
  await mentorApi.respond(r.id, 'declined', reason.value)
  Object.assign(r, { status: 'declined', reason: reason.value })
  toast.info(`Request from ${r.name} declined`)
}
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
.info p { font-size: 13.5px; margin-top: 4px; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 4px; }
.lbl svg { width: 14px; height: 14px; color: var(--primary); }
.msg { display: flex; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--surface-2); font-size: 13.5px; color: var(--text-2); }
.msg svg { width: 18px; height: 18px; color: var(--primary); opacity: 0.6; flex-shrink: 0; }
.side { position: sticky; top: 88px; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); }
.dot.on { background: #22c55e; box-shadow: 0 0 0 4px #dcfce7; }
.big { font-size: 1.5rem; }
@media (max-width: 1024px) { .layout { grid-template-columns: 1fr; } .side { position: static; } }
</style>
