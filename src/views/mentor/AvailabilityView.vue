<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Set your availability</h1>
        <p>Let students know when you're available for sessions.</p>
      </div>
      <button class="btn btn-primary" :disabled="!a || saving" @click="save"><span v-if="saving" class="spinner" /><template v-else>Save changes</template></button>
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
            <div class="progress mt-2"><span :style="{ width: (a.filled / a.maxMentees) * 100 + '%', background: '#14b8a6' }" /></div>
            <span class="tiny muted">{{ a.maxMentees - a.filled }} space(s) left</span>
          </div>
        </div>
      </div>

      <div class="notice"><Info /> New requests stop automatically when your capacity is reached.</div>

      <div class="card fade-up" style="animation-delay: 0.12s">
        <div class="card-head">
          <h3>Weekly availability</h3>
          <span class="small muted">{{ a.slots.length }} slots selected · IST</span>
        </div>
        <div class="table-wrap">
          <table class="grid-table">
            <thead><tr><th /><th v-for="d in a.days" :key="d">{{ d }}</th></tr></thead>
            <tbody>
              <tr v-for="(t, ti) in a.times" :key="t">
                <td class="time">{{ t }}</td>
                <td v-for="(d, di) in a.days" :key="d">
                  <button class="cell" :class="{ on: a.slots.includes(`${ti}-${di}`) }" :aria-label="`${d} ${t}`" @click="toggle(ti, di)"><Check /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Minus, Plus, Users, Info, Check } from '@lucide/vue'
import UiToggle from '@/components/ui/UiToggle.vue'
import { mentorApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const a = ref(null)
const saving = ref(false)

onMounted(async () => (a.value = await mentorApi.getAvailability()))

function toggle(ti, di) {
  const key = `${ti}-${di}`
  const i = a.value.slots.indexOf(key)
  i > -1 ? a.value.slots.splice(i, 1) : a.value.slots.push(key)
}

async function save() {
  saving.value = true
  const { available, maxMentees, slots } = a.value
  await mentorApi.updateAvailability({ available, maxMentees, slots })
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
.grid-table { width: 100%; border-collapse: separate; border-spacing: 6px; min-width: 560px; }
.grid-table th { font-size: 12px; color: var(--muted); font-weight: 650; }
.time { font-size: 12.5px; color: var(--text-2); white-space: nowrap; font-weight: 550; padding-right: 8px; }
.cell { width: 100%; height: 38px; border-radius: 10px; border: 1.5px dashed var(--border-strong); background: var(--surface); display: grid; place-items: center; transition: all 0.25s var(--ease); }
.cell svg { width: 16px; height: 16px; color: #fff; opacity: 0; transform: scale(0.4); transition: all 0.25s var(--ease); stroke-width: 3; }
.cell:hover { border-color: var(--primary); background: var(--primary-50); }
.cell.on { background: var(--primary); border: 1.5px solid var(--primary); }
.cell.on svg { opacity: 1; transform: scale(1); }
@media (max-width: 600px) { .cap { flex-direction: column; align-items: stretch; } }
</style>
