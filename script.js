/* Shared portfolio behaviour. Content is usable before enhancement. */
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const supportsObserver = 'IntersectionObserver' in window;

// Put personal credibility before process detail while preserving a complete static fallback.
function arrangeHomepageNarrative() {
  const hero = document.getElementById('hero');
  const tv = document.getElementById('tv');
  const approach = document.getElementById('approach');
  const media = document.getElementById('media');
  if (!hero || !tv || !approach || !media) return;
  hero.after(tv);
  tv.after(approach);
  approach.after(media);
}
arrangeHomepageNarrative();

// Keep anchor offsets in sync with the wrapping header height.
const navbar = document.getElementById('navbar');
function updateHeader() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.documentElement.style.setProperty('--header-offset', `${navbar.getBoundingClientRect().height + 16}px`);
}
updateHeader();
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
window.addEventListener('resize', updateHeader, { passive: true });
if (navbar && 'ResizeObserver' in window) new ResizeObserver(updateHeader).observe(navbar);
if (document.fonts) document.fonts.ready.then(updateHeader);

const tagEl = document.getElementById('tagline');
function configureTagline() {
  if (!tagEl) return;
  tagEl.style.opacity = '1';
}
configureTagline();

// Only animate when entering: no hidden content waiting for JavaScript.
if (supportsObserver) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      if (!motionPreference.matches) {
        entry.target.classList.add('reveal-enter');
        setTimeout(() => entry.target.classList.remove('reveal-enter'), 1200);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// One counter implementation; preserve the existing suffix/accent exactly.
const runningCounters = new Map();
function finishCounters() {
  runningCounters.forEach((counter, el) => {
    cancelAnimationFrame(counter.frame);
    counter.inner.textContent = counter.original;
    runningCounters.delete(el);
  });
}
function animateCounter(el) {
  if (motionPreference.matches || el.dataset.counted) return;
  el.dataset.counted = 'true';
  const numberNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && /\d/.test(node.textContent));
  if (!numberNode) return;
  const original = numberNode.textContent.trim();
  const target = Number(original);
  if (!Number.isFinite(target)) return;
  const decimals = original.includes('.') ? original.split('.')[1].length : 0;
  const inner = document.createElement('span');
  inner.className = 'num-inner';
  inner.textContent = original;
  numberNode.replaceWith(inner);
  const counter = { inner, original, frame: 0 };
  runningCounters.set(el, counter);
  let start;
  function step(now) {
    if (start === undefined) start = now;
    const progress = Math.min((now - start) / 1600, 1);
    const value = target * (1 - Math.pow(1 - progress, 3));
    inner.textContent = progress === 1 ? original : (decimals ? value.toFixed(decimals) : String(Math.floor(value)));
    if (progress < 1) counter.frame = requestAnimationFrame(step);
    else runningCounters.delete(el);
  }
  counter.frame = requestAnimationFrame(step);
}
if (supportsObserver) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterObserver.unobserve(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.achievement-num').forEach(el => counterObserver.observe(el));
}

// Keyboard activation, focus trap, inert background and return focus.
const lightbox = document.getElementById('lightbox');
let previousFocus;
let previousOverflow = '';
const backgroundState = new Map();
function openLightbox(type, src) {
  if (!lightbox) return;
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');
  if (!lightbox.classList.contains('open')) {
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    Array.from(document.body.children).forEach(el => {
      if (el === lightbox || el.tagName === 'SCRIPT') return;
      backgroundState.set(el, el.inert);
      el.inert = true;
    });
  }
  video.pause();
  if (type === 'image') {
    img.src = src;
    img.alt = previousFocus?.querySelector('img')?.alt || (previousFocus?.tagName === 'IMG' ? previousFocus.alt : 'Expanded image');
    img.style.display = 'block';
    video.style.display = 'none';
  } else {
    video.src = src;
    video.style.display = 'block';
    img.style.display = 'none';
  }
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
}
function closeLightbox() {
  if (!lightbox?.classList.contains('open')) return;
  const video = document.getElementById('lightbox-video');
  video.pause();
  video.removeAttribute('src');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousOverflow;
  backgroundState.forEach((inert, el) => { el.inert = inert; });
  backgroundState.clear();
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
}
function handleLightboxClick(event) {
  if (event.target === lightbox) closeLightbox();
}
document.querySelectorAll('[onclick*="openLightbox"]').forEach(trigger => {
  trigger.addEventListener('click', () => trigger.focus({ preventScroll: true }), { capture: true });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      trigger.click();
    }
  });
});
document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'Tab') {
    const focusable = Array.from(lightbox.querySelectorAll('button, video[controls], [tabindex="0"]')).filter(el => el.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !lightbox.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !lightbox.contains(document.activeElement))) {
      event.preventDefault(); first?.focus();
    }
  }
});

// Native anchors preserve URLs/history and honour CSS scroll offsets.
const tvVideo = document.getElementById('tv-video');
let videoVisible = false;
function updateVideo() {
  if (!tvVideo) return;
  if (videoVisible && !document.hidden && !motionPreference.matches) {
    const play = tvVideo.play();
    if (play?.catch) play.catch(() => { tvVideo.controls = true; });
  } else tvVideo.pause();
}
if (tvVideo) {
  tvVideo.autoplay = false;
  if (supportsObserver) {
    new IntersectionObserver(entries => {
      videoVisible = entries[0].isIntersecting;
      updateVideo();
    }, { threshold: 0.1 }).observe(tvVideo);
  }
  document.addEventListener('visibilitychange', updateVideo);
}
motionPreference.addEventListener('change', () => {
  configureTagline();
  if (motionPreference.matches) finishCounters();
  updateVideo();
});
