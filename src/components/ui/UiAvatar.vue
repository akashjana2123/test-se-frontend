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

const palette = [['#eef0ff', '#4f46e5'], ['#e7faf6', '#0f766e'], ['#fff1e6', '#c2410c'], ['#fdf2f8', '#be185d'], ['#eff6ff', '#1d4ed8'], ['#f5f3ff', '#6d28d9']]
const initials = computed(() => props.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase())
const style = computed(() => {
  const [bg, fg] = palette[props.name.length % palette.length]
  return { width: props.size + 'px', height: props.size + 'px', fontSize: props.size * 0.36 + 'px', background: bg, color: fg }
})
</script>

<style scoped>
.avatar { position: relative; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; font-weight: 700; }
.avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.online { position: absolute; right: 0; bottom: 0; width: 28%; height: 28%; min-width: 9px; min-height: 9px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; }
</style>
