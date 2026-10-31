<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Reported concerns</h1>
        <p>Manage student and mentor reports and take appropriate action.</p>
      </div>
      <select v-model="filter" class="select auto">
        <option value="">All reports</option>
        <option v-for="s in statuses" :key="s">{{ s }}</option>
      </select>
    </div>

    <div v-if="!list.length" class="layout"><div class="skeleton" style="height: 420px" /><div class="skeleton" style="height: 420px" /></div>

    <div v-else class="layout">
      <div class="card list">
        <TransitionGroup name="list">
          <button v-for="c in shown" :key="c.id" class="item" :class="{ active: cur?.id === c.id }" @click="select(c)">
            <span class="icon-box" :class="iconTone(c)"><Flag /></span>
            <div class="grow">
              <b class="small">{{ c.type }}</b>
              <p class="tiny muted">Reported by {{ c.reporterType.toLowerCase() }} · {{ c.reportedOn }}</p>
            </div>
            <StatusBadge :status="c.status" />
          </button>
        </TransitionGroup>
        <EmptyState v-if="!shown.length" title="No reports" />
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="cur" :key="cur.id" class="card detail">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2>{{ cur.type }}</h2>
              <p class="small muted mt-1">Reporter: {{ cur.reporterType }} · Reported on {{ cur.reportedOn }}</p>
            </div>
            <StatusBadge :status="cur.status" />
          </div>

          <div class="ctx mt-4">
            <div class="party"><UiAvatar :name="cur.mentee" :size="36" /><div><span class="tiny muted">Mentee</span><b class="small">{{ cur.mentee }}</b></div></div>
            <ArrowLeftRight class="swap" />
            <div class="party"><UiAvatar :name="cur.mentor" :size="36" /><div><span class="tiny muted">Mentor</span><b class="small">{{ cur.mentor }}</b></div></div>
          </div>

          <div class="mt-4"><span class="lbl">Report details</span><p class="text">{{ cur.details }}</p></div>

          <div class="grid grid-2 mt-4">
            <div class="field">
              <label class="label">Status</label>
              <select v-model="edit.status" class="select"><option v-for="s in statuses" :key="s">{{ s }}</option></select>
            </div>
          </div>
          <div class="field mt-3">
            <label class="label">Administrative notes <span class="muted">(private)</span></label>
            <textarea v-model="edit.notes" class="textarea" rows="3" placeholder="Add notes about actions taken..." />
          </div>

          <div class="mt-4">
            <span class="lbl">Action timeline</span>
            <TransitionGroup tag="ol" name="list" class="tl">
              <li v-for="(t, i) in cur.timeline" :key="t.at + i"><span class="node" /><b class="small">{{ t.at }}</b><span class="small muted">{{ t.text }}</span></li>
            </TransitionGroup>
          </div>

          <div class="flex justify-end mt-4">
            <button class="btn btn-primary" :disabled="saving" @click="save"><span v-if="saving" class="spinner" /><template v-else>Save resolution</template></button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Flag, ArrowLeftRight } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const statuses = ['Open', 'Under review', 'Resolved', 'Closed']
const list = ref([])
const cur = ref(null)
const filter = ref('')
const saving = ref(false)
const edit = reactive({ status: '', notes: '' })
const shown = computed(() => list.value.filter((c) => !filter.value || c.status === filter.value))

onMounted(async () => {
  list.value = await adminApi.getConcerns()
  select(list.value[0])
})

function select(c) {
  cur.value = c
  Object.assign(edit, { status: c.status, notes: c.notes })
}

const iconTone = (c) => ({ Open: 'red', 'Under review': 'blue' })[c.status] || 'gray'

async function save() {
  saving.value = true
  const updated = await adminApi.updateConcern(cur.value.id, { ...edit })
  Object.assign(cur.value, updated)
  saving.value = false
  toast.success('Resolution saved')
}
</script>

<style scoped>
.auto { width: auto; }
.layout { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }
.list { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px; border: 1px solid transparent; border-radius: 12px; background: none; text-align: left; transition: all 0.2s var(--ease); }
.item:hover { background: var(--surface-2); }
.item.active { background: var(--primary-50); border-color: var(--primary-100); }
.item .icon-box { width: 34px; height: 34px; }
.item .icon-box svg { width: 16px; height: 16px; }
.icon-box.red { background: var(--danger-bg); color: var(--danger); }
.icon-box.blue { background: var(--info-bg); color: var(--info); }
.icon-box.gray { background: var(--surface-2); color: var(--muted); }
.ctx { display: flex; align-items: center; gap: 16px; padding: 14px; border-radius: 12px; background: var(--surface-2); flex-wrap: wrap; }
.party { display: flex; align-items: center; gap: 10px; }
.party div { display: flex; flex-direction: column; }
.swap { width: 18px; height: 18px; color: var(--muted); }
.lbl { display: block; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 6px; }
.text { font-size: 13.5px; color: var(--text-2); }
.tl { list-style: none; margin: 4px 0 0; padding: 0 0 0 20px; position: relative; display: flex; flex-direction: column; gap: 10px; }
.tl::before { content: ''; position: absolute; left: 4px; top: 6px; bottom: 6px; width: 2px; background: var(--border); }
.tl li { position: relative; display: flex; flex-direction: column; }
.node { position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 3px #fff; }
@media (max-width: 1024px) { .layout { grid-template-columns: 1fr; } }
</style>
