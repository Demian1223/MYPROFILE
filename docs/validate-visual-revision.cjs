const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('styles/final.css');
const script = read('script.js');
const motion = read('scripts/motion/homepage-motion.js');

assert.doesNotMatch(html, /scripts\/three\/hero-scene\.js|data-webgl-stage/, '3D hero was removed');
assert.match(script, /hero\.after\(tv\)[\s\S]*tv\.after\(approach\)[\s\S]*approach\.after\(media\)/, 'credibility-led runtime order exists');
assert.match(html, /id="tv"[^>]*data-chapter="02"/, 'Sirasa TV is chapter 02');
assert.match(html, /id="media"[^>]*data-chapter="04"/, 'Career Compass is chapter 04');
assert.match(html, /foundation-pillar--technology[\s\S]*Software\.png/, 'Software Engineering imagery is in Technology');
assert.match(html, /foundation-pillar--business[\s\S]*Business\.png/, 'Business Management imagery is in Business');
assert.match(css, /aspect-ratio: 1917 \/ 841/, 'BusLink homepage visual respects its intrinsic ratio');
assert.match(css, /\.phase-img img[\s\S]*height: auto !important[\s\S]*object-fit: contain !important/, 'case images preserve proportions');
assert.match(motion, /scrub: 0\.45/, 'product-thinking progression is reversible');
assert.match(motion, /pointermove/, 'evidence responds to pointer movement');
assert.match(read('projects/buslink.html'), /Not commercially launched/, 'BusLink academic status remains explicit');
assert.match(read('projects/kapruka.html'), /not shipped features or achieved outcomes/, 'Kapruka proposal status remains explicit');

const dimensions = JSON.parse(read('docs/image-dimensions.json').replace(/^\uFEFF/, ''));
const dimensionByAsset = new Map(Object.entries(dimensions).map(([file, size]) => [file.replace(/\\/g, '/').split('/assets/')[1], size]));
for (const page of ['index.html', 'projects/index.html', 'projects/buslink.html', 'projects/kapruka.html']) {
  for (const [tag] of read(page).matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/src="([^"]+)"/)?.[1]?.replace(/^\.\.\/assets\//, '').replace(/^assets\//, '');
    const width = Number(tag.match(/width="(\d+)"/)?.[1]);
    const height = Number(tag.match(/height="(\d+)"/)?.[1]);
    const expected = dimensionByAsset.get(src);
    if (!expected || !width || !height) continue;
    assert.equal(width, expected.width, `${page}: ${src} intrinsic width`);
    assert.equal(height, expected.height, `${page}: ${src} intrinsic height`);
  }
}

console.log('PASS visual revision: 3D hero removed, credibility order, reversible motion, education imagery and ratio-led media.');
