<template>
  <div>
    <button class="back-link" @click="$router.back()"><ArrowLeft /> Back to results</button>

    <div v-if="!m" class="detail"><div class="skeleton" style="height: 420px" /><div class="skeleton" style="height: 320px" /></div>

    <div v-else class="detail">
      <div class="stack">
        <div class="card head fade-up">
          <img v-if="m.photo || m.avatar" :src="m.photo || m.avatar" :alt="m.name" class="photo" />
          <UiAvatar v-else :name="m.name" :size="110" />
          <div class="grow">
            <div class="flex items-center gap-2 wrap">
              <h1>{{ m.name }}</h1>
              <StatusBadge :status="m.available ? 'available' : 'busy'" />
            </div>
            <p class="muted mt-1">{{ m.title }} at {{ m.company }}</p>
            <p class="small muted flex items-center gap-1 mt-1"><MapPin class="ic" /> {{ m.location }}</p>
            <div class="flex wrap gap-1 mt-3">
              <span v-for="t in m.tags" :key="t" class="tag">{{ t }}</span>
            </div>
            <div class="meta mt-3">
              <span><Star /> {{ m.rating }} rating</span>
              <span><CalendarCheck /> {{ m.sessions }} sessions</span>
              <span><Briefcase /> {{ m.experience }}+ yrs</span>
            </div>
          </div>
          <div class="match">
            <ProgressRing :value="m.match" :size="72" color="#14b8a6" />
            <span class="small muted">Match</span>
          </div>
        </div>

        <div class="card fade-up" style="animation-delay: 0.08s">
          <h3>About</h3>
          <p class="mt-2 text-2">{{ m.about }}</p>
        </div>

        <div class="card fade-up" style="animation-delay: 0.14s">
          <h3>Career path</h3>
          <ol class="timeline">
            <li v-for="(c, i) in m.careerPath" :key="i" v-reveal="i * 90">
              <span class="node" />
              <b>{{ c.title }}</b>
              <span class="small muted">{{ c.org }} · {{ c.period }}</span>
            </li>
          </ol>
        </div>
      </div>

      <aside class="card slots fade-up" style="animation-delay: 0.1s">
        <div class="card-head"><h3>Available slots (IST)</h3></div>
        <div v-if="m.slots.length" class="stack-sm">
          <label v-for="s in m.slots" :key="s" class="slot" :class="{ active: slot === s }">
            <input v-model="slot" type="radio" :value="s" />
            <Clock class="ic" />
            <span>{{ s }}</span>
          </label>
        </div>
        <p v-else class="muted small">No open slots right now.</p>

        <div class="notice mt-4"><Info /> One active request at a time.</div>
        <div v-if="pending" class="notice notice-warning mt-2"><Hourglass /> You already have a pending request with {{ pending.mentor?.name }}.</div>

        <RouterLink
          :to="{ path: `/student/mentors/${m.id}/request`, query: { slot } }"
          class="btn btn-primary btn-lg btn-block mt-4"
          :class="{ disabled: !canRequest }"
          :aria-disabled="!canRequest"
          @click="!canRequest && $event.preventDefault()"
        >Request mentorship <ArrowRight /></RouterLink>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, MapPin, Star, CalendarCheck, Briefcase, Clock, Info, Hourglass } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import { studentApi } from '@/api'

const route = useRoute()
const m = ref(null)
const slot = ref('')
const pending = ref(null)
const canRequest = computed(() => m.value?.available && !pending.value)

onMounted(async () => {
  const [mentor, reqs] = await Promise.all([studentApi.getMentor(route.params.id), studentApi.getRequests()])
  m.value = mentor
  slot.value = mentor.slots[0] || ''
  pending.value = reqs.find((r) => r.status === 'pending') || null
})
</script>

<style scoped>
.detail { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
.head { display: flex; gap: 20px; align-items: flex-start; }
.photo { width: 110px; height: 110px; border-radius: 20px; object-fit: cover; flex-shrink: 0; }
.ic { width: 15px; height: 15px; }
.meta { display: flex; gap: 18px; flex-wrap: wrap; font-size: 12.5px; color: var(--text-2); font-weight: 600; }
.meta span { display: flex; align-items: center; gap: 6px; }
.meta svg { width: 15px; height: 15px; color: var(--primary); }
.match { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.text-2 { color: var(--text-2); }
.timeline { list-style: none; margin: 16px 0 0; padding: 0 0 0 26px; position: relative; display: flex; flex-direction: column; gap: 18px; }
.timeline::before { content: ''; position: absolute; left: 7px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(var(--primary), var(--primary-100)); border-radius: 2px; }
.timeline li { position: relative; display: flex; flex-direction: column; }
.node { position: absolute; left: -26px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 3px solid var(--primary); }
.timeline li:first-child .node { background: var(--primary); animation: pulseRing 1.8s infinite; }
.slots { position: sticky; top: 88px; }
.slot { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 550; transition: all 0.2s var(--ease); }
.slot:hover { border-color: var(--primary-100); background: #fafaff; }
.slot.active { border-color: var(--primary); background: var(--primary-50); }
.slot .ic { color: var(--muted); }
.disabled { opacity: 0.5; pointer-events: none; }
@media (max-width: 1024px) { .detail { grid-template-columns: 1fr; } .slots { position: static; } }
@media (max-width: 600px) { .head { flex-direction: column; } .match { flex-direction: row; } }
</style>
