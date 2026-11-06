<template>
  <div class="avatar" :style="style">
    <img v-if="src" :src="src" :alt="name" loading="lazy" />
    <span v-else>{{ initials }}</span>
    <i v-if="online" class="online" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, default: null },
  name: { type: String, default: '' },
  size: { type: Number, default: 40 },
  online: Boolean
})

const palette = [['#fbf4e6', '#8f6a1e'], ['#f6f0e5', '#4a4438'], ['#f4e5c6', '#7a5a17'], ['#efe8da', '#6b6559'], ['#e6f0ff', '#2563eb'], ['#fbf1dc', '#9a7424']]
const initials = computed(() => props.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase())
const style = computed(() => {
  const [bg, fg] = palette[props.name.length % palette.length]
  return { width: props.size + 'px', height: props.size + 'px', fontSize: props.size * 0.36 + 'px', background: bg, color: fg }
})
</script>

<style scoped>
.avatar { position: relative; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; font-weight: 700; }
.avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.online { position: absolute; right: 0; bottom: 0; width: 28%; height: 28%; min-width: 9px; min-height: 9px; border-radius: 50%; background: var(--success); border: 2px solid #fff; }
</style>
