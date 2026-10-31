// v-reveal: fades elements in when they scroll into view. v-reveal="150" adds a delay in ms.
const observer = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  : null

export default {
  mounted(el, binding) {
    if (!observer) return
    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    observer.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}
