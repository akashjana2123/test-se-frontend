<template>
  <div class="card card-hover stat">
    <div class="icon-box" :style="{ background: tint[0], color: tint[1] }"><component :is="icon" /></div>
    <div class="grow">
      <div class="value"><CountUp :value="value" :suffix="suffix" :decimals="decimals" /></div>
      <div class="label">{{ label }}</div>
      <div v-if="delta" class="delta" :class="{ down: delta < 0 }">
        <TrendingUp /> {{ Math.abs(delta) }}% <span class="muted">this month</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUp } from '@lucide/vue'
import CountUp from './CountUp.vue'

const props = defineProps({
  icon: { type: [Object, Function], required: true },
  label: String,
  value: Number,
  suffix: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  delta: Number,
  color: { type: String, default: 'indigo' }
})

// Keys kept for compatibility; values mapped onto the gold palette.
const tints = { indigo: ['#fbf4e6', '#b98a2f'], teal: ['#e8f5e9', '#2e7d32'], amber: ['#fbf1dc', '#8f6a1e'], rose: ['#f6f0e5', '#6b6559'], blue: ['#e6f0ff', '#2563eb'] }
const tint = computed(() => tints[props.color] || tints.indigo)
</script>

<style scoped>
.stat { display: flex; gap: 14px; align-items: flex-start; }
.value { font-size: 1.6rem; font-weight: 750; letter-spacing: -0.02em; line-height: 1.1; }
.label { color: var(--muted); font-size: 13px; margin-top: 2px; }
.delta { display: flex; align-items: center; gap: 4px; white-space: nowrap; font-size: 12px; font-weight: 650; color: var(--success); margin-top: 6px; }
.delta svg { width: 14px; height: 14px; }
.delta.down { color: var(--danger); }
.delta.down svg { transform: scaleY(-1); }
.delta .muted { font-weight: 500; }
</style>
