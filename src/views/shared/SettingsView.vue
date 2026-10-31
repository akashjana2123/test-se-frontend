<template>
  <div class="narrow">
    <div class="page-head">
      <div>
        <h1>Settings</h1>
        <p>Manage your account and notifications.</p>
      </div>
    </div>

    <div class="stack">
      <form class="card stack" @submit.prevent="saveAccount">
        <h3>Account</h3>
        <div class="flex items-center gap-4">
          <UiAvatar :src="auth.user?.avatar" :name="form.name" :size="60" />
          <div><b>{{ form.name }}</b><p class="small muted">{{ roleLabel }}</p></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label class="label">Full name</label><input v-model="form.name" class="input" /></div>
          <div class="field"><label class="label">Email</label><input v-model="form.email" class="input" type="email" /></div>
        </div>
        <div class="flex justify-end"><button class="btn btn-primary">Save changes</button></div>
      </form>

      <div class="card">
        <h3>Notifications</h3>
        <div class="stack mt-4">
          <div v-for="n in notifs" :key="n.key" class="row">
            <div class="grow"><b class="small">{{ n.label }}</b><p class="tiny muted">{{ n.text }}</p></div>
            <UiToggle v-model="n.on" @update:model-value="toast.success('Preference updated')" />
          </div>
        </div>
      </div>

      <form class="card stack" @submit.prevent="changePw">
        <h3>Change password</h3>
        <div class="grid grid-2">
          <div class="field"><label class="label">Current password</label><input v-model="pw.current" class="input" type="password" /></div>
          <div class="field"><label class="label">New password</label><input v-model="pw.next" class="input" type="password" /></div>
        </div>
        <div class="flex justify-end"><button class="btn btn-outline" :disabled="!pw.current || pw.next.length < 6">Update password</button></div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiToggle from '@/components/ui/UiToggle.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const toast = useToast()
const roleLabel = computed(() => ({ student: 'Student', mentor: 'Mentor', admin: 'Programme Admin' })[auth.role])
const form = reactive({ name: auth.user?.name || '', email: auth.user?.email || '' })
const pw = reactive({ current: '', next: '' })
const notifs = reactive([
  { key: 'email', label: 'Email updates', text: 'Request and session updates by email', on: true },
  { key: 'reminder', label: 'Session reminders', text: 'A reminder 1 hour before each session', on: true },
  { key: 'news', label: 'New resources', text: 'When new guides are published', on: false }
])

function saveAccount() {
  auth.updateUser({ name: form.name, email: form.email })
  toast.success('Account updated')
}
function changePw() {
  pw.current = ''
  pw.next = ''
  toast.success('Password updated')
}
</script>

<style scoped>
.narrow { max-width: 820px; }
.row { display: flex; align-items: center; gap: 16px; }
</style>
