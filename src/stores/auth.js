import { defineStore } from 'pinia'
import { authApi } from '@/api'
import { storage } from '@/api/client'

const HOME = { student: '/student', mentor: '/mentor', admin: '/admin' }

function savedUser() {
  try { return JSON.parse(storage.get('mc_user') || 'null') } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: savedUser(), token: storage.get('mc_token') }),
  getters: {
    isLoggedIn: (s) => !!s.token && !!s.user,
    role: (s) => s.user?.role,
    home: (s) => HOME[s.user?.role] || '/login'
  },
  actions: {
    setSession({ token, user }) {
      this.token = token
      this.user = user
      storage.set('mc_token', token)
      storage.set('mc_user', JSON.stringify(user))
    },
    async login(email, password) {
      this.setSession(await authApi.login({ email, password }))
    },
    async register(payload) {
      this.setSession(await authApi.register(payload))
    },
    updateUser(patch) {
      this.user = { ...this.user, ...patch }
      storage.set('mc_user', JSON.stringify(this.user))
    },
    logout() {
      this.token = null
      this.user = null
      storage.remove('mc_token')
      storage.remove('mc_user')
    }
  }
})
