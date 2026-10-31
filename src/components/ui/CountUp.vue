<template><span ref="el">{{ display }}</span></template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

// Counts up to `value` once the number scrolls into view.
const props = defineProps({
  value: { type: Number, default: 0 },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  prefix: { type: String, default: '' },
  duration: { type: Number, default: 1.4 }
})

const el = ref(null)
const state = { n: 0 }
const display = ref(format(0))
let tween
let seen = false
let io

function format(n) {
  return props.prefix + Number(n).toLocaleString('en-IN', { minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals }) + props.suffix
}

function animate() {
  tween?.kill()
  tween = gsap.to(state, { n: props.value, duration: props.duration, ease: 'power3.out', onUpdate: () => { display.value = format(state.n) } })
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') { seen = true; return animate() }
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { seen = true; animate(); io.disconnect() }
  })
  io.observe(el.value)
})
watch(() => props.value, () => seen && animate())
onBeforeUnmount(() => { tween?.kill(); io?.disconnect() })
</script>
