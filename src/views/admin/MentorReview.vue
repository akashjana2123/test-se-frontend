<template>
  <div>
    <RouterLink to="/admin/mentors" class="back-link"><ArrowLeft /> Back to mentor applications</RouterLink>

    <div v-if="!a" class="layout"><div class="skeleton" style="height: 460px" /><div class="skeleton" style="height: 300px" /></div>

    <div v-else class="layout">
      <div class="card fade-up">
        <div class="head">
          <UiAvatar :src="a.avatar" :name="a.name" :size="84" />
          <div class="grow">
            <div class="flex items-center gap-2 wrap"><h1>{{ a.name }}</h1><StatusBadge :status="a.status" /></div>
            <p class="muted">{{ a.role }} at {{ a.company }}</p>
            <p class="small muted flex items-center gap-1 mt-1"><MapPin class="ic" /> {{ a.location }}</p>
          </div>
        </div>

        <UiTabs v-model="tab" class="mt-4" :tabs="[{ key: 'profile', label: 'Profile details' }, { key: 'checks', label: 'Verification' }]" />

        <Transition name="fade" mode="out-in">
          <div v-if="tab === 'profile'" key="p" class="grid grid-2 mt-4">
            <div class="stack">
              <div><span class="lbl">Profile summary</span><p>{{ a.summary || '—' }}</p></div>
              <div><span class="lbl">Career path</span><p>{{ a.careerPath }}</p></div>
              <div><span class="lbl">Years of experience</span><p>{{ a.experience }}</p></div>
            </div>
            <div class="stack">
              <div><span class="lbl">Key topics</span><div class="flex wrap gap-1 mt-1"><span v-for="t in a.topics" :key="t" class="tag">{{ t }}</span><span v-if="!a.topics.length" class="muted">—</span></div></div>
              <div><span class="lbl">Biography</span><p>{{ a.bio || '—' }}</p></div>
            </div>
          </div>
          <div v-else key="c" class="mt-4">
            <div class="checks">
              <label v-for="(ok, k) in a.checklist" :key="k" class="check-row" :class="{ ok: a.checklist[k] }">
                <input v-model="a.checklist[k]" type="checkbox" />
                <span>{{ k }}</span>
                <span class="tiny muted">{{ a.checklist[k] ? 'Verified' : 'Missing' }}</span>
              </label>
            </div>
            <p class="small muted mt-3">{{ verified }}/{{ total }} checks complete</p>
            <div class="progress mt-1"><span :style="{ width: total ? (verified / total) * 100 + '%' : 0, background: '#16a34a' }" /></div>
          </div>
        </Transition>
      </div>

      <aside class="stack">
        <div class="card fade-up" style="animation-delay: 0.06s">
          <h3>Review decision</h3>
          <p class="small muted mt-1">Select a decision for this profile.</p>
          <div class="stack-sm mt-4">
            <button class="btn btn-success btn-block" :disabled="a.status === 'approved'" @click="decide('approved')"><Check /> Approve profile</button>
            <button class="btn btn-outline btn-block" :disabled="a.status === 'changes_requested'" @click="decide('changes_requested')"><Pencil /> Request changes</button>
            <button class="btn btn-danger-outline btn-block" :disabled="a.status === 'rejected'" @click="decide('rejected')"><X /> Reject profile</button>
          </div>
          <p v-if="verified < total" class="notice notice-warning small mt-3"><TriangleAlert /> {{ total - verified }} verification item(s) missing</p>
        </div>

        <div class="card fade-up" style="animation-delay: 0.12s">
          <h4>Status flow</h4>
          <ol class="flow">
            <li v-for="s in flow" :key="s.key" :class="{ on: a.status === s.key }">
              <span class="node" />
              <b class="small">{{ s.label }}</b>
              <span class="tiny muted">{{ s.text }}</span>
            </li>
          </ol>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, MapPin, Check, Pencil, X, TriangleAlert } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const toast = useToast()
const a = ref(null)
const tab = ref('profile')

const total = computed(() => Object.keys(a.value?.checklist || {}).length)
const verified = computed(() => Object.values(a.value?.checklist || {}).filter(Boolean).length)

const flow = [
  { key: 'pending', label: 'Pending', text: 'Submitted for review' },
  { key: 'changes_requested', label: 'Changes requested', text: 'Waiting for mentor update' },
  { key: 'approved', label: 'Approved', text: 'Profile visible to students' },
  { key: 'rejected', label: 'Rejected', text: 'Profile not visible' }
]

onMounted(async () => (a.value = await adminApi.getApplication(route.params.id)))

async function decide(status) {
  await adminApi.decideApplication(a.value.id, status)
  a.value.status = status
  const msg = { approved: 'Mentor approved', rejected: 'Mentor rejected', changes_requested: 'Changes requested from mentor' }
  toast.success(msg[status])
}
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
.head { display: flex; gap: 18px; align-items: center; }
.ic { width: 14px; height: 14px; }
.lbl { display: block; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 4px; }
.checks { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.check-row { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; font-weight: 550; cursor: pointer; transition: all 0.2s; }
.check-row span:nth-child(2) { flex: 1; }
.check-row.ok { border-color: #bbf7d0; background: #f0fdf4; }
.flow { list-style: none; margin: 12px 0 0; padding: 0 0 0 22px; position: relative; display: flex; flex-direction: column; gap: 14px; }
.flow::before { content: ''; position: absolute; left: 5px; top: 6px; bottom: 6px; width: 2px; background: var(--border); }
.flow li { position: relative; display: flex; flex-direction: column; opacity: 0.55; transition: opacity 0.3s; }
.flow li.on { opacity: 1; }
.node { position: absolute; left: -22px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2px solid var(--border-strong); transition: all 0.3s; }
.flow li.on .node { background: var(--primary); border-color: var(--primary); animation: pulseRing 1.6s infinite; }
@media (max-width: 1024px) { .layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .checks { grid-template-columns: 1fr; } .head { flex-direction: column; align-items: flex-start; } }
</style>
