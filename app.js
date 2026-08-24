const state={games:[],selected:new Set()};
const tags=[
["gore","🩸 Gore"],["psychological","🧠 Psychological Horror"],["atmosphere","🌫️ Atmosphere"],
["action","🔫 Action"],["jumpscares","😱 Jumpscares"],["puzzles","🧩 Puzzles"],
["supernatural","👻 Supernatural"],["survival","🏚️ Survival Horror"]
];
const $=s=>document.querySelector(s);
const modalIds=["modal","searchModal","resultsModal","gameModal"];
function openModal(id){$(id).classList.remove("hidden")}
function closeModal(id){$(id).classList.add("hidden")}
function art(g){
  const seed=encodeURIComponent(g.name);
  return `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80&sig=${g.id}`;
}
async function init(){
  state.games=await fetch("games.json").then(r=>r.json());
  renderFeatured();
  buildTags();
}
function renderFeatured(){
  $("#featured").innerHTML=state.games.filter(g=>g.name!=="Portal 2").slice(0,4).map(card).join("");
  document.querySelectorAll(".game-card").forEach(e=>e.onclick=()=>showGame(+e.dataset.id));
}
function card(g){
 return `<article class="game-card" data-id="${g.id}"><div class="game-art" style="background-image:url('${art(g)}')"></div><div class="game-info"><h3>${g.name}</h3><p>${g.description}</p><div class="chips">${g.tags.slice(0,3).map(t=>`<span class="chip">${t}</span>`).join("")}</div></div></article>`;
}
function buildTags(){
 $("#tagGrid").innerHTML=tags.map(([k,l])=>`<button class="tag" data-tag="${k}">${l}</button>`).join("");
 document.querySelectorAll(".tag").forEach(b=>b.onclick=()=>{
   const k=b.dataset.tag;
   state.selected.has(k)?state.selected.delete(k):state.selected.add(k);
   b.classList.toggle("selected"); $("#selectedCount").textContent=`${state.selected.size} selected`;
 });
}
function findMatches(){
 const selected=[...state.selected];
 let ranked=state.games.map(g=>{
   if(!selected.length)return {g,score:0};
   const values=selected.map(k=>g.scores[k]||0);
   const score=Math.round(values.reduce((a,b)=>a+b,0)/selected.length*10);
   return {g,score};
 }).filter(x=>selected.length?x.score>=35:true).sort((a,b)=>b.score-a.score);
 $("#resultSummary").textContent=selected.length?`Matched against ${selected.length} preference${selected.length>1?"s":""}.`: "Here are some horror picks to get you started.";
 $("#results").innerHTML=ranked.slice(0,6).map(x=>`<div class="result" data-id="${x.g.id}"><div><strong>${x.g.name}</strong><div class="chips">${x.g.tags.slice(0,4).map(t=>`<span class="chip">${t}</span>`).join("")}</div></div><div class="score">${x.score?x.score+"%":"PICK"}</div></div>`).join("");
 document.querySelectorAll(".result").forEach(e=>e.onclick=()=>showGame(+e.dataset.id));
 closeModal("modal");openModal("resultsModal");
}
function showGame(id){
 const g=state.games.find(x=>x.id===id); if(!g)return;
 const meters=tags.map(([k,l])=>`<div class="meter"><span>${l.replace(/^\\S+ /,"")}</span><div><i style="width:${(g.scores[k]||0)*10}%"></i></div><b>${g.scores[k]||0}/10</b></div>`).join("");
 const similar=state.games.filter(x=>x.id!==g.id&&x.name!=="Portal 2").map(x=>({g:x,d:tags.reduce((s,[k])=>s+Math.abs((g.scores[k]||0)-(x.scores[k]||0)),0)})).sort((a,b)=>a.d-b.d).slice(0,3);
 $("#gameDetail").innerHTML=`<div class="detail-head"><div class="detail-art" style="background-image:url('${art(g)}')"></div><div class="detail-copy"><div class="eyebrow">HORROR PROFILE</div><h2>${g.name}</h2><p>${g.tags.join(" · ")}</p><a class="primary steam" href="${g.steam}" target="_blank" rel="noopener">View on Steam ↗</a></div></div><div class="detail-body"><h3>What is it like?</h3><p>${g.description}</p><h3>Horror profile</h3>${meters}<div class="similar"><h3>You may also like</h3><div class="results">${similar.map(x=>`<div class="result" data-id="${x.g.id}"><strong>${x.g.name}</strong><span class="chip">Similar match</span></div>`).join("")}</div></div></div>`;
 document.querySelectorAll("#gameDetail .result").forEach(e=>e.onclick=()=>showGame(+e.dataset.id));
 closeModal("resultsModal");closeModal("searchModal");openModal("gameModal");
}
function searchKnown(){
 const q=$("#searchInput").value.trim().toLowerCase();
 const list=state.games.filter(g=>g.name.toLowerCase().includes(q)).slice(0,8);
 $("#searchResults").innerHTML=q?list.map(g=>`<div class="search-item" data-id="${g.id}"><strong>${g.name}</strong><span>${g.tags.slice(0,4).join(" · ")}</span></div>`).join(""):`<p style="color:#666;font-size:12px">Start typing to search the GamerGuy database.</p>`;
 document.querySelectorAll(".search-item").forEach(e=>e.onclick=()=>showGame(+e.dataset.id));
}
$("#findBtn").onclick=()=>openModal("modal");
$("#matchBtn").onclick=findMatches;
["#knownSearch","#knownSearch2","#knownSearch3"].forEach(s=>$(s).onclick=()=>{openModal("searchModal");$("#searchInput").focus()});
$("#searchInput").oninput=searchKnown;
$("#close").onclick=()=>closeModal("modal");
$("#closeSearch").onclick=()=>closeModal("searchModal");
$("#closeResults").onclick=()=>closeModal("resultsModal");
$("#closeGame").onclick=()=>closeModal("gameModal");
document.querySelectorAll(".backdrop").forEach(b=>b.onclick=e=>e.currentTarget.parentElement.classList.add("hidden"));
init();
