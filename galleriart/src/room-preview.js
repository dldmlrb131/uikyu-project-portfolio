import {esc} from './domain.js';
import {ROOM_SCENES} from './room-scenes.js';

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
export function roomPlacement({workWidth,artAspect,sceneAspect,referenceCm,start=0,end=1,x=.5,y=.35}){
 const requested=workWidth/referenceCm*(end-start),height=requested*sceneAspect/artAspect;
 const fit=Math.min(1,.94/requested,.88/height),width=requested*fit,h=height*fit;
 return {width,height:h,x:clamp(x,width/2,1-width/2),y:clamp(y,h/2,1-h/2),fitted:fit<.999};
}
export function validateRoomPhoto(file){
 const supported=/^image\/(jpeg|png|webp|avif|heic|heif)$/i.test(file?.type||'')||(!file?.type&&/\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file?.name||''));
 if(!supported||file.size<=0||file.size>20*1024*1024)throw new Error('20MB 이하의 JPG, PNG, WEBP, AVIF 또는 HEIC 사진을 선택해 주세요.');
}
async function decodePhoto(src){const image=new Image();image.src=src;await image.decode();if(!image.naturalWidth||!image.naturalHeight)throw new Error('image');return {width:image.naturalWidth,height:image.naturalHeight};}
// Only object URLs in this tab: no upload, storage, third-party processing or EXIF export.
export function createRoomPhotoStore({urls=URL,decode=decodePhoto}={}){
 let photo=null,revision=0;
 return {get current(){return photo;},cancelPending(){revision++;},clear(){revision++;if(photo)urls.revokeObjectURL(photo.url);photo=null;},
  async replace(file){const version=++revision;validateRoomPhoto(file);const url=urls.createObjectURL(file);
   try{const size=await decode(url);if(version!==revision){urls.revokeObjectURL(url);return null;}
    if(size.width>16000||size.height>16000||size.width<=0||size.height<=0)throw new Error('image');
    const previous=photo;photo={url,aspect:size.width/size.height};if(previous)urls.revokeObjectURL(previous.url);return photo;
   }catch(error){urls.revokeObjectURL(url);if(version!==revision)return null;throw new Error('이 사진을 읽을 수 없습니다. HEIC 사진은 JPG로 저장해 다시 선택해 주세요.');}
  }};
}

export function renderRoomPreview(work){return `<p class="eyebrow">IN YOUR SPACE</p><h2>내 공간에 놓아보기</h2><p class="room-intro">배경을 고르거나 내 사진을 넣고, 그림을 움직여 비교해 보세요.</p>
 <div class="room-preview-layout"><div class="room-preview-visual">
  <div class="room-backgrounds" role="group" aria-label="작품 배경 선택">${ROOM_SCENES.map(scene=>`<button type="button" data-room-scene="${scene.id}" aria-label="${scene.name} 배경" aria-pressed="false"><img decoding="async" src="${scene.image}" alt="" width="1536" height="1024"><span>${scene.name}</span></button>`).join('')}<button type="button" data-room-scene="photo" hidden aria-pressed="false">내 사진</button></div>
  <div class="room-photo-actions"><button type="button" data-room-pick="file">사진 첨부</button><button type="button" data-room-pick="camera">카메라 촬영</button></div>
  <div class="room-scene"><div class="room-canvas"><img decoding="async" class="room-photo" alt="거실 배경" src="${ROOM_SCENES[0].image}" draggable="false"><button type="button" class="room-placed-art" data-room-drag="art" aria-label="그림 위치 조절. 드래그하거나 방향키를 사용하세요."><img decoding="async" src="${esc(work.image)}" alt="${esc(work.title)}" width="${work.imageWidth}" height="${work.imageHeight}" draggable="false"></button>
   <div class="room-reference" hidden><button type="button" class="room-reference-line" data-room-drag="reference" aria-label="기준선 이동. 드래그하거나 방향키를 사용하세요."></button><button type="button" class="room-reference-start" data-room-drag="start" aria-label="기준선 왼쪽 끝 조절"></button><button type="button" class="room-reference-end" data-room-drag="end" aria-label="기준선 오른쪽 끝 조절"></button><span class="room-reference-label" aria-hidden="true"></span></div>
  </div></div><p class="room-scene-caption">거실 · 가상 연출</p><p class="room-fit-note" hidden>화면에 맞춘 축소 보기 · 기준 길이를 늘리면 비례를 비교할 수 있어요.</p>
 </div><div class="room-adjustments"><h3>배치와 크기 조절</h3><input type="file" data-room-file="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" hidden tabindex="-1"><input type="file" data-room-file="camera" accept="image/*" capture="environment" hidden tabindex="-1"><p class="room-local-note">사진은 이 탭에서만 사용되며 서버에 저장되지 않습니다.</p><p class="room-file-status" role="status" aria-live="polite"></p><button type="button" class="room-remove-photo" data-room-remove hidden>내 사진 지우기</button>
  <div class="room-measure"><label for="room-reference-cm">기준 길이 (cm)</label><div class="room-measure-row"><input id="room-reference-cm" type="number" min="20" max="2000" step="1" value="240" inputmode="decimal"><span>cm</span></div><input type="range" data-room-size min="60" max="800" step="10" value="240" aria-label="기준 길이 조절"><p class="room-reference-help">배경 전체 가로 폭의 가정값입니다.</p><button type="button" data-room-calibrate aria-pressed="false">사진 속 기준선 맞추기</button><p class="room-calibration-help" hidden>그림을 걸 벽과 같은 면에서 길이를 아는 가로 구간에 양 끝을 맞추고, 실제 길이를 입력하세요.</p></div>
  <label class="room-position-label">가로 위치<input type="range" data-room-x min="0" max="100" value="50"></label><label class="room-position-label">세로 위치<input type="range" data-room-y min="0" max="100" value="35"></label><button type="button" class="room-reset" data-room-reset>배치 초기화</button>
  <p class="room-work-dimensions" data-user-content>${esc(work.title)}<br>${work.width} × ${work.height} cm</p><p class="room-size-note">작품 치수는 시연값이며 액자는 제외합니다. 사진의 원근·촬영 각도에 따라 차이가 나는 평면 비교입니다.</p>
 </div></div>`;}

export function createRoomPreview({element,work,photos,session}){
 const find=selector=>element.querySelector(selector),canvas=find('.room-canvas'),art=find('.room-placed-art'),background=find('.room-photo'),reference=find('.room-reference');
 const nodes=Object.fromEntries(['.room-fit-note','.room-scene-caption','#room-reference-cm','[data-room-size]','[data-room-x]','[data-room-y]','[data-room-remove]','[data-room-calibrate]','.room-calibration-help','.room-reference-help','.room-reference-label'].map(selector=>[selector,find(selector)]));
 const scenes=[...element.querySelectorAll('[data-room-scene]')],texts=new WeakMap(),styles=new WeakMap();
 const value=(selector,next)=>{const node=nodes[selector];if(node.value!==String(next))node.value=next;};
 const hidden=(node,next)=>{if(node.hidden!==next)node.hidden=next;};
 const attribute=(node,name,next)=>{if(node.getAttribute(name)!==String(next))node.setAttribute(name,String(next));};
 const style=(node,name,next)=>{const values=styles.get(node)||{};if(values[name]!==next){node.style[name]=next;values[name]=next;styles.set(node,values);}};
 const text=(selector,next)=>{const node=nodes[selector];if(texts.get(node)!==next){texts.set(node,next);node.textContent=next;}};
 let disposed=false,showReference=false,drag=null,frame=null,lastScene=null;
 const win=element.ownerDocument.defaultView;
 function schedule(){if(frame===null)frame=win.requestAnimationFrame(()=>{frame=null;paint();});}
 const settings=session.settings||(session.settings={});
 const setting=()=>settings[session.background]||(settings[session.background]={x:.5,y:.35,cm:session.background==='photo'?180:240,start:session.background==='photo'?.2:0,end:session.background==='photo'?.8:1,lineY:.72});
 function paint(){
  if(disposed)return;if(session.background==='photo'&&!photos.current)session.background='living';
  const own=session.background==='photo',scene=own?photos.current:ROOM_SCENES.find(s=>s.id===session.background)||ROOM_SCENES[0],s=setting();
  const image=own?scene.url:scene.image;
  if(lastScene!==scene){lastScene=scene;if(background.getAttribute('src')!==image)background.src=image;background.alt=own?'내 사진 배경':scene.name+' 배경';canvas.style.setProperty('--room-aspect',scene.aspect);}
  const placed=roomPlacement({workWidth:work.width,artAspect:(work.imageWidth||work.width)/(work.imageHeight||work.height),sceneAspect:scene.aspect,referenceCm:s.cm,start:s.start,end:s.end,x:s.x,y:s.y});
  s.x=placed.x;s.y=placed.y;style(art,'width',placed.width*100+'%');style(art,'left',s.x*100+'%');style(art,'top',s.y*100+'%');
  hidden(nodes['.room-fit-note'],!placed.fitted);
  for(const button of scenes){attribute(button,'aria-pressed',button.dataset.roomScene===session.background);if(button.dataset.roomScene==='photo')hidden(button,!photos.current);}
  text('.room-scene-caption',own?'내 사진 · 평면 배치 비교':scene.name+' · 가상 연출');
  value('#room-reference-cm',s.cm);value('[data-room-size]',clamp(s.cm,60,800));value('[data-room-x]',Math.round(s.x*100));value('[data-room-y]',Math.round(s.y*100));
  hidden(nodes['[data-room-remove]'],!photos.current);hidden(nodes['[data-room-calibrate]'],!own);attribute(nodes['[data-room-calibrate]'],'aria-pressed',own&&showReference);hidden(nodes['.room-calibration-help'],!(own&&showReference));
  text('.room-reference-help',own?'기준선으로 표시한 구간의 실제 길이입니다.':'배경 전체 가로 폭의 가정값입니다.');
  hidden(reference,!(own&&showReference));style(reference,'left',s.start*100+'%');style(reference,'width',(s.end-s.start)*100+'%');style(reference,'top',s.lineY*100+'%');text('.room-reference-label',s.cm+' cm');
 }
 async function upload(input){const file=input.files?.[0];input.value='';if(!file)return;const status=find('.room-file-status');status.textContent='사진을 불러오는 중입니다.';status.setAttribute('aria-busy','true');
  try{const photo=await photos.replace(file);if(disposed||!photo)return;delete settings.photo;session.background='photo';showReference=true;status.textContent='사진이 배경에 적용되었습니다.';paint();if(window.innerWidth<=760)canvas.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  catch(error){if(!disposed)status.textContent=error.message;}finally{if(!disposed)status.removeAttribute('aria-busy');}
 }
 function click(event){const button=event.target.closest('button');if(!button)return;
  if(button.dataset.roomScene){photos.cancelPending();find('.room-file-status').textContent='';find('.room-file-status').removeAttribute('aria-busy');session.background=button.dataset.roomScene;showReference=false;paint();}
  else if(button.dataset.roomPick)find(`[data-room-file="${button.dataset.roomPick}"]`).click();
  else if(button.hasAttribute('data-room-calibrate')){showReference=!showReference;paint();}
  else if(button.hasAttribute('data-room-reset')){const s=setting();s.x=.5;s.y=.35;paint();}
  else if(button.hasAttribute('data-room-remove')){photos.clear();delete settings.photo;session.background='living';find('.room-file-status').textContent='';find('.room-file-status').removeAttribute('aria-busy');paint();}
 }
 function input(event){const target=event.target,s=setting();
  if(target.id==='room-reference-cm'||target.hasAttribute('data-room-size')){const value=Number(target.value);if(!Number.isFinite(value)||value<20||value>2000)return;s.cm=value;}
  else if(target.hasAttribute('data-room-x'))s.x=Number(target.value)/100;
  else if(target.hasAttribute('data-room-y'))s.y=Number(target.value)/100;else return;paint();
 }
 function change(event){if(event.target.hasAttribute('data-room-file'))upload(event.target);}
 function pointerDown(event){const target=event.target.closest('[data-room-drag]');if(!target||event.button>0)return;event.preventDefault();const rect=canvas.getBoundingClientRect();drag={target,kind:target.dataset.roomDrag,id:event.pointerId,rect,px:event.clientX,py:event.clientY,initial:{...setting()}};target.setPointerCapture(event.pointerId);target.focus({preventScroll:true});}
 function shift(kind,dx,dy,initial,defer=false){const s=setting();if(kind==='art'){s.x=initial.x+dx;s.y=initial.y+dy;}
  else if(kind==='start')s.start=clamp(initial.start+dx,0,s.end-.05);
  else if(kind==='end')s.end=clamp(initial.end+dx,s.start+.05,1);
  else{const amount=clamp(dx,-initial.start,1-initial.end);s.start=initial.start+amount;s.end=initial.end+amount;s.lineY=clamp(initial.lineY+dy,.05,.95);}if(defer)schedule();else paint();}
 function pointerMove(event){if(!drag||event.pointerId!==drag.id)return;event.preventDefault();shift(drag.kind,(event.clientX-drag.px)/drag.rect.width,(event.clientY-drag.py)/drag.rect.height,drag.initial,true);}
 function pointerEnd(event){if(drag?.id===event.pointerId){drag=null;if(frame!==null){win.cancelAnimationFrame(frame);frame=null;paint();}}}
 function keydown(event){const target=event.target.closest('[data-room-drag]');if(!target||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const step=event.shiftKey?.05:.01;shift(target.dataset.roomDrag,event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0,event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0,{...setting()});}
 const handlers={click,input,change,pointerdown:pointerDown,pointermove:pointerMove,pointerup:pointerEnd,pointercancel:pointerEnd,keydown};for(const [name,handler] of Object.entries(handlers))element.addEventListener(name,handler);paint();
 return {destroy(){disposed=true;photos.cancelPending();drag=null;if(frame!==null)win.cancelAnimationFrame(frame);for(const [name,handler] of Object.entries(handlers))element.removeEventListener(name,handler);}};
}
