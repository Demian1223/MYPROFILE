const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GSAP_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
const SCROLL_TRIGGER_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';

if (!reducedMotion) initialiseMotion().catch(() => document.documentElement.classList.add('motion-fallback'));

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded) resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
}

async function initialiseMotion() {
  await loadScript(GSAP_URL);
  await loadScript(SCROLL_TRIGGER_URL);
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  document.body.classList.add('motion-ready');

  if (document.getElementById('hero')) {
    const { initialiseHomepageMotion } = await import('./homepage-motion.js');
    initialiseHomepageMotion(window.gsap, window.ScrollTrigger);
  }
  if (document.querySelector('.case-study-content')) {
    const { initialiseCaseStudyMotion } = await import('./case-study-motion.js');
    initialiseCaseStudyMotion(window.gsap, window.ScrollTrigger);
  }

  const refresh = () => window.ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
}
