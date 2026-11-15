import {messages} from './locales.js';

export const locales = ['ko', 'en', 'zh'];
let language = 'ko';
try { const value = localStorage.getItem('ga-language'); if(locales.includes(value)) language=value; } catch {}
export const getLanguage = () => language;
const dictionary = new Map(messages.map(([ko,en,zh])=>[ko,{en,zh}]));
const pattern = new RegExp([...dictionary.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
export function translate(text,locale=language){
  if(locale==='ko') return text;
  const exact=dictionary.get(text.trim());
  if(exact) return text.replace(text.trim(),exact[locale]);
  const saved=text.match(/^(\d+)개의 저장 작품 · 이 브라우저에 보관$/);
  if(saved)return locale==='en'?`${saved[1]} saved artworks · Stored in this browser`:`${saved[1]} 件收藏作品 · 保存在此浏览器中`;
  const count=text.match(/^저장한 작품 (\d+)개$/);
  if(count)return locale==='en'?`${count[1]} saved artworks`:`已收藏 ${count[1]} 件作品`;
  return text.replace(pattern,key=>dictionary.get(key)[locale]);
}

// Localized search resolves to stable Korean catalogue values; filtering/storage do not depend on UI copy.
export function normalizeSearch(query){
  let result=query;
  const pairs=messages.flatMap(([ko,en,zh])=>[[en,ko],[zh,ko]]).sort((a,b)=>b[0].length-a[0].length);
  for(const [label,ko] of pairs){if(label.length>1&&result.toLowerCase()===label.toLowerCase()) return ko;}
  if(/van gogh|梵高/i.test(result))result=result.replace(/van gogh|梵高/ig,'반 고흐');
  if(/^oil$/i.test(result)||result==='油彩')result='유채';
  return result;
}

const originals=new WeakMap();
const attributes=new WeakMap();
const excluded='script,style,textarea,input,[data-user-content],[translate="no"],.draft-list h3,.draft-list p,.draft-preview h3,.draft-preview p,.review-item h2,.review-item p,.query-chip';
function applyText(node){
    if(node.parentElement?.closest(excluded))return;
    const previous=originals.get(node);
    const source=previous&&node.data===previous.output?previous.source:node.data;
    const output=translate(source);
    originals.set(node,{source,output});
    if(node.data!==output)node.data=output;
}
function applyAttributes(element){
    if(element.closest('[data-user-content],[translate="no"]')||element.matches('.draft-list img,.review-item img,.draft-preview img'))return;
    const record=attributes.get(element)||{};
    for(const name of ['aria-label','placeholder','alt']){
      if(!element.hasAttribute(name))continue;
      const current=element.getAttribute(name),prev=record[name];
      const source=prev&&current===prev.output?prev.source:current,output=translate(source);
      record[name]={source,output};
      if(current!==output)element.setAttribute(name,output);
    }
    attributes.set(element,record);
}
function apply(root){
  if(root.nodeType===3){applyText(root);return;}
  if(root.nodeType!==1&&root.nodeType!==11)return;
  if(root.closest?.(excluded))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode()))applyText(node);
  // A newly added image/button may itself carry the translated attribute.
  if(root.nodeType===1)applyAttributes(root);
  for(const element of root.querySelectorAll('[aria-label],[placeholder],img[alt]'))applyAttributes(element);
}
export function languagePicker(){return `<div class="language-picker" role="group" aria-label="Language"><span aria-hidden="true">LANGUAGE</span>${[['ko','한국어'],['en','English'],['zh','中文']].map(([code,label])=>`<button type="button" data-action="language" data-language="${code}" lang="${code==='zh'?'zh-Hans':code}" translate="no" aria-pressed="${language===code}">${label}</button>`).join('')}</div>`;}
export function setLanguage(value){
  if(!locales.includes(value))return;
  language=value;
  try{localStorage.setItem('ga-language',value);}catch{}
  document.documentElement.lang=value==='zh'?'zh-Hans':value;
  document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.language===value));
  refreshLanguage();
}
let observer;
const observation={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','alt']};
function updateTitle(){
  document.title=translate(location.hash.startsWith('#/unknown')?'갤러리아트 버전3 — 무제':'갤러리아트 버전3 — 작품에서 시작되는 발견');
}
function applyChanges(records){
  // App renders are Korean. Only explicit language switches need a whole-page pass.
  if(language==='ko')return;
  const roots=new Set(),changedAttributes=new Set();
  for(const record of records){
    if(record.type==='childList')for(const node of record.addedNodes)roots.add(node);
    else if(record.type==='characterData')roots.add(record.target);
    else changedAttributes.add(record.target);
  }
  observer.disconnect();
  try{
    for(const root of roots){
      if(!document.body.contains(root))continue;
      let parent=root.parentNode;while(parent&&!roots.has(parent))parent=parent.parentNode;
      if(!parent)apply(root);
    }
    for(const element of changedAttributes)if(document.body.contains(element))applyAttributes(element);
  }finally{observer.observe(document.body,observation);}
}
export function refreshLanguage(){
  observer?.disconnect();
  apply(document.body);
  updateTitle();
  observer?.observe(document.body,observation);
}
export function initLanguage(){
  observer=new MutationObserver(applyChanges);
  window.addEventListener('hashchange',updateTitle);
  setLanguage(language);
}

