<template>
  <div ref="wrap" class="tabs" role="tablist">
    <span class="indicator" :style="indicator" />
    <button
      v-for="t in tabs"
      :key="t.key"
      :ref="(el) => (refs[t.key] = el)"
      class="tab"
      :class="{ active: t.key === modelValue }"
      role="tab"
      @click="$emit('update:modelValue', t.key)"
    >
      {{ t.label }}<span v-if="t.count != null" class="count">{{ t.count }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({ tabs: Array, modelValue: String })
defineEmits(['update:modelValue'])

const refs = reactive({})
const wrap = ref(null)
const indicator = ref({})

function move() {
  const el = refs[props.modelValue]
  if (!el) return
  indicator.value = { width: el.offsetWidth + 'px', transform: `translateX(${el.offsetLeft}px)` }
}

onMounted(() => { nextTick(move); window.addEventListener('resize', move) })
onBeforeUnmount(() => window.removeEventListener('resize', move))
watch(() => [props.modelValue, props.tabs], () => nextTick(move), { deep: true })
</script>

<style scoped>
.tabs { position: relative; display: inline-flex; gap: 2px; padding: 4px; background: var(--surface-2); border-radius: 12px; max-width: 100%; overflow-x: auto; }
.indicator { position: absolute; top: 4px; left: 0; height: calc(100% - 8px); background: var(--surface); border-radius: 9px; box-shadow: var(--shadow-sm); transition: transform 0.35s var(--ease), width 0.35s var(--ease); }
.tab { position: relative; z-index: 1; border: 0; background: none; padding: 7px 14px; border-radius: 9px; font-size: 13px; font-weight: 600; color: var(--muted); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; transition: color 0.2s; }
.tab.active { color: var(--text); }
.count { font-size: 11px; background: var(--primary-50); color: var(--primary); padding: 1px 7px; border-radius: 999px; }
</style>
