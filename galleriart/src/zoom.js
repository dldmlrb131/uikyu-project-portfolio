// Fit-relative zoom, anchored to the cursor/pinch midpoint, with bounded panning.
export function attachZoom(dialog){
  const viewport=dialog.querySelector('.zoom-viewport'),img=viewport.querySelector('img'),output=dialog.querySelector('.zoom-percent');
  const zoomOut=dialog.querySelector('[data-zoom="out"]'),zoomIn=dialog.querySelector('[data-zoom="in"]'),win=dialog.ownerDocument.defaultView;
  let scale=1,x=0,y=0,baseW=0,baseH=0,width=0,height=0,drag=null,frame=null,disposed=false;
  const points=new Map(),abort=new AbortController(),options={signal:abort.signal};
  const limit=(value,min,max)=>Math.min(max,Math.max(min,value));
  function constrain(){
    const maxX=Math.max(0,(baseW*scale-width)/2),maxY=Math.max(0,(baseH*scale-height)/2);
    x=limit(x,-maxX,maxX);y=limit(y,-maxY,maxY);
  }
  function paint(){
    if(disposed)return;
    constrain();
    img.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${scale})`;
    const label=Math.round(scale*100)+'%';if(output.textContent!==label)output.textContent=label;
    viewport.classList.toggle('is-zoomed',scale>1);
    if(zoomOut.disabled!==(scale<=1))zoomOut.disabled=scale<=1;
    if(zoomIn.disabled!==(scale>=8))zoomIn.disabled=scale>=8;
  }
  function schedule(){if(!disposed&&frame===null)frame=win.requestAnimationFrame(()=>{frame=null;paint();});}
  function fit(){
    if(disposed||!img.naturalWidth)return;
    width=viewport.clientWidth;height=viewport.clientHeight;
    const ratio=Math.max(0,Math.min((width-24)/img.naturalWidth,(height-24)/img.naturalHeight));
    baseW=img.naturalWidth*ratio;baseH=img.naturalHeight*ratio;scale=1;x=y=0;
    img.style.width=baseW+'px';img.style.height=baseH+'px';paint();
  }
  function zoom(next,cx=0,cy=0){next=limit(next,1,8);const ratio=next/scale;x=cx-(cx-x)*ratio;y=cy-(cy-y)*ratio;scale=next;constrain();schedule();}
  function local(e){const r=viewport.getBoundingClientRect();return {x:e.clientX-r.left-r.width/2,y:e.clientY-r.top-r.height/2};}
  function gesture(){const a=[...points.values()];if(a.length>=2)return {x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};return a[0];}
  viewport.addEventListener('wheel',e=>{e.preventDefault();const p=local(e);zoom(scale*Math.exp(-e.deltaY*.002),p.x,p.y);},{...options,passive:false});
  viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;viewport.focus({preventScroll:true});viewport.setPointerCapture(e.pointerId);points.set(e.pointerId,local(e));drag=gesture();},options);
  viewport.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,local(e));const next=gesture();if(drag){if(points.size>=2&&drag.d>0){zoom(scale*next.d/drag.d,drag.x,drag.y);}x+=next.x-drag.x;y+=next.y-drag.y;constrain();schedule();}drag=next;},options);
  function end(e){points.delete(e.pointerId);drag=points.size?gesture():null;}
  viewport.addEventListener('pointerup',end,options);viewport.addEventListener('pointercancel',end,options);viewport.addEventListener('lostpointercapture',end,options);
  viewport.addEventListener('dblclick',e=>{const p=local(e);if(scale>1)fit();else zoom(2,p.x,p.y);},options);
  dialog.addEventListener('click',e=>{const a=e.target.closest('[data-zoom]')?.dataset.zoom;if(a==='in')zoom(scale*1.4);if(a==='out')zoom(scale/1.4);if(a==='reset')fit();},options);
  viewport.addEventListener('keydown',e=>{if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')zoom(scale*1.4);else if(e.key==='-')zoom(scale/1.4);else if(e.key==='0')fit();else{x+=e.key==='ArrowLeft'?40:e.key==='ArrowRight'?-40:0;y+=e.key==='ArrowUp'?40:e.key==='ArrowDown'?-40:0;constrain();schedule();}}},options);
  img.addEventListener('load',fit,options);
  const resize=new win.ResizeObserver(fit);resize.observe(viewport);fit();
  dialog.addEventListener('close',()=>{disposed=true;if(frame!==null)win.cancelAnimationFrame(frame);points.clear();drag=null;abort.abort();resize.disconnect();},{once:true});
}
