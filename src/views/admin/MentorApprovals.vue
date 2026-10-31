<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Review mentor applications</h1>
        <p>Only approved mentors are visible to students.</p>
      </div>
      <UiTabs v-model="tab" :tabs="tabs" />
    </div>

    <div class="card">
      <div class="toolbar">
        <div class="input-icon search"><Search /><input v-model="q" class="input" placeholder="Search by name, role or expertise..." /></div>
      </div>

      <div v-if="loading" class="stack-sm mt-3"><div v-for="i in 3" :key="i" class="skeleton" style="height: 56px" /></div>
      <div v-else class="table-wrap mt-3">
        <table class="table">
          <thead><tr><th>Mentor</th><th>Career path</th><th>Expertise</th><th>Submitted</th><th>Status</th><th class="right">Actions</th></tr></thead>
          <TransitionGroup tag="tbody" name="row">
            <tr v-for="a in shown" :key="a.id">
              <td>
                <div class="flex items-center gap-3">
                  <UiAvatar :src="a.avatar" :name="a.name" :size="38" />
                  <div><b>{{ a.name }}</b><p class="tiny muted">{{ a.role }} at {{ a.company }}</p></div>
                </div>
              </td>
              <td>{{ a.careerPath }}</td>
              <td><div class="flex wrap gap-1"><span v-for="e in a.expertise" :key="e" class="tag">{{ e }}</span></div></td>
              <td class="muted">{{ a.submitted }}</td>
              <td><StatusBadge :status="a.status" /></td>
              <td class="right">
                <div class="flex gap-2 justify-end">
                  <RouterLink :to="`/admin/mentors/${a.id}`" class="btn btn-outline btn-sm">Review</RouterLink>
                  <template v-if="a.status === 'pending'">
                    <button class="btn btn-success btn-sm" @click="decide(a, 'approved')">Approve</button>
                    <button class="btn btn-danger-outline btn-sm" @click="decide(a, 'rejected')">Reject</button>
                  </template>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
        <EmptyState v-if="!shown.length" :title="`No ${tab} applications`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@lucide/vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { adminApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const tab = ref('pending')
const q = ref('')
const list = ref([])
const loading = ref(true)

const count = (s) => list.value.filter((a) => a.status === s).length
const tabs = computed(() => [
  { key: 'pending', label: 'Pending', count: count('pending') },
  { key: 'approved', label: 'Approved', count: count('approved') },
  { key: 'rejected', label: 'Rejected', count: count('rejected') }
])
const shown = computed(() => list.value.filter((a) =>
  a.status === tab.value && [a.name, a.role, a.careerPath, ...a.expertise].join(' ').toLowerCase().includes(q.value.toLowerCase())))

onMounted(async () => {
  list.value = await adminApi.getApplications()
  loading.value = false
})

async function decide(a, status) {
  await adminApi.decideApplication(a.id, status)
  a.status = status
  toast.success(`${a.name} ${status === 'approved' ? 'approved and now visible to students' : 'rejected'}`)
}
</script>

<style scoped>
.toolbar { display: flex; gap: 10px; }
.search { width: 100%; max-width: 360px; }
.right { text-align: right; }
.row-enter-active, .row-leave-active { transition: all 0.35s var(--ease); }
.row-enter-from { opacity: 0; transform: translateY(8px); }
.row-leave-to { opacity: 0; transform: translateX(24px); }
</style>
