<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Set your availability</h1>
        <p>Let students know when you're available for sessions.</p>
      </div>
      <button class="btn btn-primary" :disabled="!a || saving || hasErrors" @click="save"><span v-if="saving" class="spinner" /><template v-else>Save changes</template></button>
    </div>

    <div v-if="!a" class="skeleton" style="height: 480px" />

    <div v-else class="stack">
      <div class="grid grid-2">
        <div class="card toggle-card fade-up">
          <div class="grow">
            <h4>Available for mentoring</h4>
            <p class="small muted">You will receive new requests from students.</p>
          </div>
          <UiToggle v-model="a.available" />
        </div>

        <div class="card cap fade-up" style="animation-delay: 0.06s">
          <div class="grow">
            <h4>Maximum active mentees</h4>
            <div class="stepper mt-2">
              <button class="btn btn-outline btn-icon btn-sm" :disabled="a.maxMentees <= Math.max(1, a.filled)" aria-label="Decrease" @click="a.maxMentees--"><Minus /></button>
              <Transition name="num" mode="out-in"><b :key="a.maxMentees">{{ a.maxMentees }}</b></Transition>
              <button class="btn btn-outline btn-icon btn-sm" :disabled="a.maxMentees >= 10" aria-label="Increase" @click="a.maxMentees++"><Plus /></button>
            </div>
          </div>
          <div class="filled">
            <span class="small bold"><Users /> {{ a.filled }} of {{ a.maxMentees }} filled</span>
            <div class="progress mt-2"><span :style="{ width: (a.filled / a.maxMentees) * 100 + '%', background: '#d5a64a' }" /></div>
            <span class="tiny muted">{{ a.maxMentees - a.filled }} space(s) left</span>
          </div>
        </div>
      </div>

      <div class="notice"><Info /> New requests stop automatically when your capacity is reached.</div>

      <div class="card fade-up" style="animation-delay: 0.12s">
        <div class="card-head week-head">
          <div>
            <h3><Clock class="head-ic" /> Weekly availability</h3>
            <p class="small muted">Set your available days and mentoring hours for each day of the week</p>
          </div>
          <span class="small muted">{{ activeDays }} day(s) · {{ totalHours }} hrs/week · {{ a.timezone || 'IST' }}</span>
        </div>

        <div class="week">
          <div v-for="d in a.schedule" :key="d.day" class="day-row" :class="{ off: !d.enabled }">
            <div class="day-name">
              <UiToggle v-model="d.enabled" :aria-label="`Toggle ${d.day}`" />
              <b>{{ d.day }}</b>
            </div>

            <div v-if="d.enabled" class="ranges">
              <TransitionGroup name="list">
                <div v-for="(r, ri) in d.ranges" :key="r._k" class="range-wrap">
                  <div class="range">
                    <label class="tl">From:</label>
                    <input v-model="r.start" type="time" step="900" class="input time-in" :class="{ bad: r.error }" :aria-label="`${d.day} start time`" @change="validate(d)" />
                    <span class="dash">–</span>
                    <label class="tl">To:</label>
                    <input v-model="r.end" type="time" step="900" class="input time-in" :class="{ bad: r.error }" :aria-label="`${d.day} end time`" @change="validate(d)" />
                    <button v-if="ri === 0" type="button" class="btn btn-ghost btn-icon btn-sm" :aria-label="`Add time range on ${d.day}`" @click="addRange(d)"><Plus /></button>
                    <button v-else type="button" class="btn btn-ghost btn-icon btn-sm del" :aria-label="`Remove time range on ${d.day}`" @click="removeRange(d, ri)"><Trash2 /></button>
                  </div>
                  <span v-if="r.error" class="tiny err">{{ r.error }}</span>
                </div>
              </TransitionGroup>
            </div>
            <span v-else class="small muted unavailable">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Minus, Plus, Users, Info, Clock, Trash2 } from '@lucide/vue'
import UiToggle from '@/components/ui/UiToggle.vue'
import { mentorApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const a = ref(null)
const saving = ref(false)
let k = 0

onMounted(async () => {
  const data = await mentorApi.getAvailability()
  a.value = {
    ...data,
    // deep copy so edits don't touch the store until saved; _k is a local render key
    schedule: (data.schedule || []).map((d) => ({
      ...d,
      ranges: (d.ranges?.length ? d.ranges : [{ start: '09:00', end: '17:00' }]).map((r) => ({ ...r, _k: ++k, error: '' }))
    }))
  }
  a.value.schedule.forEach(validate)
})

const toMin = (t) => { const [h, m] = (t || '').split(':').map(Number); return h * 60 + m }
const toTime = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const enabledDays = computed(() => a.value?.schedule.filter((d) => d.enabled) || [])
const activeDays = computed(() => enabledDays.value.length)
const totalHours = computed(() => {
  const mins = enabledDays.value.reduce((sum, d) => sum + d.ranges.reduce((s, r) => s + Math.max(0, toMin(r.end) - toMin(r.start)), 0), 0)
  return +(mins / 60).toFixed(1)
})
const hasErrors = computed(() => enabledDays.value.some((d) => d.ranges.some((r) => r.error)))

function validate(d) {
  d.ranges.forEach((r) => {
    if (!r.start || !r.end) r.error = 'Enter both start and end time'
    else if (toMin(r.end) <= toMin(r.start)) r.error = 'End time must be after start time'
    else r.error = ''
  })
  // flag overlaps between ranges on the same day
  const sorted = d.ranges.filter((r) => !r.error).sort((x, y) => toMin(x.start) - toMin(y.start))
  for (let i = 1; i < sorted.length; i++) {
    if (toMin(sorted[i].start) < toMin(sorted[i - 1].end)) sorted[i].error = `Overlaps with ${sorted[i - 1].start} – ${sorted[i - 1].end}`
  }
}

function addRange(d) {
  // start new range 1h after the latest end on that day (fallback 09:00), 1h long
  const lastEnd = Math.max(...d.ranges.map((r) => toMin(r.end) || 0), 8 * 60)
  const start = Math.min(lastEnd + 60, 22 * 60)
  d.ranges.push({ start: toTime(start), end: toTime(Math.min(start + 60, 23 * 60 + 45)), _k: ++k, error: '' })
  validate(d)
}

function removeRange(d, i) {
  d.ranges.splice(i, 1)
  validate(d)
}

async function save() {
  if (hasErrors.value) return toast.error('Fix the highlighted time ranges first')
  saving.value = true
  const { available, maxMentees, timezone } = a.value
  const schedule = a.value.schedule.map(({ day, enabled, ranges }) => ({
    day,
    enabled,
    ranges: ranges.map(({ start, end }) => ({ start, end })).sort((x, y) => toMin(x.start) - toMin(y.start))
  }))
  await mentorApi.updateAvailability({ available, maxMentees, timezone, schedule })
  saving.value = false
  toast.success('Availability saved')
}
</script>

<style scoped>
.toggle-card, .cap { display: flex; align-items: center; gap: 18px; }
.stepper { display: flex; align-items: center; gap: 14px; }
.stepper b { font-size: 1.4rem; min-width: 22px; text-align: center; display: inline-block; }
.filled { min-width: 170px; display: flex; flex-direction: column; gap: 2px; }
.filled span.bold { display: flex; align-items: center; gap: 6px; }
.filled svg { width: 15px; height: 15px; color: var(--primary); }
.num-enter-active, .num-leave-active { transition: all 0.2s var(--ease); }
.num-enter-from { opacity: 0; transform: translateY(-8px); }
.num-leave-to { opacity: 0; transform: translateY(8px); }
.week-head { align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.week-head h3 { display: flex; align-items: center; gap: 8px; }
.head-ic { width: 20px; height: 20px; color: var(--primary); }
.week { display: flex; flex-direction: column; }
.day-row { display: flex; align-items: flex-start; gap: 20px; padding: 14px 0; border-top: 1px solid var(--border); }
.day-row:first-child { border-top: 0; }
.day-name { display: flex; align-items: center; gap: 14px; width: 170px; flex-shrink: 0; height: 40px; }
.day-name b { font-weight: 650; color: var(--text); transition: color 0.2s; }
.day-row.off .day-name b { color: var(--muted); }
.unavailable { height: 40px; display: flex; align-items: center; font-style: italic; }
.ranges { display: flex; flex-direction: column; gap: 10px; }
.range-wrap { display: flex; flex-direction: column; gap: 4px; }
.range { display: flex; align-items: center; gap: 10px; }
.tl { font-size: 13px; font-weight: 600; color: var(--muted); }
.dash { color: var(--muted); margin: 0 2px; }
.time-in { width: 130px; height: 40px; font-variant-numeric: tabular-nums; }
.time-in.bad { border-color: var(--danger); background: var(--danger-bg); }
.time-in::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.7; }
.del { color: var(--danger); }
.del:hover { background: var(--danger-bg); }
.err { color: var(--danger); padding-left: 48px; }
@media (max-width: 600px) { .cap { flex-direction: column; align-items: stretch; } }
@media (max-width: 760px) {
  .day-row { flex-direction: column; gap: 10px; }
  .day-name { width: auto; }
  .range { flex-wrap: wrap; gap: 6px; }
  .time-in { width: 112px; }
  .err { padding-left: 0; }
}
</style>
