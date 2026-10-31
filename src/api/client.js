// Single place that decides: dummy data or real backend.
// Set VITE_USE_MOCK=false and VITE_API_BASE_URL in .env when the backend is ready.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const storage = {
  get(key) { try { return localStorage.getItem(key) } catch { return null } },
  set(key, value) { try { localStorage.setItem(key, value) } catch { /* ignore */ } },
  remove(key) { try { localStorage.removeItem(key) } catch { /* ignore */ } }
}

async function http({ url, method = 'GET', params, data }) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    : ''
  const token = storage.get('mc_token')
  const res = await fetch(BASE_URL + url + query, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: data ? JSON.stringify(data) : undefined
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `Request failed (${res.status})`)
  return body
}

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)))
const wait = () => new Promise((r) => setTimeout(r, 250 + Math.random() * 250))

/**
 * request({ url, method, params, data }, mockFn)
 * - mock mode: runs mockFn() after a short delay (to show loaders)
 * - real mode: calls the backend with the same url/method/body
 */
export async function request(config, mockFn) {
  if (!USE_MOCK) return http(config)
  await wait()
  return clone(mockFn())
}
