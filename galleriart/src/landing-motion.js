// One frame per scroll/resize; read positions first, then write decorative offsets.
export function createLandingMotion({main,window:win,preference}){
  let elements=[],frame=null;
  const clear=()=>{for(const element of elements)element.style.removeProperty('--landing-offset');};
  function paint(){
    frame=null;
    if(preference.matches||!elements.length)return;
    const height=win.innerHeight;
    const values=elements.map(element=>{
      const rect=element.getBoundingClientRect();
      if(rect.bottom< -100||rect.top>height+100)return null;
      const amplitude=Number(element.dataset.landingDrift)||0;
      const progress=Math.max(-1,Math.min(1,(height/2-(rect.top+rect.height/2))/(height/2+rect.height/2)));
      return -progress*amplitude;
    });
    elements.forEach((element,index)=>{if(values[index]!==null)element.style.setProperty('--landing-offset',`${values[index].toFixed(2)}px`);});
  }
  function schedule(){if(frame===null&&elements.length&&!preference.matches&&win.requestAnimationFrame)frame=win.requestAnimationFrame(paint);}
  function refresh(){
    if(frame!==null){win.cancelAnimationFrame(frame);frame=null;}
    clear();elements=main.classList?.contains('landing-main')?[...main.querySelectorAll('[data-landing-drift]')]:[];
    paint();
  }
  win.addEventListener('scroll',schedule,{passive:true});
  win.addEventListener('resize',schedule);
  return {refresh};
}
