// Keep real anchors for keyboard, modified clicks and browsers without animated transitions.
export function createArtPortal({window:win=window,document:doc=document,preference}){
 let layer=null,timer=null,frame=null,link=null,committed=false,disposed=false;
 function clean(){
  if(timer!==null)win.clearTimeout(timer);if(frame!==null)win.cancelAnimationFrame(frame);
  timer=frame=null;layer?.remove();layer=null;link?.removeAttribute('aria-busy');
  win.removeEventListener('keydown',escape);preference.removeEventListener('change',motion);
 }
 function commit(){
  if(!layer)return;
  committed=true;win.location.hash=link.getAttribute('href');
  layer.dataset.state='revealing';timer=win.setTimeout(clean,260);
 }
 function escape(event){if(event.key==='Escape'&&!committed){const target=link;clean();target?.focus({preventScroll:true});}}
 function motion(){if(preference.matches&&layer){if(timer!==null)win.clearTimeout(timer);commit();clean();}}
 return {
  enter(event,target){
   if(disposed||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const href=target.getAttribute('href');
   if(!['#/concepts','#/unknown','#/auctions'].includes(href))return;
   event.preventDefault();if(layer)return;
   if(preference.matches||!win.requestAnimationFrame||!doc.createElement){win.location.hash=href;return;}
   link=target;committed=false;
   const image=link.querySelector('img'),bounds=link.querySelector('.museum-gold-frame')?.getBoundingClientRect();
   if(!image||!bounds?.width){win.location.hash=href;return;}
   layer=doc.createElement('div');layer.className='art-portal';layer.setAttribute('aria-hidden','true');layer.dataset.state='ready';
   const art=doc.createElement('div');art.className='art-portal-frame';art.append(image.cloneNode());
   const zoom=Math.max(win.innerWidth/bounds.width,win.innerHeight/bounds.height)*1.3;
   for(const [key,value] of Object.entries({left:`${bounds.left}px`,top:`${bounds.top}px`,width:`${bounds.width}px`,height:`${bounds.height}px`}))art.style[key]=value;
   art.style.setProperty('--portal-x',`${win.innerWidth/2-bounds.left-bounds.width/2}px`);
   art.style.setProperty('--portal-y',`${win.innerHeight/2-bounds.top-bounds.height/2}px`);
   art.style.setProperty('--portal-scale',String(zoom));
   layer.append(art);doc.body.append(layer);link.setAttribute('aria-busy','true');
   // Commit the starting geometry before CSS takes the frame towards the viewer.
   layer.getBoundingClientRect();
   frame=win.requestAnimationFrame(()=>{frame=null;if(layer)layer.dataset.state='entering';});
   timer=win.setTimeout(commit,740);
   win.addEventListener('keydown',escape);preference.addEventListener('change',motion);
  },
  destroy(){disposed=true;if(!committed)clean();}
 };
}
