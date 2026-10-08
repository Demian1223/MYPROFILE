const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const cheerio = require('../projects/node_modules/cheerio');

const root = path.resolve(__dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'phase-0-inventory.json'), 'utf8'));
const pages = [
  'index.html',
  'projects/index.html',
  'projects/buslink.html',
  'projects/kapruka.html',
  'projects/kapruka_new.html'
];

function verifyLocalReferences(file, $) {
  $('[src], [href], [poster]').each((_, element) => {
    for (const attribute of ['src', 'href', 'poster']) {
      const reference = $(element).attr(attribute);
      if (!reference || /^(https?:|mailto:|data:)/.test(reference)) continue;
      const [relativePath, fragment] = reference.split('#');
      const target = relativePath
        ? path.resolve(root, path.dirname(file), relativePath)
        : path.resolve(root, file);
      assert.ok(fs.existsSync(target), `${file}: missing ${reference}`);
      if (fragment && target.endsWith('.html')) {
        const targetPage = cheerio.load(fs.readFileSync(target, 'utf8'));
        assert.equal(targetPage(`#${fragment}`).length, 1, `${file}: missing fragment ${reference}`);
      }
    }
  });
}

for (const file of pages) {
  const $ = cheerio.load(fs.readFileSync(path.join(root, file), 'utf8'));
  assert.equal($('h1').length, 1, `${file}: expected one h1`);
  assert.equal($('#navbar.site-nav').length, 1, `${file}: main navigation missing`);
  assert.equal($('#lightbox[role="dialog"][aria-modal="true"]').length, 1, `${file}: dialog semantics missing`);
  assert.equal($('a[href$="CV_PM.pdf"]').length > 0, true, `${file}: CV link missing`);
  verifyLocalReferences(file, $);
}

const homepage = cheerio.load(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
assert.deepEqual(
  homepage('body > section').map((_, element) => homepage(element).attr('id')).get(),
  ['hero', 'approach', 'product-work', 'achievement-wall', 'capabilities', 'background', 'tv', 'media', 'batchrep', 'psychology', 'compere', 'closing']
);
for (const id of ['hero', 'approach', 'product-work', 'capabilities', 'background']) {
  assert.equal(homepage(`#${id}[data-scene]`).length, 1, `missing future scene hook: ${id}`);
}
assert.equal(homepage('.approach-step').length, 8, 'expected eight product-thinking steps');
assert.equal(homepage('.product-chapter').length, 2, 'expected two product chapters');
assert.equal(homepage('.capability-group').length, 4, 'expected four capability groups');
assert.equal(homepage('.product-decision-flow').length, 2, 'expected two decision summaries');
assert.match(homepage('#hero').text(), /Product × Technology × Business/i);
assert.match(homepage('#closing').text(), /people actually need/i);

for (const asset of baseline.assets) {
  const file = path.join(root, asset.path);
  assert.ok(fs.existsSync(file), `${asset.path}: original asset missing`);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(hash, asset.sha256, `${asset.path}: original asset changed`);
}

assert.ok(fs.readFileSync(path.join(root, 'projects/buslink.html'), 'utf8').includes('not presented as a commercially launched service'));
assert.ok(fs.readFileSync(path.join(root, 'projects/kapruka.html'), 'utf8').includes('does not claim'));
assert.equal(homepage('a[href="mailto:demiandesilva47@gmail.com"]').length > 0, true);
assert.equal(homepage('a[href*="linkedin.com/in/"]').length > 0, true);

console.log('PASS Phase 2 structure, scene hooks, links, claims, accessibility hooks and all 46 original asset hashes.');
