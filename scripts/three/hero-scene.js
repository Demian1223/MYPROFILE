import { detectQuality, webGLAvailable } from './quality.js';
import { createMaterials, disposeMaterials } from './materials.js';
import { createAlignmentSystem, separatedState, alignedState, applyState } from './objects.js';

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const stage = document.querySelector('[data-webgl-stage]');
const hero = document.getElementById('hero');

if (stage && hero && !stage.dataset.webglMounted && webGLAvailable()) {
  initialise().catch(() => stage.classList.add('webgl-fallback'));
}

async function initialise() {
  const THREE = await import(THREE_URL);
  if (!stage.isConnected || stage.dataset.webglMounted) return;

  const quality = detectQuality(stage);
  const continuousMotion = quality.animate && !quality.mobile && !quality.reducedMotion;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0.15, quality.mobile ? 8.4 : 7.6);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: quality.tier !== 'low', powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.tabIndex = -1;
  stage.prepend(renderer.domElement);
  stage.dataset.webglMounted = 'true';
  stage.dataset.quality = quality.tier;
  stage.classList.add('webgl-ready');

  const materials = createMaterials(THREE, quality);
  const { system, panels, geometry } = createAlignmentSystem(THREE, materials, quality);
  scene.add(system);

  const ambient = new THREE.HemisphereLight(0xcfd7ff, 0x080a12, 1.35);
  const key = new THREE.DirectionalLight(0xffeee1, 3.2);
  key.position.set(-3.8, 4.5, 5.5);
  const rim = new THREE.PointLight(0x6682ff, 8, 16, 2);
  rim.position.set(4.5, 1.6, 3.2);
  scene.add(ambient, key, rim);

  const pointer = new THREE.Vector2();
  const targetPointer = new THREE.Vector2();
  const clock = new THREE.Clock();
  let intro = quality.reducedMotion ? 1 : 0;
  let alignment = quality.reducedMotion ? 1 : 0;
  let visible = true;
  let frame = 0;

  const resize = () => {
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    system.scale.setScalar(quality.mobile ? Math.min(1, width / 410) : 1);
  };

  const updateScroll = () => {
    if (quality.reducedMotion) return;
    const rect = hero.getBoundingClientRect();
    alignment = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height * 0.62), 0, 1), 0, 1);
  };

  const updatePointer = event => {
    if (quality.touch || quality.reducedMotion) return;
    const rect = stage.getBoundingClientRect();
    targetPointer.set(
      THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      THREE.MathUtils.clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1), -1, 1)
    );
  };

  const render = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    const elapsed = clock.getElapsedTime();
    if (!quality.reducedMotion) intro = Math.min(1, intro + 0.018);
    const easedIntro = 1 - Math.pow(1 - intro, 3);
    pointer.lerp(targetPointer, 0.045);
    applyState(THREE, panels, separatedState, alignedState, alignment);
    const responsiveScale = quality.mobile ? Math.min(1, stage.clientWidth / 410) : 1;
    system.scale.setScalar(responsiveScale * (0.86 + easedIntro * 0.14));
    system.position.y = THREE.MathUtils.lerp(-0.18, 0.04, easedIntro) + alignment * 0.18;
    system.position.z = THREE.MathUtils.lerp(-1.2, 0, easedIntro) - alignment * 0.35;
    system.rotation.x = pointer.y * 0.055;
    system.rotation.y = pointer.x * 0.085;
    if (continuousMotion) {
      system.position.y += Math.sin(elapsed * 0.55) * 0.035 * (1 - alignment);
      panels.forEach((panel, index) => { panel.position.z += Math.sin(elapsed * 0.42 + index * 1.7) * 0.018 * (1 - alignment); });
    }
    rim.position.x = 4.5 + pointer.x * 1.2;
    rim.intensity = 8 - alignment * 2.2;
    renderer.render(scene, camera);
    if (continuousMotion || intro < 1 || Math.abs(pointer.x - targetPointer.x) > 0.001 || Math.abs(pointer.y - targetPointer.y) > 0.001) frame = requestAnimationFrame(render);
  };

  const requestRender = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); };
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestRender();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin: '100px' });

  resize();
  updateScroll();
  applyState(THREE, panels, separatedState, alignedState, alignment);
  visibilityObserver.observe(hero);
  const onScroll = () => { updateScroll(); requestRender(); };
  const onPointerMove = event => { updatePointer(event); requestRender(); };
  const onPointerLeave = () => { targetPointer.set(0, 0); requestRender(); };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', requestRender);
  requestRender();

  window.addEventListener('pagehide', () => {
    visibilityObserver.disconnect();
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', requestRender);
    geometry.dispose();
    disposeMaterials(materials);
    renderer.dispose();
  }, { once: true });
}
