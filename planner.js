/* Jackdaw planner and Version 2 dashboard compatibility layer. */
(() => {
  const V2_PLANS = [
    ["Elite Hull Armor","San Ignacio wreck"],
    ["Elite Round Shot Strength","Kabah Ruins"],
    ["Elite Broadside Cannons","The Blue Hole"],
    ["Elite Swivel Guns","Devil's Eye Caverns"],
    ["Elite Mortars","Antocha Wreck"],
    ["Elite Fire Barrels","San Juan"],
    ["Elite Ram","La Concepcion Wreck"],
    ["Elite Harpoon","Andreas Island"],
    ["Elite Heavy Shot Storage","Buried treasure"],
    ["Elite Mortar Storage","Buried treasure"],
    ["Elite Fire Barrel Storage","Buried treasure"]
  ];

  function ensureV2State(){
    state.planner ??= {};
    V2_PLANS.forEach(([name]) => state.planner[name] ??= {planFound:false,upgradeComplete:false});
    saveState();
  }

  function switchView(id){
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view===id));
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
    if(id==='overviewView') renderV2Overview();
    if(id==='plannerView') renderPlanner();
  }

  document.querySelectorAll('.tab').forEach(b=>{
    b.addEventListener('click',()=>switchView(b.dataset.view));
  });

  function progressRows(groups,target){
    target.innerHTML='';
    Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).forEach(([label,items])=>{
      const done=items.filter(i=>i.completed).length;
      target.insertAdjacentHTML('beforeend',`<div class="progress-row"><div class="progress-label"><span>${esc(label)}</span><span>${done}/${items.length}</span></div><progress value="${done}" max="${items.length}"></progress></div>`);
    });
  }

  function renderV2Overview(){
    const total=state.locations.length;
    const complete=state.locations.filter(i=>i.completed).length;
    const verified=state.locations.filter(i=>i.verification==="Resynced verified").length;
    const legacy=state.locations.filter(i=>i.verification.startsWith("Legacy")).length;
    const community=state.locations.filter(i=>i.verification==="Community reported").length;
    const favorites=state.locations.filter(i=>i.favorite).length;
    const aggregate=state.locations.filter(i=>i.isAggregate).length;

    document.getElementById('v2Metrics').innerHTML =
      `<div class="metric"><b>${complete}/${total}</b><span>Completed</span></div>
       <div class="metric"><b>${Math.round(total?complete/total*100:0)}%</b><span>Overall progress</span></div>
       <div class="metric"><b>${verified}</b><span>Resynced verified</span></div>
       <div class="metric"><b>${favorites}</b><span>Favorites</span></div>`;

    document.getElementById('verificationProgress').innerHTML =
      `<div class="data-quality">
        <div class="metric"><b>${verified}</b><span>Verified</span></div>
        <div class="metric"><b>${legacy}</b><span>Legacy</span></div>
        <div class="metric"><b>${community}</b><span>Community</span></div>
       </div>
       <p style="color:var(--muted);font-size:12px;margin-top:10px">${aggregate} aggregate guide markers still await individual-location expansion.</p>`;

    const cats={}; state.locations.forEach(i=>(cats[i.category]??=[]).push(i));
    const regs={}; state.locations.forEach(i=>(regs[i.region]??=[]).push(i));
    progressRows(cats,document.getElementById('v2CategoryProgress'));
    progressRows(regs,document.getElementById('v2RegionProgress'));
  }

  function renderPlanner(){
    ensureV2State();
    const entries=V2_PLANS.map(([name,location])=>({name,location,...state.planner[name]}));
    const found=entries.filter(x=>x.planFound).length;
    const upgraded=entries.filter(x=>x.upgradeComplete).length;
    document.getElementById('plannerMetrics').innerHTML =
      `<div class="metric"><b>${found}/${entries.length}</b><span>Elite plans found</span></div>
       <div class="metric"><b>${upgraded}/${entries.length}</b><span>Upgrades completed</span></div>
       <div class="metric"><b>${entries.length-found}</b><span>Plans remaining</span></div>
       <div class="metric"><b>${Math.round(entries.length?upgraded/entries.length*100:0)}%</b><span>Planner completion</span></div>`;
    const list=document.getElementById('plannerList');
    list.innerHTML='';
    entries.forEach(item=>{
      const row=document.createElement('div');
      row.className='planner-item';
      row.innerHTML=`<div><strong>${esc(item.name)}</strong><small>${esc(item.location)}</small></div><div class="planner-checks"><label class="planner-check"><input type="checkbox" data-plan="${esc(item.name)}" data-field="planFound" ${item.planFound?'checked':''}> Plan found</label><label class="planner-check"><input type="checkbox" data-plan="${esc(item.name)}" data-field="upgradeComplete" ${item.upgradeComplete?'checked':''}> Upgraded</label></div>`;
      list.appendChild(row);
    });
    list.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.addEventListener('change',()=>{
      const p=state.planner[cb.dataset.plan];
      p[cb.dataset.field]=cb.checked;
      if(cb.dataset.field==='upgradeComplete' && cb.checked) p.planFound=true;
      saveState(); renderPlanner();
    }));
  }

  document.getElementById('overviewOpenMap').addEventListener('click',()=>switchView('mapView'));
  document.querySelectorAll('.v2QuickFilter').forEach(btn=>btn.addEventListener('click',()=>{
    const f=btn.dataset.filter;
    if(f==='verified') state.settings.verifiedOnly=true;
    if(f==='remaining') state.settings.hideCompleted=true;
    if(f==='favorites') state.settings.favoritesOnly=true;
    if(f==='clear'){
      state.settings.verifiedOnly=false;
      state.settings.hideCompleted=false;
      state.settings.favoritesOnly=false;
      state.settings.categories=[...CATEGORIES];
    }
    saveState(); renderAll(); switchView('mapView');
  }));
  document.getElementById('plannerReset').addEventListener('click',()=>{
    if(!confirm('Reset the entire Jackdaw planner?')) return;
    state.planner={}; ensureV2State(); renderPlanner();
  });

  ensureV2State();
  renderV2Overview();
})();
