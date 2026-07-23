/* Version 3 mobile navigation, first-run guide and update interface. */
(() => {
  const navButtons=[...document.querySelectorAll('.bottom-nav-button')];
  const oldTabs=[...document.querySelectorAll('.tab')];

  function activateView(viewId){
    oldTabs.find(x=>x.dataset.view===viewId)?.click();
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));
    navButtons.forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  navButtons.forEach(button=>button.addEventListener('click',()=>activateView(button.dataset.view)));
  oldTabs.forEach(tab=>tab.addEventListener('click',()=>{
    navButtons.forEach(b=>b.classList.toggle('active',b.dataset.view===tab.dataset.view));
  }));

  const filters=document.getElementById('mapFilters');
  const toggle=document.getElementById('toggleFilters');
  toggle?.addEventListener('click',()=>{
    const collapsed=filters.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded',String(!collapsed));
    toggle.textContent=collapsed?'☰ Show filters':'☰ Hide filters';
  });

  function updateVisibleCount(){
    try{
      const count=filteredLocations().length;
      const el=document.getElementById('visibleCount');
      if(el)el.textContent=`${count} location${count===1?'':'s'} visible`;
    }catch{}
  }
  const originalRenderAll=window.renderAll;
  if(typeof originalRenderAll==='function'){
    window.renderAll=function(){const result=originalRenderAll.apply(this,arguments);updateVisibleCount();return result}
  }
  updateVisibleCount();

  const welcome=document.getElementById('welcomeOverlay');
  const welcomeKey='blackFlagV21WelcomeSeen';
  if(!localStorage.getItem(welcomeKey))welcome.classList.remove('hidden');
  document.getElementById('welcomeContinue')?.addEventListener('click',()=>{
    localStorage.setItem(welcomeKey,'1');welcome.classList.add('hidden')
  });

  // Service-worker update prompt.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then(reg=>{
      reg.addEventListener('updatefound',()=>{
        const worker=reg.installing;
        worker?.addEventListener('statechange',()=>{
          if(worker.state==='installed'&&navigator.serviceWorker.controller){
            document.getElementById('updateToast')?.classList.remove('hidden');
          }
        });
      });
    });
    let refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;refreshing=true;location.reload();
    });
  }
  document.getElementById('reloadUpdate')?.addEventListener('click',()=>location.reload());

  // Collapse filters automatically after a location search on small screens.
  document.getElementById('locationList')?.addEventListener('click',()=>{
    if(innerWidth<700&&!filters.classList.contains('collapsed')){
      filters.classList.add('collapsed');
      toggle.setAttribute('aria-expanded','false');
      toggle.textContent='☰ Show filters';
    }
  });

  // Highlight selected marker after the detail modal opens.
  const detailModal=document.getElementById('detailModal');
  if(detailModal){
    const observer=new MutationObserver(()=>{
      document.querySelectorAll('.marker').forEach(m=>m.classList.toggle('selected',m.dataset.id===selectedID&&!detailModal.classList.contains('hidden')));
    });
    observer.observe(detailModal,{attributes:true,attributeFilter:['class']});
  }
})();
