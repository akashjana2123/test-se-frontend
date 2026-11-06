<template>
  <div>
    <div class="page-head">
      <div>
        <h1>Messages</h1>
        <p>Stay in touch with your mentees between sessions.</p>
      </div>
    </div>

    <div v-if="!convos" class="layout"><div class="skeleton" style="height: 520px" /><div class="skeleton" style="height: 520px" /></div>

    <EmptyState v-else-if="!convos.length" title="No conversations yet" text="Accept a mentee request to start chatting.">
      <RouterLink to="/mentor/requests" class="btn btn-primary btn-sm">View requests</RouterLink>
    </EmptyState>

    <div v-else class="layout">
      <!-- Conversation list -->
      <aside class="card list fade-up" :class="{ 'hide-sm': activeId }">
        <div class="input-icon"><Search /><input v-model="q" class="input" placeholder="Search mentees..." /></div>
        <div class="stack-sm mt-3">
          <RouterLink
            v-for="c in filtered"
            :key="c.mentee.id"
            :to="`/mentor/messages/${c.mentee.id}`"
            class="convo"
            :class="{ active: c.mentee.id === activeId }"
          >
            <UiAvatar :src="c.mentee.avatar" :name="c.mentee.name" :size="42" online />
            <div class="grow min0">
              <div class="flex justify-between gap-2">
                <b class="small truncate">{{ c.mentee.name }}</b>
                <span class="tiny muted nowrap">{{ c.lastMessage?.time }}</span>
              </div>
              <p class="tiny muted truncate">
                <template v-if="c.lastMessage">{{ c.lastMessage.from === 'mentor' ? 'You: ' : '' }}{{ c.lastMessage.text }}</template>
                <template v-else>No messages yet</template>
              </p>
            </div>
          </RouterLink>
          <p v-if="!filtered.length" class="small muted center">No mentees match "{{ q }}"</p>
        </div>
      </aside>

      <!-- Chat pane -->
      <div v-if="!chat" class="skeleton" style="height: 520px" />
      <div v-else class="stack fade-up" :class="{ 'hide-sm': !activeId }">
        <div class="card mentee-head">
          <RouterLink to="/mentor/messages" class="btn btn-ghost btn-icon btn-sm back" aria-label="Back to conversations"><ArrowLeft /></RouterLink>
          <UiAvatar :src="chat.mentee.avatar" :name="chat.mentee.name" :size="52" online />
          <div class="grow min0">
            <b>{{ chat.mentee.name }}</b>
            <p class="small muted truncate">{{ chat.mentee.course }} · {{ chat.mentee.institute }}</p>
          </div>
          <StatusBadge status="active" />
          <RouterLink to="/mentor/sessions" class="btn btn-outline btn-sm"><CalendarDays /> Sessions</RouterLink>
        </div>

        <div class="card facts">
          <div><span class="lbl"><CalendarDays /> Next session</span><p>{{ chat.mentee.nextSession }}</p></div>
          <div><span class="lbl"><Target /> Career goal</span><p>{{ chat.mentee.goal }}</p></div>
          <div>
            <span class="lbl"><TrendingUp /> Goal progress</span>
            <div class="flex items-center gap-2 mt-1"><div class="progress grow"><span :style="{ width: chat.mentee.progress + '%' }" /></div><b class="small">{{ chat.mentee.progress }}%</b></div>
          </div>
        </div>

        <div class="card chat-card">
          <h4>Conversation</h4>
          <div class="chat">
            <div ref="scroller" class="messages">
              <p v-if="!chat.messages.length && !typing" class="small muted center empty">Say hello to {{ chat.mentee.name.split(' ')[0] }} 👋</p>
              <TransitionGroup name="msg">
                <div v-for="(msg, i) in chat.messages" :key="i" class="msg" :class="msg.from">
                  <UiAvatar v-if="msg.from === 'student'" :src="chat.mentee.avatar" :name="chat.mentee.name" :size="30" />
                  <div class="bubble">{{ msg.text }}<span>{{ msg.time }}</span></div>
                </div>
              </TransitionGroup>
              <div v-if="typing" class="msg student">
                <UiAvatar :src="chat.mentee.avatar" :name="chat.mentee.name" :size="30" />
                <div class="bubble typing"><i /><i /><i /></div>
              </div>
            </div>
            <form class="composer" @submit.prevent="send">
              <input v-model="text" class="input" :placeholder="`Message ${chat.mentee.name.split(' ')[0]}...`" :disabled="sending" />
              <button class="btn btn-primary btn-icon" :disabled="!text.trim() || sending" aria-label="Send"><SendHorizontal /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ArrowLeft, CalendarDays, Target, TrendingUp, SendHorizontal } from '@lucide/vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { mentorApi } from '@/api'
import { USE_MOCK } from '@/api/client'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const convos = ref(null)
const chat = ref(null)
const q = ref('')
const text = ref('')
const sending = ref(false)
const typing = ref(false)
const scroller = ref(null)
let replyTimer = null

const activeId = computed(() => route.params.id || '')
const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  return (convos.value || []).filter((c) => !s || c.mentee.name.toLowerCase().includes(s))
})

onMounted(async () => {
  convos.value = await mentorApi.getConversations()
  // on desktop, open the first conversation when none is selected
  if (!activeId.value && convos.value.length && window.matchMedia('(min-width: 1025px)').matches) {
    router.replace(`/mentor/messages/${convos.value[0].mentee.id}`)
  } else if (activeId.value) loadChat(activeId.value)
})

watch(activeId, (id) => { if (id) loadChat(id) })
onBeforeUnmount(() => clearTimeout(replyTimer))

async function loadChat(id) {
  clearTimeout(replyTimer)
  typing.value = false
  chat.value = null
  text.value = ''
  try {
    chat.value = await mentorApi.getConversation(id)
    scrollDown(false)
  } catch (e) {
    toast.error(e.message)
    router.replace('/mentor/messages')
  }
}

function scrollDown(smooth = true) {
  nextTick(() => { if (scroller.value) scroller.value.scrollTo({ top: scroller.value.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }) })
}

function updatePreview(id, msg) {
  const c = convos.value?.find((x) => x.mentee.id === id)
  if (c) c.lastMessage = msg
}

async function send() {
  const t = text.value.trim()
  if (!t || !chat.value) return
  const id = chat.value.mentee.id
  sending.value = true
  try {
    const msg = await mentorApi.sendMessage(id, t)
    text.value = ''
    chat.value.messages.push(msg)
    updatePreview(id, msg)
    scrollDown()
    if (USE_MOCK) simulateReply(id)
  } catch (e) {
    toast.error(e.message)
  } finally {
    sending.value = false
  }
}

// simulated mentee reply (demo only, not stored)
function simulateReply(id) {
  clearTimeout(replyTimer)
  typing.value = true
  scrollDown()
  replyTimer = setTimeout(() => {
    typing.value = false
    if (chat.value?.mentee.id !== id) return
    const reply = { from: 'student', text: 'Thank you! That really helps. I will work on it before our next session.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    chat.value.messages.push(reply)
    updatePreview(id, reply)
    scrollDown()
  }, 1600)
}
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start; }
.list { position: sticky; top: 88px; }
.convo { display: flex; gap: 12px; align-items: center; padding: 10px; border-radius: 10px; color: inherit; text-decoration: none; border: 1px solid transparent; transition: all 0.2s var(--ease); }
.convo:hover { background: var(--surface-2); }
.convo.active { background: var(--primary-50); border-color: var(--primary-100); }
.min0 { min-width: 0; }
.nowrap { white-space: nowrap; }
.center { text-align: center; }
.mentee-head { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.back { display: none; }
.facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.lbl { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 650; color: var(--muted); }
.lbl svg { width: 13px; height: 13px; color: var(--primary); }
.facts p { font-size: 12.5px; margin-top: 4px; color: var(--text-2); }
.chat { display: flex; flex-direction: column; margin-top: 14px; }
.messages { height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 4px 4px 12px; }
.empty { margin: auto 0; }
.msg { display: flex; gap: 8px; align-items: flex-end; max-width: 80%; }
.msg.mentor { align-self: flex-end; }
.bubble { padding: 10px 14px; border-radius: 16px; font-size: 13.5px; background: var(--surface-2); border-bottom-left-radius: 4px; }
.bubble span { display: block; font-size: 10.5px; color: var(--muted); margin-top: 4px; }
.mentor .bubble { background: var(--primary-600); color: #fff; border-radius: 16px 16px 4px 16px; }
.mentor .bubble span { color: rgba(255, 255, 255, 0.82); text-align: right; }
.typing { display: flex; gap: 4px; padding: 14px; }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); animation: blink 1.2s infinite; }
.typing i:nth-child(2) { animation-delay: 0.15s; }
.typing i:nth-child(3) { animation-delay: 0.3s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
.msg-enter-active { transition: all 0.35s var(--ease); }
.msg-enter-from { opacity: 0; transform: translateY(10px) scale(0.97); }
.composer { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border); }
@media (max-width: 1024px) {
  .layout { grid-template-columns: 1fr; }
  .list { position: static; }
  .hide-sm { display: none; }
  .back { display: inline-flex; }
}
@media (max-width: 600px) { .facts { grid-template-columns: 1fr; } .msg { max-width: 92%; } }
</style>
