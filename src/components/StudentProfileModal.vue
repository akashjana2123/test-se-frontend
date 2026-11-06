<template>
  <UiModal :model-value="modelValue" title="Student profile" :width="620" @update:model-value="$emit('update:modelValue', $event)">
    <div v-if="!profile" class="stack-sm"><div class="skeleton" style="height: 72px" /><div class="skeleton" style="height: 160px" /></div>
    <div v-else class="stack-sm pf">
      <div class="pf-head">
        <UiAvatar :src="profile.avatar" :name="profile.name" :size="64" />
        <div class="grow min0">
          <h3>{{ profile.name }}</h3>
          <p class="small muted">{{ profile.institute }}</p>
          <div class="flex gap-2 wrap mt-2">
            <span class="tag">{{ profile.academicLevel }} · {{ profile.year }}</span>
            <span class="tag tag-gray">{{ profile.pastMentorships }} past mentorship(s)</span>
            <span class="tag tag-gray">Joined {{ profile.joinedOn }}</span>
          </div>
        </div>
        <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" rel="noopener" class="btn btn-outline btn-sm">LinkedIn <ExternalLink /></a>
      </div>

      <div v-if="profile.bio">
        <span class="lbl"><UserRound /> About</span>
        <p class="small">{{ profile.bio }}</p>
      </div>

      <div class="grid grid-2 pf-grid">
        <div><span class="lbl"><GraduationCap /> Programme</span><p class="small">{{ profile.programme }}</p></div>
        <div><span class="lbl"><Layers /> Dual degree</span><p class="small">{{ profile.dualDegree || 'None' }}</p></div>
        <div><span class="lbl"><Target /> Career goal</span><span class="tag">{{ profile.careerGoal }}</span></div>
        <div><span class="lbl"><Mail /> Email</span><p class="small truncate">{{ profile.email }}</p></div>
      </div>

      <div>
        <span class="lbl"><Sparkles /> Skills</span>
        <div class="flex wrap gap-2">
          <span v-for="s in profile.skills" :key="s" class="chip active">{{ s }}</span>
          <span v-if="!profile.skills?.length" class="small muted">No skills added</span>
        </div>
      </div>

      <div v-if="profile.interests?.length">
        <span class="lbl"><Heart /> Interests</span>
        <div class="flex wrap gap-2"><span v-for="s in profile.interests" :key="s" class="chip">{{ s }}</span></div>
      </div>

      <!-- page-specific extras (request message, mentorship progress...) -->
      <slot />
    </div>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </UiModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Target, UserRound, GraduationCap, Layers, Mail, Sparkles, Heart, ExternalLink } from '@lucide/vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import { mentorApi } from '@/api'
import { useToast } from '@/composables/useToast'

// `loader` lets each role use its own endpoint (mentor by default, admin passes adminApi.getStudentProfile)
const props = defineProps({ modelValue: Boolean, studentId: String, loader: { type: Function, default: (id) => mentorApi.getStudentProfile(id) } })
const emit = defineEmits(['update:modelValue'])
const toast = useToast()
const profile = ref(null)
const cache = {}

// load (or reuse) the profile whenever the modal opens for a student
watch(() => [props.modelValue, props.studentId], async ([open, id]) => {
  if (!open || !id) return
  profile.value = cache[id] || null
  if (profile.value) return
  try {
    const p = await props.loader(id)
    cache[id] = p
    if (props.studentId === id) profile.value = p
  } catch (e) {
    emit('update:modelValue', false)
    toast.error(e.message)
  }
}, { immediate: true })
</script>

<style scoped>
.min0 { min-width: 0; }
.pf { gap: 16px; }
.pf-head { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.pf-head h3 { margin: 0; }
.pf-grid { gap: 14px; }
.pf .chip { cursor: default; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 650; color: var(--muted); margin-bottom: 4px; }
.lbl svg { width: 14px; height: 14px; color: var(--primary); }
@media (max-width: 560px) { .pf-grid { grid-template-columns: 1fr; } }
</style>
