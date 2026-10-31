<template>
  <div class="nf">
    <h1 class="code">404</h1>
    <h2>Page not found</h2>
    <p class="muted">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="btn btn-primary mt-4">Go home</RouterLink>
  </div>
</template>

<style scoped>
.nf { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 24px; }
.code { font-size: 6rem; font-weight: 800; background: linear-gradient(90deg, #4f46e5, #14b8a6); -webkit-background-clip: text; background-clip: text; color: transparent; animation: float 4s ease-in-out infinite; }
</style>
