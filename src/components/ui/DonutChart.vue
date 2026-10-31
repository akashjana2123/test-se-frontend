<template>
  <div class="donut-wrap">
    <div class="donut" :style="{ width: size + 'px', height: size + 'px' }">
      <svg viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9155" class="track" />
        <circle
          v-for="(s, i) in segments"
          :key="s.label"
          cx="21" cy="21" r="15.9155"
          class="seg"
          :stroke="s.color"
          :stroke-dasharray="grown ? `${s.pct} ${100 - s.pct}` : '0 100'"
          :stroke-dashoffset="25 - s.start"
          :style="{ transitionDelay: i * 120 + 'ms' }"
        />
      </svg>
      <div class="center">
        <strong><CountUp :value="total" /></strong>
        <span>{{ caption }}</span>
      </div>
    </div>
    <ul class="legend">
      <li v-for="s in segments" :key="s.label">
        <i :style="{ background: s.color }" />
        <span class="grow">{{ s.label }}</span>
        <b>{{ s.value }}</b>
        <span class="muted">({{ Math.round(s.pct) }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import CountUp from './CountUp.vue'

const props = defineProps({ data: Array, size: { type: Number, default: 150 }, caption: { type: String, default: 'Total' } })
const total = computed(() => props.data.reduce((a, b) => a + b.value, 0))
const segments = computed(() => {
  let start = 0
  return props.data.map((d) => {
    const pct = (d.value / total.value) * 100
    const seg = { ...d, pct, start }
    start += pct
    return seg
  })
})
const grown = ref(false)
onMounted(() => setTimeout(() => (grown.value = true), 80))
</script>

<style scoped>
.donut-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.donut { position: relative; flex-shrink: 0; }
svg { width: 100%; height: 100%; }
circle { fill: none; stroke-width: 5; }
.track { stroke: var(--surface-2); }
.seg { transition: stroke-dasharray 1s var(--ease); }
.center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.center strong { font-size: 1.5rem; font-weight: 750; }
.center > span { font-size: 11.5px; color: var(--muted); }
.legend { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 160px; font-size: 13px; }
.legend li { display: flex; align-items: center; gap: 8px; }
.legend i { width: 10px; height: 10px; border-radius: 50%; }
</style>
