<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Find mentors</h1>
        <p>Only approved mentors are shown.</p>
      </div>
    </div>

    <div class="card filters">
      <div class="input-icon grow"><Search /><input v-model="f.q" class="input" placeholder="Search by name, skills, company..." /></div>
      <select v-model="f.domain" class="select"><option value="">All domains</option><option v-for="d in DOMAINS" :key="d">{{ d }}</option></select>
      <select v-model="f.goal" class="select"><option value="">All goals</option><option v-for="g in CAREER_GOALS" :key="g">{{ g }}</option></select>
      <select v-model="f.availability" class="select"><option value="">Any availability</option><option value="available">Available now</option></select>
      <select v-model="f.sort" class="select"><option value="match">Best match</option><option value="experience">Most experience</option></select>
      <button v-if="hasFilters" class="btn btn-ghost" @click="reset"><RotateCcw /> Clear</button>
    </div>

    <p class="small muted results">{{ loading ? 'Searching...' : `${list.length} mentor${list.length === 1 ? '' : 's'} found` }}</p>

    <div v-if="loading" class="grid grid-3">
      <div v-for="i in 6" :key="i" class="skeleton" style="height: 250px" />
    </div>
    <TransitionGroup v-else-if="list.length" tag="div" name="list" class="grid grid-3 rel">
      <MentorCard v-for="m in list" :key="m.id" :mentor="m" />
    </TransitionGroup>
    <div v-else class="card"><EmptyState title="No mentors match your filters" text="Try clearing a filter or searching another skill."><button class="btn btn-outline btn-sm" @click="reset">Clear filters</button></EmptyState></div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, RotateCcw } from '@lucide/vue'
import MentorCard from '@/components/MentorCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { studentApi } from '@/api'
import { DOMAINS, CAREER_GOALS } from '@/mock/db'

const route = useRoute()
const router = useRouter()
const f = reactive({ q: '', domain: '', goal: '', availability: '', sort: 'match' })
const list = ref([])
const loading = ref(true)
const hasFilters = computed(() => f.q || f.domain || f.goal || f.availability)

let timer
async function load() {
  loading.value = list.value.length === 0
  list.value = await studentApi.getMentors({ ...f })
  loading.value = false
}

watch(() => route.query, (qy) => {
  Object.assign(f, { q: qy.q || '', domain: qy.domain || '', goal: qy.goal || '', availability: qy.availability || '' })
}, { immediate: true })

watch(f, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    load()
    const query = Object.fromEntries(Object.entries(f).filter(([k, v]) => v && k !== 'sort'))
    router.replace({ query })
  }, 250)
}, { deep: true, immediate: true })

function reset() {
  Object.assign(f, { q: '', domain: '', goal: '', availability: '' })
}
</script>

<style scoped>
.filters { display: flex; gap: 10px; flex-wrap: wrap; padding: 14px; }
.filters .input-icon { min-width: 220px; }
.filters .select { width: auto; min-width: 150px; }
.results { margin: 16px 2px 12px; }
.rel { position: relative; }
@media (max-width: 680px) { .filters .select { flex: 1; } }
</style>
