<template>
  <div class="profile-grid">
    <form class="card stack" @submit.prevent="save">
      <div class="hero-row">
        <div>
          <h1>Let's build your profile</h1>
          <p class="muted mt-1">Tell us about yourself to find the right mentors.</p>
        </div>
      </div>

      <div v-if="!form" class="stack"><div v-for="i in 4" :key="i" class="skeleton" style="height: 60px" /></div>

      <template v-else>
        <!-- Degree type -->
        <div class="field">
          <span class="label">Are you pursuing a single or dual degree?</span>
          <div class="types">
            <button
              v-for="t in degreeTypes" :key="t.value" type="button"
              class="type" :class="{ active: form.degreeType === t.value }"
              @click="form.degreeType = t.value"
            >
              <component :is="t.icon" class="type-ic" />
              <b>{{ t.label }}</b>
              <span class="small muted">{{ t.text }}</span>
              <Check class="tick" />
            </button>
          </div>
        </div>

        <!-- Main degree + level (both options) -->
        <div class="grid grid-3">
          <div class="field span-2">
            <label class="label">{{ isDual ? 'First degree' : 'Degree' }}</label>
            <select v-model="form.degree" class="select">
              <option v-for="d in degreeOptions" :key="d">{{ d }}</option>
            </select>
          </div>
          <div class="field">
            <label class="label">{{ isDual ? 'Level (first degree)' : 'Level' }}</label>
            <select v-model="form.year" class="select">
              <option v-for="y in YEARS" :key="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <!-- Extra fields, dual degree only -->
        <Transition name="fade">
          <div v-if="isDual" class="grid grid-3 second">
            <div class="field span-2">
              <label class="label">Other degree name</label>
              <input v-model.trim="form.otherDegree" class="input" :class="{ invalid: showErr && !form.otherDegree }" placeholder="e.g. B.S. – Data Science and Applications" />
              <span v-if="showErr && !form.otherDegree" class="error-text">Enter the name of your other degree</span>
            </div>
            <div class="field">
              <label class="label">Level (other degree)</label>
              <select v-model="form.otherYear" class="select">
                <option v-for="y in YEARS" :key="y">{{ y }}</option>
              </select>
            </div>
          </div>
        </Transition>


        <ChipPicker v-model="form.skills" label="Key skills" :options="SKILLS" :max="5" />

        <div class="field">
          <span class="label">What is your career goal? <span class="muted">(select one)</span></span>
          <div class="goals">
            <button
              v-for="g in goalOptions" :key="g.label" type="button"
              class="goal" :class="{ active: form.goals.includes(g.label) }"
              role="radio" :aria-checked="form.goals.includes(g.label)"
              @click="selectGoal(g.label)"
            >
              <component :is="g.icon" />
              <span>{{ g.label }}</span>
              <Check class="tick" />
            </button>
            <div class="goal other" :class="{ active: !!form.otherGoal }">
              <Ellipsis />
              <input v-model="form.otherGoal" class="input" placeholder="Other goal..." @input="form.goals = []" />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary btn-lg" :disabled="saving">
            <span v-if="saving" class="spinner" /><template v-else>Save & find mentors <ArrowRight /></template>
          </button>
        </div>
      </template>
    </form>

    <aside class="card side">
      <img :src="ill" alt="" />
      <h3 class="mt-3">Better profile, better matches</h3>
      <ul class="tips">
        <li><CircleCheck /> Pick skills you are confident in</li>
        <li><CircleCheck /> Choose interests you want to explore</li>
        <li><CircleCheck /> Choose one main career goal</li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check, Ellipsis, Briefcase, Building2, GraduationCap, Laptop, Lightbulb, CircleCheck, Layers } from '@lucide/vue'
import ChipPicker from '@/components/ChipPicker.vue'
import { studentApi } from '@/api'
import { SKILLS, DEGREES, YEARS } from '@/mock/db'
import { useToast } from '@/composables/useToast'
import ill from '@/assets/img/signup-ill.jpg'

const router = useRouter()
const toast = useToast()
const form = ref(null)
const saving = ref(false)
const showErr = ref(false)

const degreeTypes = [
  { value: 'single', label: 'Single degree', text: 'One programme', icon: GraduationCap },
  { value: 'dual', label: 'Dual degree', text: 'Two programmes together', icon: Layers }
]

const goalOptions = [
  { label: 'Internships', icon: Briefcase },
  { label: 'Jobs', icon: Building2 },
  { label: 'Higher studies', icon: GraduationCap },
  { label: 'Freelancing', icon: Laptop },
  { label: 'Entrepreneurship', icon: Lightbulb }
]

const isDual = computed(() => form.value?.degreeType === 'dual')

// If a saved degree is not in the predefined list (older data), keep it selectable.
const degreeOptions = computed(() => {
  const cur = form.value?.degree
  return cur && !DEGREES.includes(cur) ? [cur, ...DEGREES] : DEGREES
})

onMounted(async () => {
  const p = await studentApi.getProfile()
  // Only one career goal is allowed: keep the first preset goal, otherwise the custom one.
  const goal = (p.goals || [])[0]
  form.value = {
    degreeType: p.degreeType || 'single',
    degree: p.degree || DEGREES[0],
    year: p.year || YEARS[0],
    otherDegree: p.otherDegree || '',
    otherYear: p.otherYear || YEARS[0],
    institute: p.institute,
    skills: [...p.skills],
    interests: [...(p.interests || [])],
    goals: goal ? [goal] : [],
    otherGoal: goal ? '' : p.otherGoal || ''
  }
})

// Single choice: picking a goal replaces the previous one; clicking it again clears it.
function selectGoal(g) {
  const f = form.value
  f.goals = f.goals.includes(g) ? [] : [g]
  f.otherGoal = ''
}

async function save() {
  showErr.value = false
  if (isDual.value && !form.value.otherDegree) {
    showErr.value = true
    return toast.error('Enter your other degree name')
  }
  if (!form.value.goals.length && !form.value.otherGoal) return toast.error('Select one career goal')

  // single degree: don't send leftover dual-degree values
  const data = { ...form.value }
  if (!isDual.value) Object.assign(data, { otherDegree: '', otherYear: '' })

  saving.value = true
  await studentApi.updateProfile(data)
  saving.value = false
  toast.success('Profile saved')
  router.push({ path: '/student/mentors', query: form.value.goals[0] ? { goal: form.value.goals[0] } : {} })
}
</script>

<style scoped>
.profile-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }

.types { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.type { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 12px; border-radius: 14px; border: 1.5px solid var(--border-strong); background: var(--surface); transition: all 0.3s var(--ease); }
.type:hover { border-color: #e7cc92; transform: translateY(-2px); }
.type.active { border-color: var(--primary); background: var(--primary-50); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.14); }
.type-ic { width: 26px; height: 26px; color: var(--primary); margin-bottom: 2px; transition: transform 0.4s var(--ease); }
.type.active .type-ic { transform: scale(1.12) rotate(-6deg); }
.second { padding: 14px; border-radius: 12px; background: var(--surface-2); }
.invalid { border-color: var(--danger); }

.goals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.goal { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 84px; padding: 12px; border-radius: 12px; border: 1.5px solid var(--border-strong); background: var(--surface); font-weight: 600; font-size: 13px; transition: all 0.25s var(--ease); }
.goal svg { width: 22px; height: 22px; color: var(--text-2); transition: transform 0.3s var(--ease), color 0.2s; }
.goal:hover { border-color: #e7cc92; transform: translateY(-2px); }
.goal.active { border-color: var(--primary); background: var(--primary-50); color: var(--primary-text); }
.goal.active svg { color: var(--primary); transform: scale(1.1); }
.tick { position: absolute; top: 8px; right: 8px; width: 16px !important; height: 16px !important; padding: 2px; border-radius: 50%; background: var(--primary); color: #fff !important; opacity: 0; transform: scale(0.5) !important; transition: all 0.25s var(--ease) !important; }
.goal.active .tick, .type.active .tick { opacity: 1; transform: scale(1) !important; }
.goal.other { cursor: default; }
.goal.other:hover { transform: none; border-color: var(--border-strong); }
.goal.other.active:hover { border-color: var(--primary); }
.goal.other .input { height: 32px; font-size: 12.5px; }
.side { position: sticky; top: 88px; }
.side img { border-radius: 12px; }
.tips { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
.tips li { display: flex; gap: 8px; align-items: center; }
.tips svg { width: 16px; height: 16px; color: var(--primary); flex-shrink: 0; }
@media (max-width: 1024px) { .profile-grid { grid-template-columns: 1fr; } .side { display: none; } }
@media (max-width: 560px) { .goals { grid-template-columns: repeat(2, 1fr); } .second { grid-template-columns: 1fr; } }
</style>