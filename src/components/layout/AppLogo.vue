<template>
  <RouterLink :to="to" class="logo" :class="{ light }">
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8c47c" /><stop offset="1" stop-color="#b98a2f" /></linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg)" />
      <path d="M16 7c-3.5 2.2-5.5 5.4-5.5 9s2 6.8 5.5 9c3.5-2.2 5.5-5.4 5.5-9S19.5 9.2 16 7z" fill="#fff" opacity=".95" />
    </svg>
    <span>Mentor<b>Connect</b></span>
  </RouterLink>
</template>

<script setup>
defineProps({ to: { type: String, default: '/' }, light: Boolean })
</script>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 750; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }
.logo svg { width: 30px; height: 30px; transition: transform 0.5s var(--ease); }
.logo:hover svg { transform: rotate(-12deg) scale(1.05); }
.logo b { color: var(--primary); font-weight: 750; }
.logo.light { color: #fff; }
.logo.light b { color: #e8c47c; }
</style>
