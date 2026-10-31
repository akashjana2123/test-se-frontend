<template>
  <div class="field">
    <span class="label">{{ label }} <span class="muted">({{ modelValue.length }}/{{ max }})</span></span>
    <div class="chips" :class="{ shake }">
      <button
        v-for="o in options" :key="o" type="button"
        class="chip" :class="{ active: modelValue.includes(o) }"
        @click="toggle(o)"
      >
        {{ o }}<X v-if="modelValue.includes(o)" /><Plus v-else />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Plus } from '@lucide/vue'

const props = defineProps({ modelValue: Array, options: Array, label: String, max: { type: Number, default: 5 } })
const emit = defineEmits(['update:modelValue'])
const shake = ref(false)

function toggle(o) {
  const list = [...props.modelValue]
  if (list.includes(o)) list.splice(list.indexOf(o), 1)
  else if (list.length >= props.max) { shake.value = true; setTimeout(() => (shake.value = false), 400); return }
  else list.push(o)
  emit('update:modelValue', list)
}
</script>

<style scoped>
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip svg { transition: transform 0.25s var(--ease); }
.chip:hover svg { transform: rotate(90deg); }
.shake { animation: shake 0.4s; }
@keyframes shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
</style>
