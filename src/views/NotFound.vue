<template>
  <div class="nf">
    <h1 class="code">404</h1>
    <h2>Page not found</h2>
    <p class="muted">The page you are looking for does not exist.</p>
    <div class="actions mt-4">
      <RouterLink to="/" class="btn btn-primary">Go home</RouterLink>
      <button v-if="auth.isLoggedIn" type="button" class="btn btn-outline" @click="logout"><LogOut /> Log out</button>
    </div>
    <p v-if="auth.isLoggedIn" class="tiny muted">Signed in as {{ auth.user.name }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nf { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 24px; }
.code { font-size: 6rem; font-weight: 800; background: linear-gradient(90deg, #8f6a1e, #d5a64a); -webkit-background-clip: text; background-clip: text; color: transparent; animation: float 4s ease-in-out infinite; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
</style>
