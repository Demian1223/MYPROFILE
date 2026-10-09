const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarse = window.matchMedia('(pointer: coarse)').matches;
const sections = ['tv', 'approach', 'media', 'product-work', 'achievement-wall', 'capabilities', 'background', 'leadership', 'batchrep', 'psychology', 'compere', 'closing']
  .map(id => document.getElementById(id)).filter(Boolean);

if (sections.length) initialiseAmbientStory();

function initialiseAmbientStory() {
  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-section-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const particles = Array.from({ length: coarse ? 24 : 48 }, (_, index) => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .000035,
    vy: (Math.random() - .5) * .000035,
    family: index % 3,
    phase: Math.random() * Math.PI * 2
  }));
  let active = sections[0];
  let width = 1;
  let height = 1;
  let ratio = 1;
  let frame = 0;
  let last = 0;
  let evidenceFocus = -1;
  const pointer = { x: .5, y: .5, active: false, speed: 0, lastX: .5, lastY: .5 };

  function attach(section) {
    if (!section || section === active && canvas.parentElement === section) return;
    active?.classList.remove('ambient-active');
    active = section;
    active.classList.add('ambient-active');
    active.prepend(canvas);
    resize();
  }

  function resize() {
    width = Math.max(1, active.clientWidth);
    height = Math.max(1, active.clientHeight);
    ratio = height > 1800 ? .65 : Math.min(devicePixelRatio || 1, coarse ? 1.1 : 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function pickActive() {
    const viewportCenter = innerHeight * .52;
    let winner = active;
    let nearest = Infinity;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
      if (distance < nearest) { nearest = distance; winner = section; }
    });
    attach(winner);
  }

  function color(alpha = .28) {
    if (active.id === 'product-work') {
      const bus = active.querySelector('[data-product="buslink"]')?.getBoundingClientRect();
      const kap = active.querySelector('[data-product="kapruka"]')?.getBoundingClientRect();
      const center = innerHeight / 2;
      return kap && Math.abs((kap.top + kap.bottom) / 2 - center) < Math.abs((bus.top + bus.bottom) / 2 - center)
        ? `rgba(115,169,144,${alpha})` : `rgba(102,130,255,${alpha})`;
    }
    if (['approach', 'media', 'achievement-wall', 'capabilities'].includes(active.id)) return `rgba(38,59,112,${alpha})`;
    if (active.id === 'background') return `rgba(130,148,255,${alpha})`;
    return `rgba(132,153,255,${alpha})`;
  }

  function drawParticles(time, delta) {
    particles.forEach((particle, index) => {
      if (!reducedMotion.matches) {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
      }
      if (particle.x < .02 || particle.x > .98) particle.vx *= -1;
      if (particle.y < .02 || particle.y > .98) particle.vy *= -1;
      if (pointer.active && !coarse && !reducedMotion.matches) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx * width, dy * height);
        const radius = Math.min(290, 190 + pointer.speed * 2600);
        if (distance < radius && distance > 0) {
          const force = Math.pow(1 - distance / radius, 1.35) * (.009 + Math.min(.026, pointer.speed * .32));
          particle.x += (dx * width / distance) * force;
          particle.y += (dy * height / distance) * force;
          particle.vx += (dx * width / distance) * force * .00013;
          particle.vy += (dy * height / distance) * force * .00013;
        }
      }
      particle.vx *= .998;
      particle.vy *= .998;
      particle.x = Math.max(-.08, Math.min(1.08, particle.x));
      particle.y = Math.max(-.08, Math.min(1.08, particle.y));
      const x = particle.x * width;
      const y = particle.y * height;
      context.fillStyle = color(.32 + (index % 5) * .035);
      context.beginPath();
      context.arc(x, y, index % 9 === 0 ? 2.8 : 1.65, 0, Math.PI * 2);
      context.fill();
    });
    for (let index = 1; index < particles.length; index += 3) {
      const a = particles[index - 1];
      const b = particles[index];
      const distance = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
      if (distance > 150) continue;
      context.strokeStyle = color((1 - distance / 150) * .2);
      context.beginPath(); context.moveTo(a.x * width, a.y * height); context.lineTo(b.x * width, b.y * height); context.stroke();
    }
  }

  function broadcast(time) {
    const video = active.querySelector('.tv-video-wrap')?.getBoundingClientRect();
    const section = active.getBoundingClientRect();
    if (!video) return;
    const cx = video.left - section.left + video.width / 2;
    const cy = video.top - section.top + video.height / 2;
    for (let ring = 0; ring < 4; ring += 1) {
      const radius = 45 + ((time * .035 + ring * 72) % 290);
      context.strokeStyle = color(.2 * (1 - radius / 360)); context.lineWidth = 1.2;
      context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.stroke();
    }
  }

  function processPath(time) {
    const section = active.getBoundingClientRect();
    const steps = [...active.querySelectorAll('.approach-step')];
    const points = steps.map(step => { const rect = step.getBoundingClientRect(); return { x: rect.left - section.left + 28, y: rect.top - section.top + rect.height / 2 }; });
    if (points.length < 2) return;
    context.strokeStyle = color(.24); context.lineWidth = 1.5; context.beginPath();
    points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)); context.stroke();
    const progress = reducedMotion.matches ? .55 : (time * .000055) % 1;
    const scaled = progress * (points.length - 1); const index = Math.min(points.length - 2, Math.floor(scaled)); const local = scaled - index;
    const x = points[index].x + (points[index + 1].x - points[index].x) * local;
    const y = points[index].y + (points[index + 1].y - points[index].y) * local;
    context.fillStyle = color(.95); context.beginPath(); context.arc(x, y, 5, 0, Math.PI * 2); context.fill();
  }

  function conversationLines(time) {
    const cards = [...active.querySelectorAll('.media-card')];
    const section = active.getBoundingClientRect();
    const origin = { x: width * .2, y: height * .26 };
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect(); const x = rect.left - section.left + rect.width / 2; const y = rect.top - section.top + rect.height / 2;
      context.strokeStyle = color(.16 + Math.sin(time * .001 + index) * .05); context.setLineDash([5, 8]);
      context.beginPath(); context.moveTo(origin.x, origin.y); context.quadraticCurveTo((origin.x + x) / 2, y - 70, x, y); context.stroke();
    }); context.setLineDash([]);
  }

  function productFlow(time) {
    const isKapruka = color(.5).includes('115,169,144');
    context.strokeStyle = color(.28); context.lineWidth = 1.4; context.beginPath();
    const lanes = isKapruka ? 6 : 4;
    for (let index = 0; index < lanes; index += 1) {
      const y = height * (.18 + index * (.64 / Math.max(1, lanes - 1)));
      context.moveTo(width * .06, y);
      context.bezierCurveTo(width * .3, y + Math.sin(index) * 55, width * .65, y - Math.cos(index) * 60, width * .94, y);
    } context.stroke();
    const progress = reducedMotion.matches ? .75 : (time * .00007) % 1;
    context.fillStyle = color(.9); context.beginPath(); context.arc(width * (.06 + progress * .88), height * (.5 + Math.sin(progress * Math.PI * 2) * .18), 4.5, 0, Math.PI * 2); context.fill();
  }

  function evidenceLinks() {
    const cells = [...active.querySelectorAll('.achievement-cell')];
    const section = active.getBoundingClientRect();
    const points = cells.map(cell => { const rect = cell.getBoundingClientRect(); return { x: rect.left - section.left + rect.width / 2, y: rect.top - section.top + rect.height / 2 }; });
    points.forEach((point, index) => {
      const focused = evidenceFocus === index;
      context.fillStyle = color(focused ? .95 : .4); context.beginPath(); context.arc(point.x, point.y, focused ? 7 : 4, 0, Math.PI * 2); context.fill();
      if (focused) { context.strokeStyle = color(.5); context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(pointer.x * width, pointer.y * height); context.stroke(); }
    });
  }

  function convergence(time, closing = false) {
    const cx = width / 2; const cy = closing ? height * .42 : height / 2;
    particles.forEach((particle, index) => {
      const familyX = closing ? cx : [width * .18, cx, width * .82][particle.family];
      const angle = index * 2.399963 + time * .00006;
      const radius = closing ? 40 + (index % 8) * 8 : 30 + (index % 6) * 7;
      particle.x += ((familyX + Math.cos(angle) * radius) / width - particle.x) * .012;
      particle.y += ((cy + Math.sin(angle) * radius) / height - particle.y) * .012;
    });
  }

  function draw(time = 0) {
    frame = 0;
    if (document.hidden) return;
    const delta = Math.min(40, time - last || 16); last = time;
    context.clearRect(0, 0, width, height);
    if (active.id === 'background') convergence(time);
    if (active.id === 'closing') convergence(time, true);
    drawParticles(time, delta);
    if (active.id === 'tv') broadcast(time);
    else if (active.id === 'approach') processPath(time);
    else if (active.id === 'media') conversationLines(time);
    else if (active.id === 'product-work') productFlow(time);
    else if (active.id === 'achievement-wall') evidenceLinks();
    pointer.speed *= .88;
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.achievement-cell').forEach((cell, index) => {
    cell.addEventListener('pointerenter', () => { evidenceFocus = index; });
    cell.addEventListener('pointerleave', () => { evidenceFocus = -1; });
    cell.addEventListener('pointermove', event => {
      const rect = active.getBoundingClientRect(); pointer.x = (event.clientX - rect.left) / width; pointer.y = (event.clientY - rect.top) / height;
    }, { passive: true });
  });
  if (!coarse) {
    addEventListener('pointermove', event => {
      const rect = active.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / Math.max(1, width);
      const nextY = (event.clientY - rect.top) / Math.max(1, height);
      pointer.speed = Math.min(.08, Math.hypot(nextX - pointer.lastX, nextY - pointer.lastY));
      pointer.lastX = pointer.x = nextX;
      pointer.lastY = pointer.y = nextY;
      pointer.active = true;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; pointer.speed = 0; }, { passive: true });
  }
  addEventListener('scroll', pickActive, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !frame) frame = requestAnimationFrame(draw); });
  reducedMotion.addEventListener('change', () => { if (!frame) frame = requestAnimationFrame(draw); });
  attach(sections[0]); pickActive(); resize(); frame = requestAnimationFrame(draw);
}
