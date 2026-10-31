import { reactive } from 'vue'

export const toasts = reactive([])
let id = 0

function push(type, message, timeout = 3200) {
  const t = { id: ++id, type, message }
  toasts.push(t)
  setTimeout(() => dismiss(t.id), timeout)
}

export function dismiss(tid) {
  const i = toasts.findIndex((t) => t.id === tid)
  if (i > -1) toasts.splice(i, 1)
}

export function useToast() {
  return {
    success: (m) => push('success', m),
    error: (m) => push('error', m, 4200),
    info: (m) => push('info', m)
  }
}
