<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.meta.layout || route.path" />
    </Transition>
  </RouterView>
  <ToastHost />
</template>

<script setup>
import ToastHost from '@/components/ui/ToastHost.vue'
</script>
