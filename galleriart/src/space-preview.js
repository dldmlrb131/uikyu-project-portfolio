import {esc} from './domain.js';
import {ROOM_SCENES as spaces} from './room-scenes.js';

export function renderSpacePreview(works,{heading=true}={}){
 return `<section class="space-preview" data-space-preview aria-labelledby="space-title">${heading?`<div class="space-heading landing-reveal"><p class="eyebrow">ART, IN YOUR EVERYDAY LIFE</p><h2 id="space-title">그림이 머무는,<br>나의 공간을 상상해 보세요.</h2><p>거실에서, 일터에서, 좋아하는 카페에서.<br>그림 한 점이 바꾸는 분위기를 천천히 느껴보세요.</p></div>`:''}<div class="space-gallery"><div class="space-stage landing-reveal">${spaces.map((space,index)=>{const work=works.find(w=>w.id===space.work)||works[0];return `<div class="space-slide ${index===0?'is-current':''}" data-space-name="${space.name}" data-space-title="${space.title}" aria-hidden="${index!==0}"><img class="space-background" src="${space.image}" alt="" width="1536" height="1024" loading="lazy" decoding="async"><div class="space-hung-art" style="--art-top:${space.top}%;--art-width:${space.width}%"><img src="${esc(work.image)}" alt="${esc(work.title)}" width="${work.imageWidth||599}" height="${work.imageHeight||477}" loading="lazy" decoding="async"></div></div>`;}).join('')}</div><div class="space-controls"><div class="space-caption"><span class="space-current-name">${spaces[0].name}</span><p class="space-current-title">${spaces[0].title}</p></div><div class="space-buttons" role="group" aria-label="공간 장면 선택">${spaces.map((space,index)=>`<button type="button" data-space-select="${index}" aria-pressed="${index===0}">${space.name}</button>`).join('')}<button type="button" class="space-pause" data-space-toggle aria-pressed="false">자동 전환 멈추기</button></div></div><p class="space-note">공간과 작품 배치는 분위기를 위한 가상 연출이며 실제 크기를 재현하지 않습니다.</p></div></section>`;
}

export function createSpacePreview({element,window:win=window,document:doc=document,preference=win.matchMedia('(prefers-reduced-motion: reduce)')}){
 const slides=[...element.querySelectorAll('.space-slide')],choices=[...element.querySelectorAll('[data-space-select]')],toggle=element.querySelector('[data-space-toggle]');
 let index=0,paused=false,visible=!win.IntersectionObserver,timer=null,disposed=false,observer;
 const clear=()=>{if(timer!==null)win.clearTimeout(timer);timer=null;};
 function schedule(){clear();if(disposed||paused||!visible||doc.hidden||preference.matches||slides.length<2)return;timer=win.setTimeout(()=>{show((index+1)%slides.length);schedule();},7400);}
 function show(value){index=value;slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===index);slide.setAttribute('aria-hidden',String(i!==index));});choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));element.querySelector('.space-current-name').textContent=slides[index].dataset.spaceName;element.querySelector('.space-current-title').textContent=slides[index].dataset.spaceTitle;}
 function controls(){toggle.disabled=preference.matches;toggle.setAttribute('aria-pressed',String(paused||preference.matches));toggle.textContent=preference.matches?'자동 전환 꺼짐':paused?'자동 전환 재생':'자동 전환 멈추기';schedule();}
 function click(event){const choice=event.target.closest('[data-space-select]');if(choice){const value=Number(choice.dataset.spaceSelect);if(Number.isInteger(value)&&value>=0&&value<slides.length){paused=true;show(value);controls();}}else if(event.target.closest('[data-space-toggle]')&&!preference.matches){paused=!paused;controls();}}
 const visibility=()=>schedule(),motion=()=>controls();
 element.addEventListener('click',click);doc.addEventListener('visibilitychange',visibility);preference.addEventListener('change',motion);
 if(win.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);schedule();},{threshold:.2});observer.observe(element);}
 controls();
 return {element,destroy(){disposed=true;clear();observer?.disconnect();element.removeEventListener('click',click);doc.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',motion);}};
}
