<template>
  <div class="chart">
    <div v-if="series.length > 1" class="legend">
      <span v-for="s in series" :key="s.name"><i :style="{ background: s.color }" />{{ s.name }}</span>
    </div>
    <div class="plot" :style="{ height: height + 'px' }">
      <div v-for="(label, i) in labels" :key="label" class="group">
        <div class="bars">
          <div
            v-for="s in series"
            :key="s.name"
            class="bar"
            :style="{ height: grown ? (s.values[i] / max) * 100 + '%' : '0%', background: s.color, transitionDelay: i * 60 + 'ms' }"
          >
            <span class="tip">{{ s.values[i] }}</span>
          </div>
        </div>
        <div class="x">{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  labels: Array,
  series: Array, // [{ name, color, values: [] }]
  height: { type: Number, default: 200 }
})

const max = computed(() => Math.max(...props.series.flatMap((s) => s.values)) * 1.1)
const grown = ref(false)
onMounted(() => setTimeout(() => (grown.value = true), 80))
</script>

<style scoped>
.legend { display: flex; gap: 16px; font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.legend span { display: flex; align-items: center; gap: 6px; }
.legend i { width: 10px; height: 10px; border-radius: 3px; }
.plot { display: flex; align-items: stretch; gap: 10px; border-bottom: 1px dashed var(--border-strong); padding-bottom: 0; }
.group { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.bars { flex: 1; display: flex; align-items: flex-end; justify-content: center; gap: 4px; }
.bar { position: relative; width: 100%; max-width: 26px; border-radius: 6px 6px 2px 2px; transition: height 0.9s var(--ease); cursor: default; }
.bar:hover { filter: brightness(1.08); }
.tip { position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%) translateY(4px); font-size: 11px; font-weight: 700; background: var(--navy); color: #fff; padding: 2px 6px; border-radius: 6px; opacity: 0; pointer-events: none; transition: all 0.2s; white-space: nowrap; }
.bar:hover .tip { opacity: 1; transform: translateX(-50%); }
.x { text-align: center; font-size: 11.5px; color: var(--muted); padding-top: 8px; position: relative; top: 1px; margin-bottom: -26px; height: 26px; }
.chart { padding-bottom: 26px; }
</style>
