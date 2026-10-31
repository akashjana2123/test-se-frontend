<template>
  <div class="auth-page">
    <div class="auth-card">
      <aside class="panel">
        <AppLogo />
        <h2 class="fade-up">A more supportive<br />next step.</h2>
        <p class="muted mt-3">Join a community of students and mentors working together for brighter futures.</p>
        <img :src="ill" alt="" class="ill" />
      </aside>

      <section class="form-side">
        <form class="form-inner stagger" novalidate @submit.prevent="submit">
          <div>
            <h1>Create your account</h1>
            <p class="muted mt-1">Let's get you started with MentorConnect.</p>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="label" for="name">Full name</label>
              <div class="input-icon"><User /><input id="name" v-model.trim="form.name" class="input" placeholder="Your full name" /></div>
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>
            <div class="field">
              <label class="label" for="email">Email address</label>
              <div class="input-icon"><Mail /><input id="email" v-model.trim="form.email" class="input" type="email" placeholder="you@example.com" /></div>
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>
            <div class="field">
              <label class="label" for="pw">Password</label>
              <div class="input-icon"><Lock /><input id="pw" v-model="form.password" class="input" type="password" placeholder="Create a password" /></div>
              <div class="strength"><span v-for="i in 4" :key="i" :class="{ on: strength >= i }" /></div>
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            </div>
            <div class="field">
              <label class="label" for="cpw">Confirm password</label>
              <div class="input-icon"><Lock /><input id="cpw" v-model="form.confirm" class="input" type="password" placeholder="Confirm your password" /></div>
              <span v-if="errors.confirm" class="error-text">{{ errors.confirm }}</span>
            </div>
          </div>

          <div class="field">
            <span class="label">I am joining as</span>
            <div class="roles">
              <button v-for="r in roles" :key="r.value" type="button" class="role" :class="{ active: form.role === r.value }" @click="form.role = r.value">
                <span class="radio" />
                <component :is="r.icon" class="role-ic" />
                <b>{{ r.label }}</b>
                <span class="small muted">{{ r.text }}</span>
              </button>
            </div>
          </div>

          <label class="flex items-center gap-2 small">
            <input v-model="form.terms" type="checkbox" /> I agree to the <a href="#" @click.prevent>Terms of Service</a> and <a href="#" @click.prevent>Privacy Policy</a>.
          </label>
          <span v-if="errors.terms" class="error-text">{{ errors.terms }}</span>

          <button class="btn btn-primary btn-lg btn-block" :disabled="loading">
            <span v-if="loading" class="spinner" /><template v-else>Continue <ArrowRight /></template>
          </button>
          <p class="center small muted">Already have an account? <RouterLink to="/login" class="bold">Sign in</RouterLink></p>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Mail, Lock, ArrowRight, GraduationCap, Users } from '@lucide/vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ill from '@/assets/img/signup-ill.jpg'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const roles = [
  { value: 'student', label: 'Student', text: 'Seek guidance and grow', icon: GraduationCap },
  { value: 'mentor', label: 'Mentor / alumnus', text: 'Share your experience', icon: Users }
]

const form = reactive({ name: '', email: '', password: '', confirm: '', role: route.query.role === 'mentor' ? 'mentor' : 'student', terms: false })
const errors = reactive({})
const loading = ref(false)

const strength = computed(() => {
  const p = form.password
  return [p.length >= 6, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name) errors.name = 'Name is required'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'
  if (form.password.length < 6) errors.password = 'At least 6 characters'
  if (form.confirm !== form.password) errors.confirm = 'Passwords do not match'
  if (!form.terms) errors.terms = 'Please accept the terms'
  return !Object.keys(errors).length
}

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    await auth.register({ name: form.name, email: form.email, password: form.password, role: form.role })
    toast.success('Account created. Welcome!')
    router.push(auth.home)
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 85% 10%, #e0e3ff, transparent 40%), radial-gradient(circle at 10% 90%, #ccfbf1, transparent 35%), var(--bg); }
.auth-card { width: 100%; max-width: 1080px; display: grid; grid-template-columns: 0.85fr 1.15fr; background: var(--surface); border-radius: 26px; overflow: hidden; box-shadow: var(--shadow-lg); animation: pop 0.6s var(--ease); }
.panel { display: flex; flex-direction: column; padding: 36px 36px 0; background: #ecebfc; overflow: hidden; }
.panel h2 { font-size: 2rem; font-weight: 800; margin-top: 30px; }
.ill { margin-top: auto; width: calc(100% + 72px); margin-left: -36px; max-width: none; -webkit-mask-image: linear-gradient(to bottom, transparent, #000 15%); mask-image: linear-gradient(to bottom, transparent, #000 15%); }
.form-side { padding: 40px 44px; }
.form-inner { display: flex; flex-direction: column; gap: 18px; }
.strength { display: flex; gap: 4px; }
.strength span { flex: 1; height: 4px; border-radius: 4px; background: var(--surface-2); transition: background 0.3s; }
.strength span.on:nth-child(1) { background: #ef4444; }
.strength span.on:nth-child(2) { background: #f59e0b; }
.strength span.on:nth-child(3) { background: #22c55e; }
.strength span.on:nth-child(4) { background: #16a34a; }
.roles { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.role { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 12px; border-radius: 14px; border: 1.5px solid var(--border-strong); background: var(--surface); transition: all 0.3s var(--ease); }
.role:hover { border-color: #a5a6f6; transform: translateY(-2px); }
.role.active { border-color: var(--primary); background: var(--primary-50); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08); }
.role-ic { width: 30px; height: 30px; color: var(--primary); margin-bottom: 4px; transition: transform 0.4s var(--ease); }
.role.active .role-ic { transform: scale(1.12) rotate(-6deg); }
.radio { position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border-strong); transition: all 0.25s; }
.role.active .radio { border-color: var(--primary); box-shadow: inset 0 0 0 3px #fff; background: var(--primary); }

@media (max-width: 860px) {
  .auth-card { grid-template-columns: 1fr; }
  .panel { display: none; }
  .form-side { padding: 28px 22px; }
}
</style>
