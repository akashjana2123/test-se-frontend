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
        <div class="grid grid-3">
          <div class="field span-2">
            <label class="label">Academic background</label>
            <select v-model="form.degree" class="select">
              <option>B.Tech – Computer Science and Engineering</option>
              <option>B.Tech – Electronics and Communication</option>
              <option>B.S. – Data Science and Applications</option>
              <option>B.Com</option>
              <option>BBA</option>
              <option>M.Tech / M.Sc</option>
            </select>
          </div>
          <div class="field">
            <label class="label">Year</label>
            <select v-model="form.year" class="select"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>Final Year</option></select>
          </div>
          <div class="field span-2">
            <label class="label">Institute</label>
            <input v-model="form.institute" class="input" placeholder="Your college / university" />
          </div>
        </div>

        <ChipPicker v-model="form.skills" label="Key skills" :options="SKILLS" :max="5" />
        <ChipPicker v-model="form.interests" label="Areas of interest" :options="INTERESTS" :max="5" />

        <div class="field">
          <span class="label">What are your career goals? <span class="muted">(select up to 2)</span></span>
          <div class="goals">
            <button
              v-for="g in goalOptions" :key="g.label" type="button"
              class="goal" :class="{ active: form.goals.includes(g.label) }"
              @click="toggleGoal(g.label)"
            >
              <component :is="g.icon" />
              <span>{{ g.label }}</span>
              <Check class="tick" />
            </button>
            <div class="goal other">
              <Ellipsis />
              <input v-model="form.otherGoal" class="input" placeholder="Other goal..." />
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
        <li><CircleCheck /> Keep goals focused (max 2)</li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check, Ellipsis, Briefcase, Building2, GraduationCap, Laptop, Lightbulb, CircleCheck } from '@lucide/vue'
import ChipPicker from '@/components/ChipPicker.vue'
import { studentApi } from '@/api'
import { SKILLS, INTERESTS } from '@/mock/db'
import { useToast } from '@/composables/useToast'
import ill from '@/assets/img/signup-ill.jpg'

const router = useRouter()
const toast = useToast()
const form = ref(null)
const saving = ref(false)

const goalOptions = [
  { label: 'Internships', icon: Briefcase },
  { label: 'Jobs', icon: Building2 },
  { label: 'Higher studies', icon: GraduationCap },
  { label: 'Freelancing', icon: Laptop },
  { label: 'Entrepreneurship', icon: Lightbulb }
]

onMounted(async () => {
  const p = await studentApi.getProfile()
  form.value = { degree: p.degree, year: p.year, institute: p.institute, skills: [...p.skills], interests: [...p.interests], goals: [...p.goals], otherGoal: p.otherGoal || '' }
})

function toggleGoal(g) {
  const list = form.value.goals
  if (list.includes(g)) list.splice(list.indexOf(g), 1)
  else if (list.length >= 2) toast.info('You can select up to 2 goals')
  else list.push(g)
}

async function save() {
  if (!form.value.goals.length && !form.value.otherGoal) return toast.error('Select at least one career goal')
  saving.value = true
  await studentApi.updateProfile(form.value)
  saving.value = false
  toast.success('Profile saved')
  router.push({ path: '/student/mentors', query: form.value.goals[0] ? { goal: form.value.goals[0] } : {} })
}
</script>

<style scoped>
.profile-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
.goals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.goal { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 84px; padding: 12px; border-radius: 12px; border: 1.5px solid var(--border-strong); background: var(--surface); font-weight: 600; font-size: 13px; transition: all 0.25s var(--ease); }
.goal svg { width: 22px; height: 22px; color: var(--text-2); transition: transform 0.3s var(--ease), color 0.2s; }
.goal:hover { border-color: #a5a6f6; transform: translateY(-2px); }
.goal.active { border-color: var(--primary); background: var(--primary-50); color: var(--primary); }
.goal.active svg { color: var(--primary); transform: scale(1.1); }
.tick { position: absolute; top: 8px; right: 8px; width: 16px !important; height: 16px !important; padding: 2px; border-radius: 50%; background: var(--primary); color: #fff !important; opacity: 0; transform: scale(0.5) !important; transition: all 0.25s var(--ease) !important; }
.goal.active .tick { opacity: 1; transform: scale(1) !important; }
.goal.other { cursor: default; }
.goal.other:hover { transform: none; border-color: var(--border-strong); }
.goal.other .input { height: 32px; font-size: 12.5px; }
.side { position: sticky; top: 88px; }
.side img { border-radius: 12px; }
.tips { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
.tips li { display: flex; gap: 8px; align-items: center; }
.tips svg { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; }
@media (max-width: 1024px) { .profile-grid { grid-template-columns: 1fr; } .side { display: none; } }
@media (max-width: 560px) { .goals { grid-template-columns: repeat(2, 1fr); } }
</style>
