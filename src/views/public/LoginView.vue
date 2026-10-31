<template>
  <div class="auth-page">
    <div class="auth-card">
      <aside class="panel">
        <AppLogo light />
        <h2 class="fade-up">Career guidance,<br />made more personal.</h2>
        <div class="features stagger">
          <span><Users /> Meaningful</span>
          <span><MessageCircle /> Real conversations</span>
          <span><ShieldCheck /> Brighter futures</span>
        </div>
        <img :src="ill" alt="" class="ill" />
      </aside>

      <section class="form-side">
        <div class="form-inner stagger">
          <div>
            <h1>Welcome back</h1>
            <p class="muted mt-1">Sign in to your MentorConnect account.</p>
          </div>

          <form class="stack" @submit.prevent="submit()">
            <div class="field">
              <label class="label" for="email">Email address</label>
              <div class="input-icon"><Mail /><input id="email" v-model.trim="email" class="input" type="email" placeholder="you@example.com" autocomplete="email" /></div>
            </div>
            <div class="field">
              <label class="label" for="pw">Password</label>
              <div class="input-icon">
                <Lock />
                <input id="pw" v-model="password" class="input" :type="show ? 'text' : 'password'" placeholder="Enter your password" autocomplete="current-password" />
                <button type="button" class="input-action" :aria-label="show ? 'Hide password' : 'Show password'" @click="show = !show"><EyeOff v-if="show" /><Eye v-else /></button>
              </div>
            </div>
            <div class="flex items-center justify-between small">
              <label class="flex items-center gap-2"><input v-model="remember" type="checkbox" /> Remember me</label>
              <button type="button" class="link-btn" @click="toast.info('Password reset will work once the backend is connected')">Forgot password?</button>
            </div>
            <p v-if="error" class="error-text">{{ error }}</p>
            <button class="btn btn-primary btn-lg btn-block" :disabled="loading">
              <span v-if="loading" class="spinner" /> <template v-else>Sign in <ArrowRight /></template>
            </button>
          </form>

          <div class="or"><span>or try a demo account</span></div>
          <div class="demo">
            <button v-for="d in demos" :key="d.email" class="demo-btn" :disabled="loading" @click="quick(d.email)">
              <component :is="d.icon" /><span>{{ d.label }}</span>
            </button>
          </div>

          <p class="center small muted">Don't have an account? <RouterLink to="/signup" class="bold">Create one</RouterLink></p>

          <RouterLink to="/" class="explore">
            <span class="icon-box"><Eye /></span>
            <div class="grow"><b>Want to look around first?</b><p class="small muted">Explore the public home page.</p></div>
            <ArrowRight class="arrow" />
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Users, MessageCircle, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, HeartHandshake, LayoutDashboard } from '@lucide/vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ill from '@/assets/img/signin-ill.jpg'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const email = ref('')
const password = ref('')
const remember = ref(true)
const show = ref(false)
const loading = ref(false)
const error = ref('')

const demos = [
  { label: 'Student', email: 'student@demo.com', icon: GraduationCap },
  { label: 'Mentor', email: 'mentor@demo.com', icon: HeartHandshake },
  { label: 'Admin', email: 'admin@demo.com', icon: LayoutDashboard }
]

async function submit() {
  error.value = ''
  if (!email.value || !password.value) { error.value = 'Please enter email and password'; return }
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    toast.success(`Welcome back, ${auth.user.name.split(' ')[0]}!`)
    router.push(route.query.redirect || auth.home)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function quick(addr) {
  email.value = addr
  password.value = 'demo1234'
  submit()
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 15% 10%, #e0e3ff, transparent 40%), radial-gradient(circle at 90% 90%, #ccfbf1, transparent 35%), var(--bg); }
.auth-card { width: 100%; max-width: 1040px; display: grid; grid-template-columns: 1fr 1fr; background: var(--surface); border-radius: 26px; overflow: hidden; box-shadow: var(--shadow-lg); animation: pop 0.6s var(--ease); }
.panel { position: relative; display: flex; flex-direction: column; padding: 36px 36px 0; background: linear-gradient(160deg, #1b1a5e, #3b2fc9 70%, #4f46e5); color: #fff; overflow: hidden; }
.panel h2 { color: #fff; font-size: 1.9rem; font-weight: 750; margin-top: 30px; }
.features { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 22px; font-size: 13.5px; font-weight: 550; color: #dcdcfb; }
.features span { display: inline-flex; align-items: center; gap: 8px; }
.features svg { width: 30px; height: 30px; padding: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.95); color: #4f46e5; }
.ill { margin-top: auto; width: calc(100% + 72px); margin-left: -36px; max-width: none; -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%); mask-image: linear-gradient(to bottom, transparent, #000 18%); }

.form-side { padding: 44px 48px; display: flex; align-items: center; }
.form-inner { width: 100%; display: flex; flex-direction: column; gap: 20px; }
.or { display: flex; align-items: center; gap: 12px; color: var(--muted); font-size: 12px; }
.or::before, .or::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.demo { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.demo-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--surface); font-size: 12.5px; font-weight: 650; transition: all 0.25s var(--ease); }
.demo-btn svg { width: 20px; height: 20px; color: var(--primary); transition: transform 0.3s var(--ease); }
.demo-btn:hover { border-color: var(--primary); background: var(--primary-50); transform: translateY(-2px); }
.demo-btn:hover svg { transform: scale(1.15); }
.explore { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 14px; background: var(--primary-50); color: var(--text); transition: background 0.2s; }
.explore:hover { background: var(--primary-100); }
.explore .icon-box { background: #fff; }
.arrow { width: 18px; height: 18px; color: var(--primary); transition: transform 0.25s var(--ease); }
.explore:hover .arrow { transform: translateX(4px); }

@media (max-width: 860px) {
  .auth-card { grid-template-columns: 1fr; }
  .panel { display: none; }
  .form-side { padding: 32px 24px; }
}
</style>
