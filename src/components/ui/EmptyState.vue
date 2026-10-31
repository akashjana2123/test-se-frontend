<template>
  <div class="empty">
    <div class="icon-box"><component :is="icon || Inbox" /></div>
    <h4>{{ title }}</h4>
    <p v-if="text" class="muted small">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup>
import { Inbox } from '@lucide/vue'
defineProps({ title: String, text: String, icon: [Object, Function] })
</script>

<style scoped>
.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 16px; text-align: center; animation: fadeUp 0.5s var(--ease); }
.empty .icon-box { width: 48px; height: 48px; border-radius: 14px; margin-bottom: 4px; }
</style>
