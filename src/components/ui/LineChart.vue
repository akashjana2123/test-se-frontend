<template>
  <div class="line-chart">
    <div class="legend">
      <span v-for="s in series" :key="s.name"><i :style="{ background: s.color }" />{{ s.name }}</span>
    </div>
    <svg :viewBox="`0 0 ${W} ${H}`" class="svg">
      <line v-for="g in 4" :key="g" x1="0" :x2="W" :y1="(H - 20) * (g / 4)" :y2="(H - 20) * (g / 4)" class="grid" />
      <g v-for="s in paths" :key="s.name">
        <path :d="s.area" :fill="s.color" opacity="0.08" />
        <path :d="s.line" :stroke="s.color" class="stroke" pathLength="1" />
        <circle v-for="(p, i) in s.points" :key="i" :cx="p[0]" :cy="p[1]" r="3.5" :fill="s.color" class="dot" />
      </g>
    </svg>
    <div class="labels"><span v-for="l in labels" :key="l">{{ l }}</span></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ labels: Array, series: Array })
const W = 600
const H = 200
const max = computed(() => Math.max(...props.series.flatMap((s) => s.values)) * 1.15)

const paths = computed(() => props.series.map((s) => {
  const step = W / (s.values.length - 1)
  const points = s.values.map((v, i) => [i * step, (H - 20) - (v / max.value) * (H - 30)])
  const line = points.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ` L ${W} ${H - 20} L 0 ${H - 20} Z`
  return { ...s, points, line, area }
}))
</script>

<style scoped>
.legend { display: flex; gap: 16px; font-size: 12px; color: var(--muted); margin-bottom: 8px; }
.legend span { display: flex; align-items: center; gap: 6px; }
.legend i { width: 10px; height: 10px; border-radius: 3px; }
.svg { width: 100%; height: auto; display: block; overflow: visible; }
.grid { stroke: var(--border); stroke-dasharray: 4 4; }
.stroke { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.6s var(--ease) forwards; }
.dot { opacity: 0; animation: fadeIn 0.4s 1.2s forwards; }
.labels { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--muted); margin-top: -10px; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fadeIn { to { opacity: 1; } }
</style>
