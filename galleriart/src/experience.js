// Small progressive enhancements: native scrolling and content work without motion.
import {createLandingMotion} from './landing-motion.js';
import {createSpacePreview} from './space-preview.js';
import {createExhibition} from './exhibition.js';
export function createExperience({main,window:win=window,document:doc=document}){
  const preference=win.matchMedia('(prefers-reduced-motion: reduce)');
  const landingMotion=createLandingMotion({main,window:win,preference});
  const animations=new Set(), positions=new Map(), revealed=new WeakSet();
  let observer, changes, spacePreview, exhibition, entry, previous=false, depth=win.history.state?.galleryDepth??-1;
  const reduced=()=>preference.matches;
  function animate(element,frames,options){
    if(reduced()||!element.animate)return;
    const animation=element.animate(frames,options);
    animations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
  }
  function stop(){for(const animation of animations)animation.cancel();animations.clear();}
  function remember(){if(entry)positions.set(entry,{y:win.scrollY,focus:doc.activeElement?.closest('a[href^="#/"]')?.getAttribute('href')});}
  function identify(){
    entry=win.history.state?.galleryEntry;
    if(!entry){entry=win.crypto.randomUUID();depth++;win.history.replaceState({...win.history.state,galleryEntry:entry,galleryDepth:depth},'');}
    else depth=win.history.state.galleryDepth??0;
    if(positions.size>100)positions.delete(positions.keys().next().value);
  }
  win.history.scrollRestoration='manual';identify();
  doc.addEventListener('click',event=>{if(event.target.closest('a[href^="#/"]'))remember();},true);
  win.addEventListener('scroll',remember,{passive:true});
  win.addEventListener('popstate',()=>{previous=positions.has(win.history.state?.galleryEntry);});
  preference.addEventListener('change',()=>{stop();refresh();});
  doc.addEventListener('focusin',()=>{stop();});
  function refresh(){
    // Explicit navigation already consumed this render; do not lay it out again in a microtask.
    changes?.takeRecords?.();
    const stage=main.querySelector?.('[data-exhibition]');
    if(exhibition?.element!==stage){exhibition?.destroy();exhibition=stage?createExhibition({element:stage,main,window:win,document:doc,preference,onReady:refresh}):null;}
    exhibition?.refresh();
    const space=main.querySelector?.('[data-space-preview]');
    if(spacePreview?.element!==space){spacePreview?.destroy();spacePreview=space?createSpacePreview({element:space,window:win,document:doc,preference}):null;}
    landingMotion.refresh();
    observer?.disconnect();
    if(reduced()||!win.IntersectionObserver)return;
    observer=new win.IntersectionObserver(entries=>{
      for(const item of entries){if(!item.isIntersecting||revealed.has(item.target))continue;
        revealed.add(item.target);
        observer.unobserve(item.target);
        const landing=item.target.classList?.contains('landing-reveal');
        animate(item.target,[{opacity:landing?0:.25,transform:`translateY(${landing?28:18}px)`},{opacity:1,transform:'none'}],{duration:landing?800:460,easing:'cubic-bezier(.22,1,.36,1)'});
      }
    },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    for(const element of main.querySelectorAll('.art-card,.unknown-teaser>*,.journey-step,.more-works,.about-layout>*,.artist-hero>*,.collection-note,.landing-reveal')){
      if(revealed.has(element))continue;
      if(element.getBoundingClientRect().top>win.innerHeight*.9)observer.observe(element);
      else revealed.add(element);
    }
  }
  changes=new win.MutationObserver(refresh);
  changes.observe(main,{childList:true});
  function enter(){
    stop();if(!main.classList?.contains('landing-main'))animate(main,[{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'});
    refresh();
  }
  function navigate(render){
    const target=previous?positions.get(win.history.state?.galleryEntry):null;
    previous=false;identify();stop();render();
    win.scrollTo({top:target?.y||0,left:0,behavior:'instant'});
    const link=target?.focus?[...main.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')===target.focus):null;
    (link||main).focus({preventScroll:true});
    enter();
  }
  return {enter,refresh,navigate,remember,hasPrevious:()=>depth>0};
}
