const stage = document.getElementById('hero-visual-stage');
const canvas = document.getElementById('hero-dot-field');
const hero = document.getElementById('hero');
const guideDock = document.getElementById('story-guide');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (stage && canvas && hero) initialiseWorld();

function initialiseWorld() {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const count = coarse ? 34 : 76;
  const pointer = { x: 0, y: 0, active: false };
  let width = 1;
  let height = 1;
  let visible = true;
  let frame = 0;
  let lastTime = 0;

  const dots = Array.from({ length: count }, (_, index) => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00009,
    vy: (Math.random() - 0.5) * 0.00009,
    size: index % 11 === 0 ? 2.2 : 1 + Math.random() * 1.2,
    family: index % 3
  }));

  function resize() {
    width = Math.max(1, stage.clientWidth);
    height = Math.max(1, stage.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function target(dot, progress) {
    if (progress < 0.34) return { x: dot.x, y: dot.y };
    const centers = [{ x: 0.25, y: 0.28 }, { x: 0.74, y: 0.28 }, { x: 0.74, y: 0.74 }];
    const center = centers[dot.family];
    const index = dots.indexOf(dot);
    const angle = index * 2.399963;
    const radius = 0.035 + (index % 8) * 0.007;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  }

  function updateDot(dot, progress, delta) {
    if (!reducedMotion.matches) {
      dot.x += dot.vx * delta;
      dot.y += dot.vy * delta;
    }
    if (dot.x < 0 || dot.x > 1) dot.vx *= -1;
    if (dot.y < 0 || dot.y > 1) dot.vy *= -1;
    dot.x = Math.max(0, Math.min(1, dot.x));
    dot.y = Math.max(0, Math.min(1, dot.y));

    const destination = target(dot, progress);
    const pull = reducedMotion.matches ? 0.12 : progress * 0.018;
    dot.x += (destination.x - dot.x) * pull;
    dot.y += (destination.y - dot.y) * pull;

    if (pointer.active && !coarse && !reducedMotion.matches) {
      const dx = dot.x * width - pointer.x;
      const dy = dot.y * height - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 115 && distance > 0) {
        const force = (115 - distance) / 115;
        dot.x += (dx / distance) * force * 0.012;
        dot.y += (dy / distance) * force * 0.012;
      }
    }
  }

  function draw(time = 0) {
    frame = 0;
    if (!visible || document.hidden) return;
    const delta = Math.min(40, time - lastTime || 16);
    lastTime = time;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height * 0.75)));
    context.clearRect(0, 0, width, height);
    dots.forEach(dot => updateDot(dot, progress, delta));

    for (let a = 0; a < dots.length; a += 1) {
      const first = dots[a];
      for (let b = a + 1; b < dots.length; b += 1) {
        const second = dots[b];
        const dx = (first.x - second.x) * width;
        const dy = (first.y - second.y) * height;
        const distance = Math.hypot(dx, dy);
        if (distance > 86 || (progress > 0.45 && first.family !== second.family)) continue;
        context.strokeStyle = `rgba(128,151,255,${(1 - distance / 86) * 0.18})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(first.x * width, first.y * height);
        context.lineTo(second.x * width, second.y * height);
        context.stroke();
      }
    }

    const colors = ['#ead8cc', '#7f98ff', '#aaa5ba'];
    dots.forEach(dot => {
      context.fillStyle = colors[dot.family];
      context.globalAlpha = 0.46 + dot.size * 0.12;
      context.beginPath();
      context.arc(dot.x * width, dot.y * height, dot.size, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  function moveGuide(event) {
    const rect = stage.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    const nx = pointer.x / rect.width - 0.5;
    const ny = pointer.y / rect.height - 0.5;
    stage.style.setProperty('--guide-x', `${nx * 7}px`);
    stage.style.setProperty('--guide-y', `${ny * 5}px`);
    stage.style.setProperty('--eye-x', `${nx * 3}px`);
    stage.style.setProperty('--eye-y', `${ny * 2}px`);
    if (reducedMotion.matches) draw(performance.now());
  }

  stage.addEventListener('pointermove', moveGuide, { passive: true });
  stage.addEventListener('pointerleave', () => {
    pointer.active = false;
    stage.style.setProperty('--guide-x', '0px');
    stage.style.setProperty('--guide-y', '0px');
    stage.style.setProperty('--eye-x', '0px');
    stage.style.setProperty('--eye-y', '0px');
  }, { passive: true });

  const messages = new Map([
    ['tv', 'Communication builds trust.'],
    ['approach', 'Here’s how I move from uncertainty to a decision.'],
    ['media', 'Listening is part of product work.'],
    ['product-work', 'Now, let me show you the evidence.'],
    ['achievement-wall', 'Evidence makes decisions defensible.'],
    ['capabilities', 'Discovery, decisions, delivery and learning.'],
    ['background', 'Product connects technology and business.'],
    ['leadership', 'Leadership starts with representing people well.'],
    ['closing', 'Want to build something people actually need?']
  ]);
  if (guideDock && 'IntersectionObserver' in window) {
    const guideMessage = guideDock.querySelector('.story-guide-message');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const message = messages.get(entry.target.id);
        if (message) guideMessage.textContent = message;
        guideDock.classList.toggle('is-ending', entry.target.id === 'closing');
      });
    }, { rootMargin: '-35% 0px -50%' });
    messages.forEach((_, id) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    new IntersectionObserver(([entry]) => guideDock.classList.toggle('is-visible', !entry.isIntersecting), { threshold: 0.2 }).observe(hero);
  }

  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(draw);
    else if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin: '80px' }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !frame) frame = requestAnimationFrame(draw); });
  reducedMotion.addEventListener('change', () => { if (!frame) frame = requestAnimationFrame(draw); });
  resize();
  frame = requestAnimationFrame(draw);
}
