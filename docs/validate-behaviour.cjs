const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function createEnvironment(reduced=false,observer=true){
 const listeners={},observers=[],frames=new Map();let frameId=0;
 const motion={matches:reduced,addEventListener:(type,cb)=>{motion.change=cb;}};
 function el(tag='DIV',text=''){
  const classes=new Set(),events={};
  const e={tagName:tag,textContent:text,nodeType:1,childNodes:[],dataset:{},style:{setProperty(k,v){this[k]=v;}},attrs:{},inert:false,isConnected:true,
   classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),contains:n=>classes.has(n),toggle(n,on){on?classes.add(n):classes.delete(n);}},
   addEventListener:(t,cb)=>{(events[t]??=[]).push(cb);},emit(t,event={}){for(const cb of events[t]||[])cb(event);},
   setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},focus(){doc.activeElement=this;},
   getBoundingClientRect:()=>({height:120}),getClientRects:()=>[{}],querySelector:()=>null,querySelectorAll:()=>[],pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}};
  return e;
 }
 const body=el('BODY'),root=el('HTML'),nav=el('NAV'),box=el(),close=el('BUTTON'),img=el('IMG'),vid=el('VIDEO'),tv=el('VIDEO'),trigger=el('IMG'),tagline=el('DIV','Product & Project Manager');trigger.alt='Evidence';
 const counters=['11+','300+','99.65%'].map(full=>{const e=el();const number=full.startsWith('99')?'99':full.replace('+','');const suffix=full.slice(number.length);const text={nodeType:3,textContent:number,replaceWith(inner){e.childNodes[0]=inner;}};e.childNodes=[text,el('SPAN',suffix)];return e;});
 const ids={navbar:nav,lightbox:box,'lightbox-close':close,'lightbox-img':img,'lightbox-video':vid,'tv-video':tv,tagline};
 const doc={activeElement:trigger,body,documentElement:root,hidden:false,getElementById:id=>ids[id],createElement:t=>el(t.toUpperCase()),querySelectorAll:s=>s==='.achievement-num'?counters:s==='.reveal'?[el()]:s.includes('onclick')?[trigger]:[],addEventListener:(t,cb)=>{listeners[t]=cb;}};
 body.children=[nav,box,trigger];box.querySelectorAll=()=>[close,vid];box.contains=e=>[box,close,vid,img].includes(e);vid.getClientRects=()=>vid.style.display==='none'?[]:[{}];
 const window={scrollY:0,matchMedia:()=>motion,addEventListener(){}};
 if(observer)window.IntersectionObserver=true;
 class IO{constructor(cb){this.cb=cb;this.targets=[];observers.push(this);}observe(e){this.targets.push(e);}unobserve(e){this.targets=this.targets.filter(t=>t!==e);}}
 const context={window,document:doc,Node:{TEXT_NODE:3},IntersectionObserver:IO,ResizeObserver:class{observe(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:cb=>{frames.set(++frameId,cb);return frameId;},cancelAnimationFrame:id=>frames.delete(id)};
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../script.js','utf8'),context);
 return {context,motion,doc,nav,box,close,img,vid,tv,trigger,counters,listeners,observers,frames};
}
const e=createEnvironment();
assert.equal(e.doc.documentElement.style['--header-offset'],'136px');
const counterObserver=e.observers.find(o=>o.targets.includes(e.counters[0]));
counterObserver.cb(e.counters.map(target=>({target,isIntersecting:true})));
for(const timestamp of [0,800,1600]){const jobs=[...e.frames.values()];e.frames.clear();jobs.forEach(cb=>cb(timestamp));}
assert.deepEqual(e.counters.map(c=>c.childNodes.map(n=>n.textContent).join('')),['11+','300+','99.65%']);
counterObserver.cb(e.counters.map(target=>({target,isIntersecting:true})));assert.equal(e.frames.size,0);
e.trigger.addEventListener('click',()=>e.context.openLightbox('image','evidence.png'));
e.trigger.click=()=>e.trigger.emit('click');let prevented=false;
e.trigger.emit('keydown',{key:'Enter',preventDefault(){prevented=true;}});
assert.ok(prevented);assert.ok(e.box.classList.contains('open'));assert.equal(e.doc.activeElement,e.close);assert.equal(e.img.alt,'Evidence');assert.ok(e.nav.inert);
e.listeners.keydown({key:'Tab',shiftKey:false,preventDefault(){}});assert.equal(e.doc.activeElement,e.close);
e.listeners.keydown({key:'Escape'});assert.ok(!e.box.classList.contains('open'));assert.equal(e.doc.activeElement,e.trigger);assert.equal(e.nav.inert,false);
e.context.openLightbox('image','evidence.png');e.context.handleLightboxClick({target:e.box});assert.ok(!e.box.classList.contains('open'));
const videoObserver=e.observers.find(o=>o.targets.includes(e.tv));videoObserver.cb([{isIntersecting:true}]);assert.equal(e.tv.paused,false);videoObserver.cb([{isIntersecting:false}]);assert.equal(e.tv.paused,true);
const reduced=createEnvironment(true);const ro=reduced.observers.find(o=>o.targets.includes(reduced.counters[0]));ro.cb(reduced.counters.map(target=>({target,isIntersecting:true})));assert.equal(reduced.frames.size,0);assert.equal(reduced.counters[0].childNodes[0].textContent,'11');
createEnvironment(false,false);
console.log('PASS behavioural simulation: exact counters, one-shot animation, Enter activation, focus trap/return, Escape/backdrop close, inert restoration, video visibility, reduced motion, observer fallback');
console.log('NOTE: simulated DOM checks do not replace real-browser visual/accessibility testing.');
