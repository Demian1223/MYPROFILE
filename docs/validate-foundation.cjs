const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),cheerio=require('../projects/node_modules/cheerio');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/phase-0-inventory.json'),'utf8'));
const root=path.join(__dirname,'..');
for(const [file,old] of Object.entries(baseline.pages)) {
 const $=cheerio.load(fs.readFileSync(path.join(root,file),'utf8'));
 assert.deepEqual($('h1,h2,h3').map((i,e)=>$(e).text().replace(/\s+/g,' ').trim()).get(),old.headings,file+' headings preserved');
 assert.deepEqual($('section[id]').map((i,e)=>$(e).attr('id')).get(),old.sections,file+' sections preserved');
 assert.deepEqual($('a[href]').map((i,e)=>$(e).attr('href')).get(),old.links,file+' links preserved');
 const text=$('body').text().replace(/\s+/g,' ').trim().replace(/\u00a9 2026/g,'\u00a9 2025');
 assert.equal(text,old.text,file+' full body text preserved except footer date');
 assert.equal($('#navbar.site-nav').length,1);
 assert.equal($('#lightbox[role="dialog"][aria-modal="true"]').length,1);
 $('[onclick*="openLightbox"]').each((i,e)=>{assert.equal($(e).attr('tabindex'),'0');assert.equal($(e).attr('role'),'button');});
 $('img[src]').each((i,e)=>{if(!$(e).attr('src'))return;assert.ok($(e).attr('width'));assert.ok($(e).attr('height'));assert.ok($(e).attr('loading'));});
 $('[src],[href],[poster]').each((i,e)=>{for(const attr of ['src','href','poster']){const v=$(e).attr(attr);if(!v||/^(https?:|mailto:|data:)/.test(v))continue;const [p,hash]=v.split('#');const target=p?path.resolve(root,path.dirname(file),p):path.join(root,file);assert.ok(fs.existsSync(target),file+' missing '+v);if(hash&&target.endsWith('.html')){const dest=cheerio.load(fs.readFileSync(target,'utf8'));assert.ok(dest('[id]').toArray().some(e=>dest(e).attr('id')===hash),file+' missing anchor '+v);}}});
 console.log('PASS content, headings, links, media, dialog:',file);
}
for(const asset of baseline.assets){const f=path.join(root,asset.path);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),asset.sha256,asset.path+' unchanged');}
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');assert.ok(!/^\s*nav(?:\.scrolled)?\s*\{/m.test(css));assert.ok(!css.includes('@import'));assert.match(css,/prefers-reduced-motion/);assert.match(css,/scroll-padding-top/);assert.match(css,/\.reveal\s*\{\s*opacity: 1/);
console.log('PASS all 46 original assets unchanged; scoped CSS, reduced motion, default visibility');
