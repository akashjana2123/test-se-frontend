<template>
  <div>
    <div class="page-head">
      <div>
        <h1>My active mentees</h1>
        <p>Students you are currently mentoring.</p>
      </div>
      <div v-if="data" class="cap">
        <span class="small bold">{{ data.list.length }} of {{ data.capacity }} spaces filled</span>
        <div class="progress"><span :style="{ width: (data.list.length / data.capacity) * 100 + '%', background: '#d5a64a' }" /></div>
      </div>
    </div>

    <div v-if="data && data.list.length >= data.capacity" class="notice mb"><Info /> You're at full capacity. New requests are paused until a space opens. <RouterLink to="/mentor/availability" class="bold">Increase capacity</RouterLink></div>

    <div v-if="!data" class="grid grid-2"><div v-for="i in 2" :key="i" class="skeleton" style="height: 220px" /></div>
    <div v-else class="grid grid-2 stagger">
      <div v-for="m in data.list" :key="m.id" class="card card-hover mentee">
        <div class="flex items-center gap-3">
          <button type="button" class="plain" :disabled="!m.studentId" :aria-label="`View ${m.name}'s profile`" @click="openProfile(m)"><UiAvatar :src="m.avatar" :name="m.name" :size="52" online /></button>
          <div class="grow"><button type="button" class="plain name-link" :disabled="!m.studentId" @click="openProfile(m)">{{ m.name }}</button><p class="small muted">{{ m.course }}</p><p class="tiny muted">{{ m.institute }}</p></div>
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
        <div class="flex gap-2 mt-4 wrap">
          <RouterLink :to="`/mentor/messages/${m.id}`" class="btn btn-primary btn-sm"><MessageSquare /> Open conversation</RouterLink>
          <button type="button" class="btn btn-outline btn-sm" :disabled="!m.studentId" @click="openProfile(m)"><UserRound /> View profile</button>
          <RouterLink to="/mentor/sessions" class="btn btn-outline btn-sm"><CalendarDays /> View sessions</RouterLink>
        </div>
      </div>
    </div>

    <StudentProfileModal v-model="profileOpen" :student-id="selected?.studentId">
      <div v-if="selected" class="mentorship">
        <div class="grid grid-2 gap">
          <div><span class="lbl"><CalendarDays /> Next session</span><p>{{ selected.nextSession }}</p></div>
          <div><span class="lbl"><NotebookPen /> Last note</span><p>{{ selected.lastNote }}</p></div>
        </div>
        <div class="mt-3">
          <div class="flex justify-between small"><span class="muted">Goal progress</span><b>{{ selected.progress }}%</b></div>
          <div class="progress mt-1"><span :style="{ width: selected.progress + '%' }" /></div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="profileOpen = false">Close</button>
        <RouterLink v-if="selected" :to="`/mentor/messages/${selected.id}`" class="btn btn-primary"><MessageSquare /> Open conversation</RouterLink>
      </template>
    </StudentProfileModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Info, CalendarDays, Target, NotebookPen, MessageSquare, UserRound } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import StudentProfileModal from '@/components/StudentProfileModal.vue'
import { mentorApi } from '@/api'

const data = ref(null)
const profileOpen = ref(false)
const selected = ref(null)
onMounted(async () => (data.value = await mentorApi.getMentees()))

function openProfile(m) {
  if (!m.studentId) return
  selected.value = m
  profileOpen.value = true
}
</script>

<style scoped>
.cap { min-width: 200px; display: flex; flex-direction: column; gap: 6px; }
.mb { margin-bottom: 16px; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 650; color: var(--muted); }
.lbl svg { width: 13px; height: 13px; color: var(--primary); }
.facts p { font-size: 12.5px; margin-top: 4px; color: var(--text-2); }
.plain { background: none; border: 0; padding: 0; cursor: pointer; color: inherit; font: inherit; text-align: left; border-radius: 50%; }
.plain:disabled { cursor: default; }
.name-link { font-weight: 700; border-radius: 4px; }
.name-link:not(:disabled):hover { color: var(--primary-text); text-decoration: underline; }
.mentorship { padding: 14px; border-radius: 12px; background: var(--surface-2); }
.mentorship .gap { gap: 14px; }
.mentorship p { font-size: 12.5px; margin-top: 4px; color: var(--text-2); }
</style>
