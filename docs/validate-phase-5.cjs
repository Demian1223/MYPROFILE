const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles/phase-3.css'), 'utf8');

const chapters = [
  ['hero', 'identity', '01'],
  ['tv', 'credibility', '02'],
  ['approach', 'approach', '03'],
  ['media', 'communication', '04'],
  ['product-work', 'product-work', '05'],
  ['achievement-wall', 'product-evidence', '06'],
  ['capabilities', 'capabilities', '07'],
  ['background', 'technology-business', '08'],
  ['leadership', 'leadership', '09'],
  ['closing', 'contact', '10']
];

for (const [id, scene, number] of chapters) {
  const pattern = new RegExp(`id="${id}"[^>]*data-scene="${scene}"[^>]*data-chapter="${number}"`);
  assert.match(html, pattern, `chapter ${number} (${id}) has semantic hooks`);
}

assert.equal((html.match(/class="approach-step" data-step=/g) || []).length, 8, 'eight product-thinking steps remain');
assert.match(html, /class="chapter-axis" aria-hidden="true"/, 'decorative hero handoff is hidden from assistive technology');
assert.match(html, /class="product-meta-grid" aria-label="BusLink project metadata"/, 'BusLink metadata exists');
assert.match(html, /class="product-meta-grid" aria-label="Kapruka project metadata"/, 'Kapruka metadata exists');
assert.match(html, /Proposed solution and target metrics/, 'Kapruka status is explicitly proposed');
assert.equal((html.match(/class="achievement-source"/g) || []).length, 3, 'each evidence metric has context');
assert.equal((html.match(/class="capability-group"/g) || []).length, 4, 'four capability families remain');
assert.match(html, /Leadership &amp; Communication/, 'leadership chapter framing exists');
assert.match(html, /mailto:demiandesilva47@gmail\.com/, 'contact email remains');
assert.match(html, /assets\/PDFS\/CV_PM\.pdf/, 'CV remains linked');
assert.doesNotMatch(html, /scripts\/three\/hero-scene\.js|data-webgl-stage/, 'removed WebGL hero is not mounted');
assert.match(css, /\.evidence-intro/, 'evidence composition is styled');
assert.match(css, /\.leadership-intro/, 'leadership composition is styled');
assert.match(css, /@media \(max-width: 520px\)/, 'mobile treatment remains');
assert.doesNotMatch([html, css].join('\n'), /Lenis|ScrollTrigger|gsap/i, 'later-phase animation libraries are absent');

console.log('PASS Phase 5 chapter order, narrative hooks, evidence context, links, responsive hooks and scope boundaries.');
