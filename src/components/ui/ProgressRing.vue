<template>
  <div class="ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :viewBox="`0 0 ${size} ${size}`">
      <circle :cx="c" :cy="c" :r="r" class="track" :stroke-width="stroke" />
      <circle :cx="c" :cy="c" :r="r" class="bar" :stroke="color" :stroke-width="stroke" :stroke-dasharray="len" :stroke-dashoffset="offset" />
    </svg>
    <span :style="{ fontSize: size * 0.24 + 'px' }">{{ value }}%</span>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({ value: Number, size: { type: Number, default: 56 }, stroke: { type: Number, default: 6 }, color: { type: String, default: '#4f46e5' } })
const c = computed(() => props.size / 2)
const r = computed(() => (props.size - props.stroke) / 2)
const len = computed(() => 2 * Math.PI * r.value)
const shown = ref(0)
const offset = computed(() => len.value * (1 - shown.value / 100))
onMounted(() => requestAnimationFrame(() => (shown.value = props.value)))
watch(() => props.value, (v) => (shown.value = v))
</script>

<style scoped>
.ring { position: relative; display: grid; place-items: center; flex-shrink: 0; }
svg { position: absolute; inset: 0; transform: rotate(-90deg); }
circle { fill: none; }
.track { stroke: var(--surface-2); }
.bar { stroke-linecap: round; transition: stroke-dashoffset 1.2s var(--ease); }
span { font-weight: 750; }
</style>
