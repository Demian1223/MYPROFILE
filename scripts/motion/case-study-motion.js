export function initialiseCaseStudyMotion(gsap, ScrollTrigger) {
  const chapters = gsap.utils.toArray('.case-chapter');
  const links = gsap.utils.toArray('.case-progress a');

  chapters.forEach(chapter => {
    const content = chapter.querySelector('.phase-entry, .reveal') || chapter;
    content.classList.add('motion-reveal');
    gsap.from(content, {
      y: 28, opacity: 0.55, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: chapter, start: 'top 84%', once: true }
    });
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: self => {
        if (!self.isActive) return;
        links.forEach(link => link.removeAttribute('aria-current'));
        const active = links.find(link => link.hash === `#${chapter.id}`);
        active?.setAttribute('aria-current', 'true');
      }
    });
  });
}
