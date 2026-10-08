export function detectQuality(stage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const mobile = touch || Math.min(window.innerWidth, stage.clientWidth) < 720;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  let tier = 'high';
  if (mobile || memory <= 4 || cores <= 4) tier = 'medium';
  if ((mobile && (memory <= 2 || cores <= 2)) || stage.clientWidth < 380) tier = 'low';
  if (reducedMotion) tier = mobile ? 'low' : 'medium';

  const settings = {
    high: { dpr: 1.75, segments: 18, transmission: true, animate: true },
    medium: { dpr: 1.35, segments: 12, transmission: true, animate: true },
    low: { dpr: 1.1, segments: 8, transmission: false, animate: false }
  }[tier];

  return { ...settings, tier, mobile, touch, reducedMotion };
}

export function webGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}
