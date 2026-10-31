<template>
  <button type="button" class="switch" :class="{ on: modelValue }" role="switch" :aria-checked="modelValue" @click="$emit('update:modelValue', !modelValue)">
    <span />
  </button>
</template>

<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.switch { width: 42px; height: 24px; border-radius: 999px; border: 0; background: var(--border-strong); position: relative; padding: 0; transition: background 0.25s; flex-shrink: 0; }
.switch span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: var(--shadow-sm); transition: transform 0.3s var(--ease); }
.switch.on { background: var(--accent); }
.switch.on span { transform: translateX(18px); }
</style>
