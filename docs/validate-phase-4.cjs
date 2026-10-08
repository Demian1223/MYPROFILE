const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('styles/phase-3.css');
const hero = read('scripts/three/hero-scene.js');
const quality = read('scripts/three/quality.js');
const objects = read('scripts/three/objects.js');

assert.match(html, /data-webgl-stage/, 'hero mount exists');
assert.match(html, /type="module" src="scripts\/three\/hero-scene\.js"/, 'module entry is linked');
assert.match(hero, /three@0\.170\.0/, 'Three.js is version pinned');
assert.match(hero, /new THREE\.WebGLRenderer/, 'real WebGL renderer exists');
assert.match(hero, /stage\.prepend\(renderer\.domElement\)/, 'renderer mounts inside the stage');
assert.match(hero, /IntersectionObserver/, 'offscreen rendering is controlled');
assert.match(hero, /document\.hidden/, 'hidden tabs are handled');
assert.match(hero, /renderer\.setPixelRatio\(Math\.min/, 'DPR is capped');
assert.match(hero, /geometry\.dispose\(\)/, 'geometry cleanup exists');
assert.match(hero, /renderer\.dispose\(\)/, 'renderer cleanup exists');
assert.match(quality, /prefers-reduced-motion/, 'reduced motion is detected');
assert.match(quality, /high:[\s\S]*medium:[\s\S]*low:/, 'quality tiers exist');
assert.match(objects, /product-user/, 'Product/User form exists');
assert.match(objects, /technology/, 'Technology form exists');
assert.match(objects, /business/, 'Business form exists');
assert.match(objects, /separatedState/, 'separate state exists');
assert.match(objects, /alignedState/, 'aligned state exists');
assert.match(css, /\.hero-3d-stage canvas/, 'canvas is constrained by the hero stage');
assert.doesNotMatch([html, css, hero, quality, objects].join('\n'), /gsap|ScrollTrigger|Lenis/i, 'later-phase libraries are absent');

console.log('PASS Phase 4 architecture, scene states, quality controls, fallback hooks and scoped canvas.');
