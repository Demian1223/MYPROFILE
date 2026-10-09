const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

initialiseSiteParticles();

function initialiseSiteParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'site-particle-layer';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const count = coarsePointer ? 22 : Math.min(58, Math.max(44, Math.round(innerWidth / 27)));
  const particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .2,
    vy: (Math.random() - .5) * .2,
    size: index % 11 === 0 ? 2.8 : 1.55 + Math.random() * .65
  }));
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false, speed: 0, previousX: innerWidth / 2, previousY: innerHeight / 2 };
  let width = innerWidth;
  let height = innerHeight;
  let ratio = 1;
  let frame = 0;
  let last = 0;

  function resize() {
    width = innerWidth;
    height = innerHeight;
    ratio = Math.min(devicePixelRatio || 1, coarsePointer ? 1 : 1.4);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(time = 0) {
    frame = 0;
    if (document.hidden) return;
    const delta = Math.min(32, time - last || 16);
    last = time;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (!reducedMotion.matches) {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
      }

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      if (pointer.active && !coarsePointer && !reducedMotion.matches) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = Math.min(440, 250 + pointer.speed * 6);
        if (distance > 0 && distance < radius) {
          const force = Math.pow(1 - distance / radius, 1.25) * (2.2 + Math.min(8, pointer.speed * .12));
          particle.x += dx / distance * force;
          particle.y += dy / distance * force;
          particle.vx += dx / distance * force * .0025;
          particle.vy += dy / distance * force * .0025;
        }
      }

      particle.vx *= .997;
      particle.vy *= .997;

      context.shadowColor = 'rgba(120, 151, 255, .9)';
      context.shadowBlur = index % 11 === 0 ? 11 : 6;
      context.fillStyle = index % 5 === 0 ? 'rgba(255,255,255,.92)' : 'rgba(65,91,210,.9)';
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    });

    for (let a = 0; a < particles.length; a += 1) {
      for (let b = a + 1; b < particles.length; b += 1) {
        const first = particles[a];
        const second = particles[b];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance > 112) continue;
        context.strokeStyle = `rgba(74,101,218,${(1 - distance / 112) * .28})`;
        context.lineWidth = .75;
        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.stroke();
      }
    }

    pointer.speed *= .86;
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  if (!coarsePointer) {
    addEventListener('pointermove', event => {
      pointer.speed = Math.min(90, Math.hypot(event.clientX - pointer.previousX, event.clientY - pointer.previousY));
      pointer.previousX = pointer.x = event.clientX;
      pointer.previousY = pointer.y = event.clientY;
      pointer.active = true;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; pointer.speed = 0; }, { passive: true });
  }

  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !frame) frame = requestAnimationFrame(draw); });
  reducedMotion.addEventListener('change', () => { if (!frame) frame = requestAnimationFrame(draw); });
  resize();
  frame = requestAnimationFrame(draw);
}
