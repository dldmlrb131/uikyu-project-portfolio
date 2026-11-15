import {createArtPortal} from './art-portal.js';

const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
export const CURTAIN_OPEN_MS=1900;
export function exhibitionFrame(progress){const p=clamp(progress);return {scene:smooth(p),copy:smooth((p-.08)/.66),header:smooth((p-.68)/.3),hint:1-smooth(p/.15)};}
export function discoveryFrame(progress){const p=clamp(progress);return {copy:smooth(p/.34),detail:smooth((p-.2)/.38),art:smooth((p-.44)/.56)};}
export function contemplationFrame(progress){return {moment:1-smooth((progress-.12)/.38),space:smooth((progress-.38)/.42)};}

// Keep the room and paintings on one camera transform: never reflow the set.
export function museumTransform(width,height,progress,compact=width<=700){
 const p=clamp(progress);
 const top=compact?(height<=600?.52:height<760?.42:.36):height<=600?.24:.45;
 const scale=compact?.98-top:height<=600?.45:Math.min(.53,.81*height/Math.max(1,width));
 const left=!compact&&height<=600?width*.52:(width-width*scale)/2;
 return {x:left*p,y:height*top*p,scale:1+(scale-1)*p};
}

// Both directions finish on a clock, with a small deadband against wheel/trackpad jitter.
// Sample an active transition before reversing so its visible position never jumps.
function reveal(track,raw,now,{threshold=.18,reverseThreshold=.08,duration=1050,curve=smooth}={}){
 function advance(){
  if(track.started===null)return;
  const elapsed=clamp((now-track.started)/track.duration);
  track.value=track.from+(track.target-track.from)*curve(elapsed);
  if(elapsed===1){track.value=track.target;track.started=null;}
 }
 advance();
 const target=raw>=threshold?1:raw<=reverseThreshold?0:track.target;
 if(target!==track.target){
  track.from=track.value;track.target=target;
  track.duration=duration*Math.abs(target-track.value);
  track.started=track.duration>0?now:null;
 }
 return track.started!==null;
}

export function createExhibition({element,main,window:win=window,document:doc=document,preference,onReady=()=>{}}){
 const rest=main.querySelector('[data-exhibition-rest]'),enter=element.querySelector('[data-exhibition-enter]'),next=element.querySelector('[data-exhibition-next]'),copy=element.querySelector('.exhibition-copy'),sticky=element.querySelector('.exhibition-sticky'),museum=element.querySelector('.exhibition-museum');
 const discover=main.querySelector('[data-exhibition-discover]'),bridge=main.querySelector('[data-exhibition-bridge]');
 const moment=bridge?.querySelector('.contemplation-moment'),space=bridge?.querySelector('.contemplation-space');
 const header=doc.querySelector('#header'),footer=doc.querySelector('#footer');
 const introTrack={started:null,value:0,from:0,target:0},discoveryTrack={started:null,value:0,from:0,target:0};
 const portal=createArtPortal({window:win,document:doc,preference});
 let state='closed',timer=null,frame=null,disposed=false,geometry=null;
 const written=new WeakMap();
 const now=()=>win.performance?.now()??Date.now();
 function put(node,key,value){if(!node)return;const values=written.get(node)||new Map(),next=String(value);if(values.get(key)!==next){node.style.setProperty(key,next);values.set(key,next);written.set(node,values);}}
 function attribute(node,key,value){if(node&&node.getAttribute?.(key)!==String(value)){const values=written.get(node)||new Map(),next=String(value);if(values.get(key)!==next){node.setAttribute(key,next);values.set(key,next);written.set(node,values);}}}
 function property(node,key,value){if(node&&node[key]!==value)node[key]=value;}
 function setHeader(value){if(!header)return;put(header,'--exhibition-header',value);property(header,'inert',value<.04);attribute(header,'aria-hidden',value<.04);}
 function measure(){
  if(!geometry||geometry.scroll!==win.scrollY){
   geometry={scroll:win.scrollY,height:sticky.clientHeight||win.innerHeight,width:sticky.clientWidth||win.innerWidth,introRect:element.getBoundingClientRect(),discoverRect:discover?.getBoundingClientRect(),bridgeRect:bridge?.getBoundingClientRect()};
  }
  return geometry;
 }
 function paint(){
  if(frame!==null){win.cancelAnimationFrame(frame);frame=null;}
  if(disposed)return;
  const reduced=preference.matches||!win.requestAnimationFrame;if(element.dataset.reduced!==String(reduced)){element.dataset.reduced=String(reduced);geometry=null;}
  if(state!=='open'){setHeader(0);return;}
  // CSS pins against 100svh. Browser chrome may change innerHeight independently.
  const {height,width,introRect,discoverRect,bridgeRect}=measure(),time=now();
  const raw=clamp(-introRect.top/Math.max(1,introRect.height-height));
  const discoveryRaw=discoverRect?clamp((height*.2-discoverRect.top)/height):0;
  let moving=false;
  if(reduced){for(const track of [introTrack,discoveryTrack]){track.value=track.target=1;track.started=null;}}
  else{
   moving=reveal(introTrack,raw,time);
   moving=reveal(discoveryTrack,discoveryRaw,time,{threshold:.12,reverseThreshold:.05,duration:1750,curve:clamp})||moving;
  }
  const intro=exhibitionFrame(introTrack.value),discovery=discoveryFrame(discoveryTrack.value);
  const camera=museumTransform(width,height,reduced?0:intro.scene,win.innerWidth<=700);
  const thought=reduced?{moment:1,space:1}:contemplationFrame(clamp(-(bridgeRect?.top??0)/Math.max(1,(bridgeRect?.height??height)-height)));
  put(element,'--exhibition-scene',intro.scene);put(element,'--exhibition-copy',intro.copy);put(element,'--exhibition-hint',intro.hint);
  put(museum,'--museum-x',`${camera.x}px`);put(museum,'--museum-y',`${camera.y}px`);put(museum,'--museum-scale',camera.scale);
  attribute(copy,'aria-hidden',!reduced&&intro.copy<.02);setHeader(reduced||introRect.bottom<=height?1:intro.header);
  property(next,'hidden',reduced||introTrack.value>.95);
  if(next.hidden&&doc.activeElement===next)sticky.focus({preventScroll:true});
  put(discover,'--discovery-copy',discovery.copy);put(discover,'--discovery-detail',discovery.detail);put(discover,'--discovery-art',discovery.art);
  put(bridge,'--contemplation-moment',thought.moment);put(bridge,'--contemplation-space',thought.space);attribute(bridge,'data-reduced',reduced);
  attribute(moment,'aria-hidden',thought.moment<.02);attribute(space,'aria-hidden',thought.space<.02);
  if(moving&&!doc.hidden)schedule();
 }
 function schedule(){if(!disposed&&state==='open'&&frame===null&&!doc.hidden&&win.requestAnimationFrame)frame=win.requestAnimationFrame(paint);}
 function finish(){
  if(disposed||state!=='opening')return;
  if(timer!==null)win.clearTimeout(timer);timer=null;
  state='open';element.dataset.state=state;rest.hidden=false;enter.hidden=true;next.hidden=false;
  if(museum){museum.inert=false;museum.setAttribute('aria-hidden','false');}if(footer)footer.hidden=false;
  geometry=null;sticky.focus({preventScroll:true});paint();onReady();
 }
 function open(){if(disposed||state!=='closed')return;state='opening';element.dataset.state=state;enter.disabled=true;enter.setAttribute('aria-busy','true');if(preference.matches)finish();else timer=win.setTimeout(finish,CURTAIN_OPEN_MS);}
 function click(event){
  if(event.target.closest('[data-exhibition-enter]'))open();
  else if(state==='open'&&event.target.closest('[data-exhibition-link]'))portal.enter(event,event.target.closest('[data-exhibition-link]'));
  else if(state==='open'&&event.target.closest('[data-exhibition-next]')){const rect=element.getBoundingClientRect(),height=sticky.clientHeight||win.innerHeight;const travel=preference.matches?height:Math.max(0,rect.height-height);win.scrollTo({top:win.scrollY+rect.top+travel,left:0,behavior:preference.matches?'instant':'smooth'});}
 }
 function motion(){geometry=null;if(preference.matches&&state==='opening')finish();paint();onReady();}
 function resize(){geometry=null;schedule();}
 function visibility(){if(doc.hidden&&frame!==null){win.cancelAnimationFrame(frame);frame=null;}else schedule();}
 const sizeObserver=win.ResizeObserver?new win.ResizeObserver(resize):null;
 for(const node of [element,sticky,discover,bridge])if(node)sizeObserver?.observe(node);
 element.addEventListener('click',click);win.addEventListener('scroll',schedule,{passive:true});win.addEventListener('resize',resize);preference.addEventListener('change',motion);doc.addEventListener?.('visibilitychange',visibility);
 element.dataset.state=state;rest.hidden=true;if(museum){museum.inert=true;museum.setAttribute('aria-hidden','true');}if(footer)footer.hidden=true;paint();
 return {element,refresh(){geometry=null;paint();},destroy(){disposed=true;portal.destroy();sizeObserver?.disconnect();if(timer!==null)win.clearTimeout(timer);if(frame!==null)win.cancelAnimationFrame(frame);element.removeEventListener('click',click);win.removeEventListener('scroll',schedule);win.removeEventListener('resize',resize);preference.removeEventListener('change',motion);doc.removeEventListener?.('visibilitychange',visibility);if(footer)footer.hidden=false;if(header){header.inert=false;header.removeAttribute('aria-hidden');header.style.removeProperty('--exhibition-header');}}};
}
