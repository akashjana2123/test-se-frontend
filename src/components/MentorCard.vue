<template>
  <SpotlightCard class="mcard">
    <div class="top">
      <div class="photo">
        <img v-if="mentor.avatar" :src="mentor.avatar" :alt="mentor.name" />
        <UiAvatar v-else :name="mentor.name" :size="64" />
      </div>
      <ProgressRing :value="mentor.match" :size="50" :stroke="5" color="#14b8a6" />
    </div>
    <div class="mt-3">
      <div class="flex items-center gap-2">
        <h4 class="truncate">{{ mentor.name }}</h4>
        <BadgeCheck class="verified" />
      </div>
      <p class="small muted">{{ mentor.title }} · {{ mentor.company }}</p>
    </div>
    <div class="flex wrap gap-1 mt-3">
      <span v-for="t in mentor.tags.slice(0, 2)" :key="t" class="tag">{{ t }}</span>
    </div>
    <p class="quote small">“{{ mentor.quote }}”</p>
    <div class="flex items-center justify-between foot">
      <StatusBadge :status="mentor.available ? 'available' : 'busy'" />
      <RouterLink :to="`/student/mentors/${mentor.id}`" class="btn btn-soft btn-sm">View profile <ArrowRight /></RouterLink>
    </div>
  </SpotlightCard>
</template>

<script setup>
import { ArrowRight, BadgeCheck } from '@lucide/vue'
import SpotlightCard from './ui/SpotlightCard.vue'
import ProgressRing from './ui/ProgressRing.vue'
import StatusBadge from './ui/StatusBadge.vue'
import UiAvatar from './ui/UiAvatar.vue'

defineProps({ mentor: { type: Object, required: true } })
</script>

<style scoped>
.mcard { display: flex; flex-direction: column; }
.top { display: flex; align-items: flex-start; justify-content: space-between; }
.photo { width: 64px; height: 64px; border-radius: 16px; overflow: hidden; display: grid; place-items: center; }
.photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); }
.mcard:hover .photo img { transform: scale(1.08); }
.verified { width: 16px; height: 16px; color: var(--primary); flex-shrink: 0; }
.quote { color: var(--text-2); margin-top: 12px; flex: 1; }
.foot { margin-top: 16px; }
</style>
