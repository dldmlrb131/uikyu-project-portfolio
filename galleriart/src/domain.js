export const money=n=>'₩ '+Number(n).toLocaleString('ko-KR');
export function filterWorks(works,{query='',concept='전체',budget='all',sort='curated'}={}){
 let list=works.filter(w=>(concept==='전체'||w.concepts.includes(concept))&&([w.title,w.english,w.artist,w.sourceArtist,w.medium,...w.concepts].join(' ').toLowerCase().includes(query.toLowerCase()))&&(budget==='all'||w.price<=Number(budget)));
 if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);return list;
}
export function nextBid(current,input){const n=Number(input);if(!Number.isSafeInteger(n)||n<current+10000||n%10000!==0)throw new Error('현재가보다 10,000원 이상 높은 금액을 10,000원 단위로 입력해 주세요.');return n;}
export function validateDraft(d){const errors={};if(!d.title?.trim())errors.title='작품 제목을 입력해 주세요.';if(!d.name?.trim())errors.name='창작자 이름 또는 예명을 입력해 주세요.';for(const k of ['width','height'])if(!(Number(d[k])>0&&Number(d[k])<=1000))errors[k]='0보다 크고 1,000cm 이하인 치수를 입력해 주세요.';if(!d.description?.trim())errors.description='작품 이야기를 남겨 주세요.';if(!d.image)errors.image='작품 사진을 추가해 주세요.';return errors;}
export function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

