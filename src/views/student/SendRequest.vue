<template>
  <div class="wrap-narrow">
    <RouterLink :to="`/student/mentors/${route.params.id}`" class="back-link"><ArrowLeft /> Back to mentor profile</RouterLink>

    <Transition name="page" mode="out-in">
      <div v-if="sent" key="done" class="card done">
        <div class="check"><Check /></div>
        <h2>Request sent!</h2>
        <p class="muted">{{ m?.name }} will review your request. You will be notified once they respond.</p>
        <div class="flex gap-3 mt-4 wrap" style="justify-content: center">
          <RouterLink to="/student/requests" class="btn btn-primary">Track request</RouterLink>
          <RouterLink to="/student/mentors" class="btn btn-outline">Back to mentors</RouterLink>
        </div>
      </div>

      <form v-else key="form" class="card stack" @submit.prevent="send">
        <div>
          <h1>Send a mentorship request</h1>
          <p class="muted mt-1">Share a few details to help {{ m?.name?.split(' ')[0] || 'the mentor' }} understand your goals.</p>
        </div>

        <div v-if="m" class="mentor-row">
          <UiAvatar :src="m.avatar" :name="m.name" :size="52" />
          <div class="grow">
            <b>{{ m.name }}</b>
            <p class="small muted">{{ m.title }} at {{ m.company }}</p>
          </div>
          <ProgressRing :value="m.match" :size="48" :stroke="5" color="#14b8a6" />
        </div>
        <div v-else class="skeleton" style="height: 76px" />

        <div v-if="route.query.slot" class="notice"><Clock /> Preferred slot: {{ route.query.slot }}</div>

        <div class="field">
          <label class="label">What is your primary career goal for this mentorship? <span style="color: var(--danger)">*</span></label>
          <select v-model="goal" class="select">
            <option value="" disabled>Select a goal</option>
            <option v-for="g in CAREER_GOALS" :key="g">{{ g }}</option>
          </select>
        </div>

        <div class="field">
          <label class="label">Tell us more <span class="muted">(optional)</span></label>
          <textarea v-model="message" class="textarea" maxlength="500" rows="5" placeholder="Briefly share your background, goals and what you'd like to learn from this mentor." />
          <span class="tiny muted" style="text-align: right">{{ message.length }}/500</span>
        </div>

        <div class="notice"><Lock /> Your message is private and will only be shared with this mentor if they accept your request.</div>

        <button class="btn btn-primary btn-lg btn-block" :disabled="!goal || sending">
          <span v-if="sending" class="spinner" /><template v-else>Send request <Send /></template>
        </button>
      </form>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Check, Clock, Lock, Send } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import { studentApi } from '@/api'
import { CAREER_GOALS } from '@/mock/db'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const toast = useToast()
const m = ref(null)
const goal = ref('')
const message = ref('')
const sending = ref(false)
const sent = ref(false)

onMounted(async () => {
  m.value = await studentApi.getMentor(route.params.id)
  goal.value = m.value.goals[0] || ''
})

async function send() {
  sending.value = true
  try {
    await studentApi.sendRequest({ mentorId: m.value.id, goal: goal.value, message: message.value, slot: route.query.slot || '' })
    sent.value = true
    toast.success('Mentorship request sent')
  } catch (e) {
    toast.error(e.message)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.wrap-narrow { max-width: 680px; margin: 0 auto; }
.mentor-row { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: #fafaff; }
.done { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 24px; }
.check { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; background: var(--success-bg); color: #16a34a; margin-bottom: 8px; animation: pop 0.5s var(--ease), pulseGreen 1.6s 0.5s 2; }
.check svg { width: 36px; height: 36px; stroke-width: 3; stroke-dasharray: 30; stroke-dashoffset: 30; animation: drawCheck 0.5s 0.3s forwards; }
@keyframes drawCheck { to { stroke-dashoffset: 0; } }
@keyframes pulseGreen { 0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.35); } 100% { box-shadow: 0 0 0 18px rgba(22, 163, 74, 0); } }
</style>
