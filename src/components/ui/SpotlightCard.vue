<template>
  <div class="spot card" @mousemove="move" :style="{ '--x': x + 'px', '--y': y + 'px' }">
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const x = ref(-200)
const y = ref(-200)
function move(e) {
  const r = e.currentTarget.getBoundingClientRect()
  x.value = e.clientX - r.left
  y.value = e.clientY - r.top
}
</script>

<style scoped>
.spot { position: relative; overflow: hidden; transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s; }
.spot::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.3s;
  background: radial-gradient(260px circle at var(--x) var(--y), rgba(79, 70, 229, 0.09), transparent 70%);
}
.spot:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: #cfd0f5; }
.spot:hover::before { opacity: 1; }
.spot > * { position: relative; }
</style>
