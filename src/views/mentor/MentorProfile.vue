<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Build your mentor profile</h1>
        <p>Help students know your background and expertise.</p>
      </div>
      <span class="notice small"><Sparkles /> A complete profile gets more relevant requests.</span>
    </div>

    <div v-if="!form" class="skeleton" style="height: 520px" />

    <form v-else class="card stack" @submit.prevent="save">
      <div class="top">
        <div class="photo-col">
          <UiAvatar :src="form.avatar" :name="form.name" :size="104" />
          <label class="btn btn-soft btn-sm">
            <Camera /> Change photo
            <input type="file" accept="image/*" hidden @change="pickPhoto" />
          </label>
        </div>
        <div class="grid grid-2 grow">
          <div class="field"><label class="label">Full name</label><input v-model="form.name" class="input" /></div>
          <div class="field"><label class="label">Current role</label><input v-model="form.title" class="input" /></div>
          <div class="field"><label class="label">Company</label><input v-model="form.company" class="input" /></div>
          <div class="field">
            <label class="label">Years of experience</label>
            <select v-model="form.experience" class="select"><option>1-2 years</option><option>3-5 years</option><option>6+ years</option><option>10+ years</option></select>
          </div>
        </div>
      </div>

      <div class="field">
        <span class="label">Career path</span>
        <div class="path">
          <TransitionGroup name="list">
            <div v-for="(c, i) in form.careerPath" :key="c._k" class="path-item">
              <span class="node" />
              <input v-model="c.title" class="input sm" placeholder="Role / degree" />
              <input v-model="c.org" class="input sm" placeholder="Organisation" />
              <input v-model="c.period" class="input sm" placeholder="2018 – 2021" />
              <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Remove" @click="form.careerPath.splice(i, 1)"><Trash2 /></button>
            </div>
          </TransitionGroup>
          <button type="button" class="link-btn small" @click="addStep"><Plus /> Add step</button>
        </div>
      </div>

      <div class="field">
        <label class="label">About you</label>
        <textarea v-model="form.about" class="textarea" maxlength="300" rows="4" />
        <span class="tiny muted" style="text-align: right">{{ form.about.length }}/300</span>
      </div>

      <div class="field">
        <span class="label">Skills & expertise</span>
        <div class="flex wrap gap-2">
          <TransitionGroup name="list">
            <span v-for="(s, i) in form.skills" :key="s" class="chip active">{{ s }} <X class="x" @click="form.skills.splice(i, 1)" /></span>
          </TransitionGroup>
          <div class="add-skill">
            <input v-model="newSkill" class="input sm" placeholder="Add skill" @keydown.enter.prevent="addSkill" />
            <button type="button" class="btn btn-outline btn-sm btn-icon" aria-label="Add skill" @click="addSkill"><Plus /></button>
          </div>
        </div>
      </div>

      <div class="field">
        <span class="label">Mentoring topics <span class="muted">(select all that apply)</span></span>
        <div class="flex wrap gap-2">
          <label v-for="t in topics" :key="t" class="chip" :class="{ active: form.topics.includes(t) }">
            <input v-model="form.topics" type="checkbox" :value="t" hidden />
            <Check v-if="form.topics.includes(t)" /> {{ t }}
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Other topic <span class="muted">(optional)</span></label>
        <input v-model="form.otherTopic" class="input" placeholder="e.g. Personal branding, Design..." />
      </div>

      <div class="flex justify-end">
        <button class="btn btn-primary btn-lg" :disabled="saving"><span v-if="saving" class="spinner" /><template v-else>Save profile</template></button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sparkles, Camera, Trash2, Plus, X, Check } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import { mentorApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const toast = useToast()
const form = ref(null)
const saving = ref(false)
const newSkill = ref('')
const topics = ['Higher studies', 'Jobs', 'Internships', 'Entrepreneurship', 'Freelancing']
let k = 0

onMounted(async () => {
  const p = await mentorApi.getProfile()
  form.value = {
    ...p,
    about: p.about || '',
    skills: [...(p.skills || [])],
    topics: [...(p.topics || [])],
    careerPath: (p.careerPath || []).map((c) => ({ ...c, _k: ++k }))
  }
})

function addStep() { form.value.careerPath.push({ title: '', org: '', period: '', _k: ++k }) }
function addSkill() {
  const s = newSkill.value.trim()
  if (s && !form.value.skills.includes(s)) form.value.skills.push(s)
  newSkill.value = ''
}
function pickPhoto(e) {
  const file = e.target.files?.[0]
  if (file) form.value.avatar = URL.createObjectURL(file) // preview only; upload when backend is ready
}

async function save() {
  saving.value = true
  const data = { ...form.value, careerPath: form.value.careerPath.map(({ _k, ...c }) => c) }
  await mentorApi.updateProfile(data)
  auth.updateUser({ name: data.name, avatar: data.avatar })
  saving.value = false
  toast.success('Profile saved')
}
</script>

<style scoped>
.top { display: flex; gap: 28px; align-items: flex-start; }
.photo-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.path { display: flex; flex-direction: column; gap: 10px; padding-left: 22px; border-left: 2px solid var(--primary-100); margin-left: 6px; }
.path-item { position: relative; display: grid; grid-template-columns: 1.2fr 1.2fr 0.9fr auto; gap: 8px; align-items: center; }
.node { position: absolute; left: -30px; width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid var(--primary); }
.input.sm { height: 36px; font-size: 13px; }
.x { width: 14px; height: 14px; cursor: pointer; }
.add-skill { display: flex; gap: 6px; }
.add-skill .input { width: 140px; }
label.chip { cursor: pointer; }
@media (max-width: 760px) {
  .top { flex-direction: column; align-items: stretch; }
  .path-item { grid-template-columns: 1fr 1fr; }
}
</style>
