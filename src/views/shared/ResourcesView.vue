<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Resources</h1>
        <p>Guides, articles and videos for your career journey.</p>
      </div>
    </div>

    <div class="flex wrap gap-2 cats">
      <button v-for="c in cats" :key="c" class="chip" :class="{ active: cat === c }" @click="cat = c">{{ c }}</button>
    </div>

    <div v-if="loading" class="grid grid-4"><div v-for="i in 8" :key="i" class="skeleton" style="height: 230px" /></div>
    <TransitionGroup v-else tag="div" name="list" class="grid grid-4">
      <div v-for="r in list" :key="r.id" class="card res">
        <div class="thumb">
          <img :src="r.thumb" :alt="r.title" />
          <span class="type"><component :is="r.type === 'Video' ? PlayCircle : FileText" /> {{ r.type }}</span>
        </div>
        <div class="body">
          <span class="tag">{{ r.category }}</span>
          <h4 class="mt-2">{{ r.title }}</h4>
          <div class="flex items-center justify-between mt-3">
            <span class="tiny muted flex items-center gap-1"><Clock class="ic" /> {{ r.mins }} min</span>
            <button class="save" :class="{ on: saved.includes(r.id) }" :aria-label="saved.includes(r.id) ? 'Remove bookmark' : 'Bookmark'" @click="toggle(r)"><Bookmark /></button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PlayCircle, FileText, Clock, Bookmark } from '@lucide/vue'
import { commonApi } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const cats = ['All', 'Career Planning', 'Placements', 'Higher Studies', 'Entrepreneurship']
const cat = ref('All')
const list = ref([])
const loading = ref(true)
const saved = ref([])

watch(cat, async (c) => {
  list.value = await commonApi.getResources({ category: c })
  loading.value = false
}, { immediate: true })

function toggle(r) {
  const i = saved.value.indexOf(r.id)
  if (i > -1) saved.value.splice(i, 1)
  else { saved.value.push(r.id); toast.success('Saved to your bookmarks') }
}
</script>

<style scoped>
.cats { margin-bottom: 18px; }
.res { padding: 0; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.35s var(--ease), box-shadow 0.35s; }
.res:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.thumb { position: relative; height: 130px; overflow: hidden; }
.thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
.res:hover .thumb img { transform: scale(1.07); }
.type { position: absolute; left: 10px; top: 10px; display: flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: rgba(255, 255, 255, 0.92); font-size: 11.5px; font-weight: 650; }
.type svg { width: 13px; height: 13px; }
.body { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }
.body h4 { flex: 1; }
.ic { width: 13px; height: 13px; }
.save { border: 0; background: none; padding: 4px; color: var(--muted); border-radius: 8px; transition: all 0.2s; }
.save svg { width: 18px; height: 18px; }
.save:hover { color: var(--primary); background: var(--primary-50); }
.save.on { color: var(--primary); }
.save.on svg { fill: currentColor; animation: pop 0.3s var(--ease); }
</style>
