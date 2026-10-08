const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'projects/index.html', 'projects/buslink.html', 'projects/kapruka.html', 'projects/kapruka_new.html'];
const all = pages.map(read).join('\n');
const bus = read('projects/buslink.html');
const kap = read('projects/kapruka.html');
const motion = read('scripts/motion/index.js') + read('scripts/motion/homepage-motion.js') + read('scripts/motion/case-study-motion.js');
const three = read('scripts/three/hero-scene.js');

for (const page of pages) assert.match(read(page), /styles\/final\.css/, `${page} links final CSS`);
for (let i = 1; i <= 10; i++) assert.match(bus, new RegExp(`data-case-chapter="${String(i).padStart(2, '0')}"`), `BusLink chapter ${i}`);
for (let i = 1; i <= 16; i++) assert.match(kap, new RegExp(`data-case-chapter="${String(i).padStart(2, '0')}"`), `Kapruka chapter ${i}`);
assert.match(bus, /Not commercially launched/, 'BusLink status remains truthful');
assert.match(kap, /not shipped features or achieved outcomes/, 'Kapruka proposal status is explicit');
assert.match(kap, /Success Targets · Not Achieved Outcomes/, 'Kapruka targets are labelled');
assert.match(kap, /id="kap-limitations"/, 'Kapruka limitations are documented');
assert.match(motion, /gsap@3\.12\.5/, 'GSAP is version pinned');
assert.match(motion, /ScrollTrigger/, 'ScrollTrigger is integrated');
assert.doesNotMatch(motion, /Lenis/i, 'Lenis was not introduced');
assert.match(three, /window\.hero3DState/, 'Three.js exposes the shared motion state');
assert.match(all, /CV_PM\.pdf/, 'CV remains linked');
assert.match(all, /mailto:/, 'email remains linked');
assert.ok(fs.existsSync(path.join(root, 'README.md')), 'README exists');

const localRefs = [...all.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
for (const ref of localRefs) {
  if (/^(?:https?:|mailto:|tel:|javascript:)/.test(ref)) continue;
  const matchingPage = pages.find(page => read(page).includes(`"${ref}"`));
  const resolved = path.resolve(root, path.dirname(matchingPage || 'index.html'), ref.split('?')[0]);
  assert.ok(fs.existsSync(resolved), `local reference exists: ${ref}`);
}

console.log('PASS final case-study chapters, truthful claims, motion architecture, local references, metadata assets and documentation.');
