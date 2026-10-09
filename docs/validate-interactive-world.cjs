const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('styles/final.css');
const world = read('scripts/interactive/hero-world.js');
const ambient = read('scripts/interactive/ambient-story.js');

assert.match(html, /id="hero-dot-field"/, 'hero Canvas exists');
assert.match(html, /class="hero-guide-illustration"/, 'SVG personal guide exists');
assert.match(html, /class="guide-portrait"[^>]*assets\/images\/Me\.jpeg/, 'personal guide uses Demian portrait');
assert.match(html, /class="story-guide-avatar"[^>]*assets\/images\/Me\.jpeg/, 'floating guide uses Demian portrait');
assert.doesNotMatch(html, /guide-head|guide-hair|guide-arm/, 'former stick figure was removed');
assert.match(html, /USER NEEDS[\s\S]*TECHNOLOGY[\s\S]*BUSINESS/, 'illustrated world contains the three domains');
assert.match(html, /id="story-guide"/, 'homepage guide exists');
assert.match(html, /scripts\/interactive\/hero-world\.js/, 'interactive module is linked');
assert.match(html, /scripts\/interactive\/ambient-story\.js/, 'ambient chapter system is linked');
assert.doesNotMatch(html, /scripts\/three\/hero-scene\.js|data-webgl-stage/, 'Three.js hero remains removed');
assert.match(world, /pointermove/, 'pointer reaction exists');
assert.match(world, /IntersectionObserver/, 'visibility and chapter observers exist');
assert.match(world, /prefers-reduced-motion/, 'reduced motion is respected');
assert.match(world, /coarse \? 34 : 76/, 'mobile dot count is reduced');
assert.match(world, /Product connects technology and business/, 'guide narrative covers the product connection');
assert.match(css, /\.story-guide\.is-visible/, 'guide visibility is styled');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, 'static reduced-motion CSS exists');
for (const motif of ['broadcast', 'processPath', 'conversationLines', 'productFlow', 'evidenceLinks', 'convergence']) {
  assert.match(ambient, new RegExp(motif), `${motif} ambient motif exists`);
}
assert.match(ambient, /height > 1800 \? \.65/, 'large chapters use a reduced canvas resolution');
assert.match(ambient, /radius = Math\.min\(290, 190 \+ pointer\.speed \* 2600\)/, 'cursor speed expands the particle reaction radius');
assert.match(ambient, /addEventListener\('pointermove'/, 'ambient particles follow pointer movement throughout the homepage');

console.log('PASS interactive Canvas field, SVG guide, chapter narrative, mobile simplification and reduced-motion fallback.');
