<template>
  <div>
    <div class="page-head">
      <div>
        <h1>My active mentees</h1>
        <p>Students you are currently mentoring.</p>
      </div>
      <div v-if="data" class="cap">
        <span class="small bold">{{ data.list.length }} of {{ data.capacity }} spaces filled</span>
        <div class="progress"><span :style="{ width: (data.list.length / data.capacity) * 100 + '%', background: '#14b8a6' }" /></div>
      </div>
    </div>

    <div v-if="data && data.list.length >= data.capacity" class="notice mb"><Info /> You're at full capacity. New requests are paused until a space opens. <RouterLink to="/mentor/availability" class="bold">Increase capacity</RouterLink></div>

    <div v-if="!data" class="grid grid-2"><div v-for="i in 2" :key="i" class="skeleton" style="height: 220px" /></div>
    <div v-else class="grid grid-2 stagger">
      <div v-for="m in data.list" :key="m.id" class="card card-hover mentee">
        <div class="flex items-center gap-3">
          <UiAvatar :src="m.avatar" :name="m.name" :size="52" online />
          <div class="grow"><b>{{ m.name }}</b><p class="small muted">{{ m.course }}</p><p class="tiny muted">{{ m.institute }}</p></div>
          <StatusBadge status="active" />
        </div>
        <div class="grid grid-3 mt-4 facts">
          <div><span class="lbl"><CalendarDays /> Next session</span><p>{{ m.nextSession }}</p></div>
          <div><span class="lbl"><Target /> Career goal</span><p>{{ m.goal }}</p></div>
          <div><span class="lbl"><NotebookPen /> Last note</span><p>{{ m.lastNote }}</p></div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between small"><span class="muted">Goal progress</span><b>{{ m.progress }}%</b></div>
          <div class="progress mt-1"><span :style="{ width: m.progress + '%' }" /></div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary btn-sm" @click="toast.info('Chat opens here once the backend is connected')"><MessageSquare /> Open conversation</button>
          <RouterLink to="/mentor/sessions" class="btn btn-outline btn-sm"><CalendarDays /> View sessions</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Info, CalendarDays, Target, NotebookPen, MessageSquare } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { mentorApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const data = ref(null)
onMounted(async () => (data.value = await mentorApi.getMentees()))
</script>

<style scoped>
.cap { min-width: 200px; display: flex; flex-direction: column; gap: 6px; }
.mb { margin-bottom: 16px; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 650; color: var(--muted); }
.lbl svg { width: 13px; height: 13px; color: var(--primary); }
.facts p { font-size: 12.5px; margin-top: 4px; color: var(--text-2); }
</style>
