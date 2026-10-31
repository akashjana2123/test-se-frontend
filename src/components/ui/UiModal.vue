<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="overlay" @click.self="close">
        <div class="modal" :style="{ maxWidth: width + 'px' }" role="dialog" aria-modal="true">
          <div class="modal-head">
            <h3>{{ title }}</h3>
            <button class="btn btn-ghost btn-icon btn-sm" aria-label="Close" @click="close"><X /></button>
          </div>
          <div class="modal-body"><slot /></div>
          <div v-if="$slots.footer" class="modal-foot"><slot name="footer" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps({ modelValue: Boolean, title: String, width: { type: Number, default: 480 } })
const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
const onKey = (e) => { if (e.key === 'Escape' && props.modelValue) close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: 90; background: rgba(19, 19, 47, 0.45); backdrop-filter: blur(4px); display: grid; place-items: center; padding: 16px; }
.modal { width: 100%; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 6px; }
.modal-body { padding: 10px 20px 20px; }
.modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; background: var(--surface-2); border-top: 1px solid var(--border); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.3s var(--ease), opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: translateY(14px) scale(0.97); opacity: 0; }
</style>
