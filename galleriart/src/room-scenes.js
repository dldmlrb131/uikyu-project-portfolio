// One catalogue for the introduction and individual artwork previews.
export const ROOM_SCENES=[
 {id:'living',name:'거실',title:'하루가 쉬어 가는 거실',work:'cypress',top:18,width:26},
 {id:'bedroom',name:'침실',title:'나의 속도로 머무는 침실',work:'met-436965',top:19,width:26},
 {id:'hallway',name:'복도',title:'매일 지나치는 작은 전시',work:'met-437881',top:17,width:19},
 {id:'office',name:'사무실',title:'새로운 생각이 시작되는 일터',work:'met-436105',top:18,width:28},
 {id:'cafe',name:'카페',title:'취향이 모이는 카페',work:'met-435839',top:18,width:26}
].map(scene=>({...scene,image:`/uikyu-project-portfolio/galleriart/visuals/space-${scene.id}-2026-10-15.jpg`,aspect:1.5}));
