<template>
  <div class="toast-host">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type" @click="dismiss(t.id)">
        <CircleCheck v-if="t.type === 'success'" />
        <CircleAlert v-else-if="t.type === 'error'" />
        <Info v-else />
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CircleCheck, CircleAlert, Info } from '@lucide/vue'
import { toasts, dismiss } from '@/composables/useToast'
</script>

<style scoped>
.toast-host { position: fixed; right: 20px; bottom: 20px; z-index: 100; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
.toast {
  display: flex; align-items: center; gap: 10px;
  min-width: 260px; max-width: 380px;
  padding: 12px 16px; border-radius: 12px;
  background: var(--navy); color: #fff; font-weight: 550; font-size: 13.5px;
  box-shadow: var(--shadow-lg); cursor: pointer;
}
.toast svg { width: 18px; height: 18px; flex-shrink: 0; }
.toast.success svg { color: #4ade80; }
.toast.error svg { color: #f87171; }
.toast.info svg { color: #93c5fd; }
.toast-enter-active, .toast-leave-active { transition: all 0.35s var(--ease); }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.96); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
@media (max-width: 680px) { .toast-host { left: 16px; right: 16px; align-items: stretch; } .toast { max-width: none; } }
</style>
