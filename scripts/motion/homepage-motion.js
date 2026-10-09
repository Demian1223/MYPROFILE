export function initialiseHomepageMotion(gsap, ScrollTrigger) {
  const state = window.hero3DState;
  const mm = gsap.matchMedia();

  mm.add('(min-width: 821px)', () => {
    if (state) state.controlled = true;
    const heroTimeline = gsap.timeline({
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
    });
    if (state) heroTimeline.to(state, { progress: 1, cameraProgress: 1, lightProgress: 1, ease: 'none' }, 0);
    heroTimeline
      .to('.hero-copy', { yPercent: -4, ease: 'none' }, 0.2)
      .to('.hero-visual', { yPercent: -5, scale: 0.96, ease: 'none' }, 0.25);

    gsap.utils.toArray('.approach-step').forEach((step, index) => {
      gsap.fromTo(step, { x: index % 2 ? 42 : -42 }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: step, start: 'top 92%', end: 'center 58%', scrub: 0.45 }
      });
    });

    gsap.from('.product-chapter--buslink .product-chapter-visual', { xPercent: -9, rotateY: -5, ease: 'none', scrollTrigger: { trigger: '.product-chapter--buslink', start: 'top 88%', end: 'top 48%', scrub: 0.6 } });
    gsap.from('.product-chapter--kapruka .product-chapter-visual', { xPercent: 9, rotateY: 5, ease: 'none', scrollTrigger: { trigger: '.product-chapter--kapruka', start: 'top 88%', end: 'top 48%', scrub: 0.6 } });

    gsap.from('.foundation-pillar--technology', { x: -54, ease: 'none', scrollTrigger: { trigger: '.technology-business-system', start: 'top 88%', end: 'center 58%', scrub: 0.6 } });
    gsap.from('.foundation-pillar--business', { x: 54, ease: 'none', scrollTrigger: { trigger: '.technology-business-system', start: 'top 88%', end: 'center 58%', scrub: 0.6 } });
    gsap.from('.foundation-connector', { scale: 0.82, ease: 'none', scrollTrigger: { trigger: '.technology-business-system', start: 'top 84%', end: 'center 55%', scrub: 0.6 } });

    gsap.utils.toArray('.achievement-cell').forEach(cell => {
      const rotateX = gsap.quickTo(cell, 'rotationX', { duration: 0.35, ease: 'power2.out' });
      const rotateY = gsap.quickTo(cell, 'rotationY', { duration: 0.35, ease: 'power2.out' });
      cell.addEventListener('pointermove', event => {
        const rect = cell.getBoundingClientRect();
        rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 5);
        rotateX(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
      });
      cell.addEventListener('pointerleave', () => { rotateX(0); rotateY(0); });
    });
  });

  mm.add('(max-width: 820px)', () => {
    gsap.utils.toArray('.approach-step, .product-chapter, .capability-group').forEach(element => {
      gsap.from(element, { y: 18, duration: 0.5, ease: 'power1.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
    });
  });

  ScrollTrigger.batch('.achievement-cell', {
    start: 'top 88%', once: true,
    onEnter: elements => gsap.from(elements, { y: 24, duration: 0.65, stagger: 0.1, ease: 'power2.out' })
  });
  ScrollTrigger.batch('.leadership-part .reveal', {
    start: 'top 90%', once: true,
    onEnter: elements => gsap.from(elements, { y: 18, duration: 0.55, stagger: 0.07 })
  });
  gsap.from('#closing .closing-title', { y: 28, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: '#closing', start: 'top 72%', once: true } });
}
