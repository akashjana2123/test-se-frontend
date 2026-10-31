<template>
  <div ref="root" class="landing">
    <!-- Nav -->
    <header class="nav" :class="{ scrolled }">
      <div class="container nav-inner">
        <AppLogo />
        <nav class="links" :class="{ open: navOpen }">
          <a v-for="l in links" :key="l.href" :href="l.href" @click="navOpen = false">{{ l.label }}</a>
          <div class="nav-cta-mobile">
            <RouterLink to="/login" class="btn btn-outline btn-block">Log in</RouterLink>
            <RouterLink to="/signup" class="btn btn-primary btn-block">Sign up</RouterLink>
          </div>
        </nav>
        <div class="nav-cta">
          <RouterLink to="/login" class="btn btn-ghost">Log in</RouterLink>
          <RouterLink to="/signup" class="btn btn-primary">Sign up</RouterLink>
        </div>
        <button class="btn btn-ghost btn-icon burger" aria-label="Menu" @click="navOpen = !navOpen"><X v-if="navOpen" /><Menu v-else /></button>
      </div>
    </header>

    <!-- Hero -->
    <section id="home" class="hero">
      <div class="bg-grid" />
      <div class="blob b1" /><div class="blob b2" />
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="eyebrow h-anim"><Sparkles /> Mentorship for every student</span>
          <h1 class="h-anim">Your career journey deserves the <span class="grad">right guidance.</span></h1>
          <p class="lead h-anim">Connect with experienced mentors for higher studies, placements, entrepreneurship and more.</p>
          <div class="hero-btns h-anim">
            <RouterLink to="/signup" class="btn btn-primary btn-lg">Explore Mentors <ArrowRight /></RouterLink>
            <RouterLink to="/signup?role=mentor" class="btn btn-outline btn-lg">Become a Mentor</RouterLink>
          </div>
          <div class="community h-anim">
            <div class="stack-av">
              <UiAvatar v-for="m in mentors" :key="m.id" :src="m.avatar" :name="m.name" :size="36" />
            </div>
            <span>A supportive community of<br /><b>students and mentors</b></span>
          </div>
        </div>

        <div class="hero-art">
          <div class="photo h-img">
            <img :src="hero" alt="Student learning online" />
            <div class="float f2"><span class="ic teal"><Lightbulb /></span><div><b>Real-world insights</b><small>Learn from experience</small></div></div>
          </div>
          <div class="float f1 h-float"><span class="ic"><Compass /></span><div><b>Career guidance</b><small>Get expert advice</small></div></div>
          <div class="float f3 h-float"><span class="ic amber"><Rocket /></span><div><b>Grow your skills</b><small>Build a better future</small></div></div>
        </div>
      </div>
    </section>

    <!-- Career areas -->
    <section id="areas" class="section">
      <div class="container">
        <div class="sec-head" v-reveal>
          <h2>Explore career guidance areas</h2>
          <RouterLink to="/signup" class="link-btn">View all <ArrowRight /></RouterLink>
        </div>
        <div class="grid areas">
          <SpotlightCard v-for="(a, i) in areas" :key="a.title" class="area" v-reveal="i * 70">
            <div class="icon-box" :style="{ background: a.bg, color: a.fg }"><component :is="a.icon" /></div>
            <h4>{{ a.title }}</h4>
            <p class="muted small">{{ a.text }}</p>
          </SpotlightCard>
        </div>
      </div>
    </section>

    <!-- Featured mentors -->
    <section id="mentors" class="section alt">
      <div class="container">
        <div class="sec-head" v-reveal>
          <h2>Featured mentors</h2>
          <RouterLink to="/signup" class="link-btn">View all mentors <ArrowRight /></RouterLink>
        </div>
        <div class="grid grid-4">
          <SpotlightCard v-for="(m, i) in mentors" :key="m.id" class="mentor" v-reveal="i * 80">
            <div class="flex items-center gap-3">
              <UiAvatar :src="m.avatar" :name="m.name" :size="56" />
              <div class="grow">
                <h4>{{ m.name }}</h4>
                <p class="small muted">{{ m.title }}, {{ m.company }}</p>
              </div>
            </div>
            <div class="flex wrap gap-1 mt-3">
              <span v-for="t in m.tags.slice(0, 3)" :key="t" class="tag tag-gray">{{ t }}</span>
            </div>
            <div class="flex items-center justify-between mt-4">
              <StatusBadge :status="m.available ? 'available' : 'busy'" />
              <RouterLink to="/login" class="link-btn small">View profile <ArrowRight /></RouterLink>
            </div>
          </SpotlightCard>
          <template v-if="!mentors.length">
            <div v-for="i in 4" :key="i" class="skeleton" style="height: 170px" />
          </template>
        </div>
      </div>
    </section>

    <!-- How it works (tracing beam) -->
    <section id="how" class="section">
      <div class="container how">
        <div class="how-head" v-reveal>
          <h2>How it works</h2>
          <p class="muted mt-2">Four simple steps.</p>
          <img :src="signpost" alt="" class="signpost" />
        </div>
        <div ref="beamWrap" class="beam-wrap">
          <div class="beam"><div ref="beamFill" class="beam-fill" /></div>
          <div v-for="(s, i) in steps" :key="s.title" class="step" v-reveal="i * 60">
            <span class="step-dot"><component :is="s.icon" /></span>
            <div class="card step-card">
              <span class="step-no">Step {{ i + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p class="muted small mt-1">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats + stories -->
    <section class="section alt">
      <div class="container grid grid-2 glance">
        <div v-reveal>
          <h2>Platform at a glance</h2>
          <div class="grid grid-2 mt-4">
            <div v-for="s in stats" :key="s.label" class="card card-hover glance-card">
              <div class="icon-box" :style="{ background: s.bg, color: s.fg }"><component :is="s.icon" /></div>
              <div>
                <div class="big"><CountUp :value="s.value" :suffix="s.suffix" /></div>
                <div class="muted small">{{ s.label }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-reveal="120">
          <h2>Success stories</h2>
          <div class="story card mt-4">
            <div class="story-text">
              <Quote class="q" />
              <Transition name="fade" mode="out-in">
                <div :key="storyIdx">
                  <p class="story-quote">“{{ stories[storyIdx].text }}”</p>
                  <p class="small muted mt-3">— {{ stories[storyIdx].who }}</p>
                </div>
              </Transition>
              <div class="flex items-center gap-2 mt-4">
                <button v-for="(s, i) in stories" :key="i" class="pager" :class="{ on: i === storyIdx }" :aria-label="`Story ${i + 1}`" @click="storyIdx = i" />
              </div>
            </div>
            <img :src="story" alt="" class="story-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- Resources -->
    <section id="resources" class="section">
      <div class="container">
        <div class="sec-head" v-reveal>
          <h2>Explore resources</h2>
          <RouterLink to="/signup" class="link-btn">View all <ArrowRight /></RouterLink>
        </div>
        <div class="grid grid-4">
          <div v-for="(r, i) in resources" :key="r.title" class="card card-hover res" v-reveal="i * 70">
            <img :src="r.thumb" alt="" />
            <div>
              <h4>{{ r.title }}</h4>
              <span class="tag mt-2">{{ r.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta" v-reveal>
          <div>
            <h2>Ready to get started?</h2>
            <p>Create your account to get personalised recommendations.</p>
          </div>
          <div class="flex gap-3 wrap">
            <RouterLink to="/signup" class="btn btn-lg cta-primary">Join as a Student</RouterLink>
            <RouterLink to="/signup?role=mentor" class="btn btn-lg cta-ghost">Become a Mentor</RouterLink>
          </div>
          <Send class="plane" />
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container flex items-center justify-between wrap gap-3">
        <AppLogo />
        <span class="small muted">© 2026 MentorConnect · Guidance today, brighter tomorrow.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Sparkles, ArrowRight, Menu, X, Compass, Lightbulb, Rocket, BookOpen, Briefcase, TrendingUp, Laptop, Ellipsis,
  UserPlus, Search, Send, Video, Users, Layers, CalendarCheck, Heart, Quote
} from '@lucide/vue'
import AppLogo from '@/components/layout/AppLogo.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import SpotlightCard from '@/components/ui/SpotlightCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import CountUp from '@/components/ui/CountUp.vue'
import { commonApi } from '@/api'
import hero from '@/assets/img/hero.jpg'
import signpost from '@/assets/img/signpost.jpg'
import story from '@/assets/img/story.jpg'
import resCareer from '@/assets/img/res-career.jpg'
import resResume from '@/assets/img/res-resume.jpg'
import resHigher from '@/assets/img/res-higher.jpg'
import resStartup from '@/assets/img/res-startup.jpg'

gsap.registerPlugin(ScrollTrigger)

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Career Areas', href: '#areas' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'How it Works', href: '#how' },
  { label: 'Resources', href: '#resources' }
]

const areas = [
  { title: 'Higher Studies', text: 'Admissions, research and global opportunities', icon: BookOpen, bg: '#fdf2f8', fg: '#be185d' },
  { title: 'Placements', text: 'Interview prep, resumes and job search', icon: Briefcase, bg: '#eff6ff', fg: '#1d4ed8' },
  { title: 'Career Development', text: 'Planning, skills and industry pathways', icon: TrendingUp, bg: '#f5f3ff', fg: '#6d28d9' },
  { title: 'Entrepreneurship', text: 'Idea validation and startup growth', icon: Lightbulb, bg: '#fff7e6', fg: '#b45309' },
  { title: 'Freelancing', text: 'Finding clients and building a portfolio', icon: Laptop, bg: '#e7faf6', fg: '#0f766e' },
  { title: 'Other Goals', text: 'Explore more guidance topics', icon: Ellipsis, bg: '#f3f3f9', fg: '#3b3b5a' }
]

const steps = [
  { title: 'Create your profile', text: 'Share your career goals and interests.', icon: UserPlus },
  { title: 'Discover mentors', text: 'Find approved mentors that match you.', icon: Search },
  { title: 'Request mentorship', text: 'Send a request with a short message.', icon: Send },
  { title: 'Meet and grow', text: 'Join sessions and track your action items.', icon: Video }
]

const stats = [
  { label: 'Approved mentors', value: 150, suffix: '+', icon: Users, bg: '#eef0ff', fg: '#4f46e5' },
  { label: 'Career areas', value: 10, suffix: '+', icon: Layers, bg: '#f5f3ff', fg: '#6d28d9' },
  { label: 'Mentoring sessions', value: 500, suffix: '+', icon: CalendarCheck, bg: '#eff6ff', fg: '#1d4ed8' },
  { label: 'Positive feedback', value: 90, suffix: '%', icon: Heart, bg: '#fdf2f8', fg: '#be185d' }
]

const stories = [
  { text: 'The guidance I received helped me plan my higher studies journey with clarity.', who: 'A student, Higher Studies' },
  { text: 'My mentor helped me rewrite my resume and I landed my first internship.', who: 'A student, Placements' },
  { text: 'I validated my startup idea in two weeks with practical feedback.', who: 'A student, Entrepreneurship' }
]

const resources = [
  { title: 'How to Choose the Right Career Path', category: 'Career Planning', thumb: resCareer },
  { title: 'Resume Building Guide', category: 'Placements', thumb: resResume },
  { title: "A Beginner's Guide to Higher Studies", category: 'Higher Studies', thumb: resHigher },
  { title: 'Entrepreneurship Basics', category: 'Entrepreneurship', thumb: resStartup }
]

const root = ref(null)
const beamWrap = ref(null)
const beamFill = ref(null)
const mentors = ref([])
const scrolled = ref(false)
const navOpen = ref(false)
const storyIdx = ref(0)
let ctx
let timer

const onScroll = () => (scrolled.value = window.scrollY > 10)

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  timer = setInterval(() => (storyIdx.value = (storyIdx.value + 1) % stories.length), 5000)

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.h-anim', { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 })
      .from('.h-img', { scale: 0.92, opacity: 0, duration: 0.9 }, 0.15)
      .from('.h-float', { y: 20, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.15 }, 0.6)

    gsap.to('.blob', { x: 'random(-40, 40)', y: 'random(-30, 30)', duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true })

    // Tracing beam: fills as you scroll through the steps
    gsap.fromTo(beamFill.value, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: beamWrap.value, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
    })
  }, root.value)

  mentors.value = await commonApi.getFeaturedMentors()
})

onBeforeUnmount(() => {
  ctx?.revert()
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.landing { background: var(--surface); overflow-x: hidden; }

/* nav */
.nav { position: sticky; top: 0; z-index: 50; transition: background 0.3s, box-shadow 0.3s, border-color 0.3s; border-bottom: 1px solid transparent; }
.nav.scrolled { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-color: var(--border); }
.nav-inner { display: flex; align-items: center; gap: 24px; height: 68px; }
.links { display: flex; gap: 4px; margin: 0 auto; }
.links a { padding: 8px 12px; border-radius: 8px; color: var(--text-2); font-weight: 600; font-size: 13.5px; position: relative; transition: color 0.2s; }
.links a::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 3px; height: 2px; border-radius: 2px; background: var(--primary); transform: scaleX(0); transition: transform 0.3s var(--ease); }
.links a:hover { color: var(--primary); }
.links a:hover::after { transform: scaleX(1); }
.nav-cta { display: flex; gap: 8px; }
.burger, .nav-cta-mobile { display: none; }

/* hero */
.hero { position: relative; padding: 48px 0 80px; overflow: hidden; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%); opacity: 0.6; }
.blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.5; }
.b1 { width: 380px; height: 380px; background: #c7d2fe; top: -80px; right: 10%; }
.b2 { width: 300px; height: 300px; background: #99f6e4; bottom: -60px; left: 5%; opacity: 0.35; }
.hero-inner { position: relative; display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: var(--primary-50); color: var(--primary); font-size: 12.5px; font-weight: 650; }
.eyebrow svg { width: 14px; height: 14px; }
.hero h1 { font-size: clamp(2.1rem, 4.6vw, 3.4rem); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin-top: 18px; }
.grad { background: linear-gradient(90deg, #4f46e5, #0ea5e9 60%, #14b8a6); -webkit-background-clip: text; background-clip: text; color: transparent; }
.lead { font-size: 1.05rem; color: var(--text-2); margin-top: 18px; max-width: 500px; }
.hero-btns { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
.community { display: flex; align-items: center; gap: 14px; margin-top: 30px; font-size: 13px; color: var(--muted); }
.community b { color: var(--text); }
.stack-av { display: flex; }
.stack-av > * { border: 2px solid #fff; margin-left: -10px; transition: transform 0.25s var(--ease); }
.stack-av > *:first-child { margin-left: 0; }
.stack-av > *:hover { transform: translateY(-4px); }

.hero-art { position: relative; justify-self: center; width: min(100%, 440px); }
.photo { position: relative; border-radius: 28px; overflow: hidden; box-shadow: var(--shadow-lg); aspect-ratio: 302 / 282; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
.float { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fff; border-radius: 14px; box-shadow: var(--shadow-lg); font-size: 12px; white-space: nowrap; }
.float b { display: block; font-size: 13px; }
.float small { color: var(--muted); }
.ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--primary-50); color: var(--primary); }
.ic svg { width: 17px; height: 17px; }
.ic.teal { background: var(--accent-50); color: #0f766e; }
.ic.amber { background: #fff7e6; color: #b45309; }
/* f2 sits inside the photo, positioned over the card printed in the source image */
.f2 { left: 33%; top: 28.5%; width: 61.5%; height: 24.5%; border-radius: 16px; padding: 0 16px; gap: 12px; }
.f2 b { font-size: 14.5px; }
.f2 .ic { width: 40px; height: 40px; }
.f1 { left: -42px; top: 14%; animation: float 5s ease-in-out infinite; }
.f3 { left: -24px; bottom: 8%; animation: float 5.5s ease-in-out 0.8s infinite; }

/* sections */
.section { padding: 72px 0; }
.section.alt { background: var(--bg); }
.sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 26px; }
.sec-head h2, .how-head h2, .glance h2 { font-size: clamp(1.4rem, 2.4vw, 1.8rem); font-weight: 750; }
.areas { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.area { display: flex; flex-direction: column; gap: 10px; }
.mentor h4 { font-size: 15px; }

/* tracing beam */
.how { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 48px; align-items: start; }
.how-head { position: sticky; top: 100px; }
.signpost { width: 100%; max-width: 320px; border-radius: 20px; margin-top: 24px; }
.beam-wrap { position: relative; padding-left: 56px; display: flex; flex-direction: column; gap: 22px; }
.beam { position: absolute; left: 19px; top: 8px; bottom: 8px; width: 2px; background: var(--border); border-radius: 2px; overflow: hidden; }
.beam-fill { position: absolute; inset: 0; transform-origin: top; background: linear-gradient(180deg, #14b8a6, #4f46e5 50%, #a855f7); box-shadow: 0 0 12px #6366f1; }
.step { position: relative; }
.step-dot { position: absolute; left: -56px; top: 18px; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: #fff; border: 2px solid var(--primary-100); color: var(--primary); box-shadow: 0 0 0 6px #fff; }
.step-dot svg { width: 18px; height: 18px; }
.step-card { padding: 22px; transition: transform 0.35s var(--ease), box-shadow 0.35s; }
.step-card:hover { transform: translateX(6px); box-shadow: var(--shadow); }
.step-no { font-size: 11.5px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.06em; }
.step-card h3 { margin-top: 4px; }

/* glance & stories */
.glance { gap: 40px; }
.glance-card { display: flex; align-items: center; gap: 14px; }
.big { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
.story { display: grid; grid-template-columns: 1.2fr 1fr; gap: 0; padding: 0; overflow: hidden; }
.story-text { padding: 24px; }
.q { width: 28px; height: 28px; color: var(--primary); opacity: 0.5; margin-bottom: 8px; }
.story-quote { font-size: 1.02rem; font-weight: 600; line-height: 1.6; min-height: 80px; }
.pager { width: 8px; height: 8px; border-radius: 999px; border: 0; padding: 0; background: var(--border-strong); transition: width 0.3s var(--ease), background 0.3s; }
.pager.on { width: 22px; background: var(--primary); }
.story-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }

/* resources */
.res { display: flex; gap: 14px; align-items: center; padding: 14px; }
.res img { width: 72px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.res h4 { font-size: 13.5px; }

/* cta */
.cta { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; padding: 40px; border-radius: 24px; background: linear-gradient(120deg, var(--navy), #3730a3 60%, #0f766e); color: #fff; }
.cta h2 { color: #fff; font-size: 1.7rem; }
.cta p { color: #c7c8f2; margin-top: 6px; }
.cta-primary { background: #fff; color: var(--navy); }
.cta-primary:hover { background: #eef0ff; }
.cta-ghost { background: transparent; border-color: rgba(255, 255, 255, 0.4); color: #fff; }
.cta-ghost:hover { background: rgba(255, 255, 255, 0.1); }
.plane { position: absolute; right: 30%; top: 18px; width: 54px; height: 54px; color: rgba(255, 255, 255, 0.15); animation: float 6s ease-in-out infinite; }
.footer { padding: 28px 0; border-top: 1px solid var(--border); }

@media (max-width: 1080px) {
  .areas { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .links { position: fixed; top: 68px; left: 0; right: 0; flex-direction: column; background: #fff; padding: 12px 16px 20px; border-bottom: 1px solid var(--border); box-shadow: var(--shadow-lg); transform: translateY(-12px); opacity: 0; pointer-events: none; transition: all 0.3s var(--ease); margin: 0; }
  .links.open { transform: none; opacity: 1; pointer-events: auto; }
  .nav-cta { display: none; }
  .burger { display: inline-flex; margin-left: auto; }
  .nav-cta-mobile { display: flex; gap: 8px; margin-top: 10px; }
  .nav { background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(12px); }
  .hero-inner, .how, .glance { grid-template-columns: 1fr; }
  .hero-art { margin-top: 12px; }
  .f1 { left: -8px; }
  .f3 { left: 0; }
  .how-head { position: static; }
  .signpost { display: none; }
}
@media (max-width: 680px) {
  .areas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .story { grid-template-columns: 1fr; }
  .story-img { height: 200px; }
  .section { padding: 52px 0; }
  .cta { padding: 28px; }
  .float { font-size: 11px; padding: 8px 10px; }
  .f2 b { font-size: 12px; }
}
</style>
