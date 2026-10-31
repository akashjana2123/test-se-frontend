<template>
  <span class="badge" :class="cls">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: String })
const map = {
  pending: 'badge-warning', accepted: 'badge-success', approved: 'badge-success', active: 'badge-success', completed: 'badge-success', resolved: 'badge-success',
  declined: 'badge-danger', rejected: 'badge-danger', open: 'badge-danger', cancelled: 'badge-gray', closed: 'badge-gray', inactive: 'badge-gray',
  'under review': 'badge-info', changes_requested: 'badge-info', available: 'badge-success', busy: 'badge-gray'
}
const cls = computed(() => map[(props.status || '').toLowerCase()] || 'badge-gray')
const label = computed(() => {
  const s = (props.status || '').replace('_', ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
})
</script>
