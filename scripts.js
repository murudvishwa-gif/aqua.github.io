const header = document.getElementById('site-header');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});
}
const siteMenuBtn = document.querySelector('.site-menu-btn');
if(siteMenuBtn && header){
  const setSiteMenu = (isOpen) => {
    header.classList.toggle('menu-open', isOpen);
    document.body.classList.toggle('site-menu-open', isOpen);
    siteMenuBtn.setAttribute('aria-expanded', String(isOpen));
  };
  siteMenuBtn.addEventListener('click', () => {
    setSiteMenu(!header.classList.contains('menu-open'));
  });
  header.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      setSiteMenu(false);
    });
  });
}
document.querySelectorAll('.page-login .hero-card form, .page-signup .hero-card form').forEach(form => {
  form.addEventListener('submit', () => {
    if(document.body.classList.contains('page-login') && !form.querySelector('input[type="password"]')) return;
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const roleInput = form.querySelector('select[name="accountRole"]');
    const fallbackName = emailInput ? emailInput.value.split('@')[0].replace(/[._-]+/g, ' ') : '';
    const displayName = (nameInput && nameInput.value.trim()) || fallbackName || 'Farm Operator';
    const dashboardRole = roleInput ? roleInput.value : 'User';
    localStorage.setItem('dashboardUserName', displayName.trim());
    localStorage.setItem('dashboardUserRole', dashboardRole);
    window.location.href = dashboardRole === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html';
  });
});
const dashboardMenuBtn = document.querySelector('.dashboard-menu-btn');
const dashboardHeader = document.querySelector('.dashboard-header');
if(dashboardMenuBtn && dashboardHeader){
  const storedUserName = localStorage.getItem('dashboardUserName') || 'Vishwa Patel';
  const initials = storedUserName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'VP';
  document.querySelectorAll('[data-dashboard-user]').forEach(el => { el.textContent = storedUserName; });
  document.querySelectorAll('[data-dashboard-initials]').forEach(el => { el.textContent = initials; });
  document.querySelectorAll('[data-dashboard-role]').forEach(el => { el.textContent = localStorage.getItem('dashboardUserRole') || 'User'; });
  const dashboardPanels = document.querySelectorAll('.dashboard-panel');
  const dashboardLinks = document.querySelectorAll('.dashboard-logo-home[href^="#"], .dashboard-nav a[href^="#"], .dashboard-actions a[href^="#"], .dashboard-panel a[href^="#"]');
  const showDashboardPanel = (id) => {
    dashboardPanels.forEach(panel => panel.classList.toggle('active', panel.id === id));
    document.querySelectorAll('.dashboard-nav a[href^="#"]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#'+id);
    });
    const activePanel = document.getElementById(id);
    if(activePanel){
      activePanel.scrollTop = 0;
      activePanel.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
  };
  const startPanel = (location.hash || '#home').slice(1);
  if(document.getElementById(startPanel)) showDashboardPanel(startPanel);
  const setDashboardMenu = (isOpen) => {
    dashboardHeader.classList.toggle('menu-open', isOpen);
    document.body.classList.toggle('dashboard-menu-open', isOpen);
    dashboardMenuBtn.setAttribute('aria-expanded', String(isOpen));
  };
  dashboardMenuBtn.addEventListener('click', () => {
    setDashboardMenu(!dashboardHeader.classList.contains('menu-open'));
  });
  dashboardLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      if(document.getElementById(id)){
        event.preventDefault();
        showDashboardPanel(id);
      }
      setDashboardMenu(false);
    });
  });
  window.addEventListener('keydown', (event) => {
    if(event.key === 'Escape') setDashboardMenu(false);
  });
}
const dgFill = document.getElementById('dg-fill');
const dgM = document.getElementById('dg-meters');
const dgZ = document.getElementById('dg-zone');
function updateDepth(){
  if(!dgFill || !dgM || !dgZ) return;
  const doc = document.documentElement;
  const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
  const clamped = Math.min(Math.max(pct,0),1);
  const isMobile = window.innerWidth <= 860;
  if(isMobile){ dgFill.style.width = (clamped*100)+'%'; } else { dgFill.style.height = (clamped*100)+'%'; }
  const zones = [
    {max:.08, m:0,   z:'Surface'},
    {max:.22, m:20,  z:'Sunlit zone'},
    {max:.38, m:45,  z:'Twilight zone'},
    {max:.52, m:70,  z:'Operational zone'},
    {max:.66, m:95,  z:'Midwater zone'},
    {max:.82, m:130, z:'Deep zone'},
    {max:1.01,m:200, z:'Abyssal zone'}
  ];
  const zone = zones.find(z => clamped <= z.max) || zones[zones.length-1];
  dgM.textContent = zone.m + 'm';
  dgZ.textContent = zone.z;
}
if(dgFill && dgM && dgZ){
  window.addEventListener('scroll', updateDepth, {passive:true});
  window.addEventListener('resize', updateDepth);
  updateDepth();
}
function spawnBubbles(containerId, count){
  const c = document.getElementById(containerId);
  if(!c) return;
  for(let i=0;i<count;i++){
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 4 + Math.random()*14;
    b.style.width = size+'px';
    b.style.height = size+'px';
    b.style.left = Math.random()*100+'%';
    b.style.setProperty('--drift', (Math.random()*60-30)+'px');
    b.style.animationDuration = (7 + Math.random()*9)+'s';
    b.style.animationDelay = (Math.random()*10)+'s';
    c.appendChild(b);
  }
}
['bubbles-hero','bubbles-dash','bubbles-species','bubbles-cta'].forEach(id => spawnBubbles(id, 16));
const revealEls = document.querySelectorAll('.reveal');
if(revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.15});
  revealEls.forEach(el => io.observe(el));
}
const counters = document.querySelectorAll('.stat-num');
if(counters.length){
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimal = parseInt(el.dataset.decimal || '0');
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur += step;
        if(cur >= target){ el.textContent = target.toFixed(decimal) + suffix; return; }
        el.textContent = cur.toFixed(decimal) + suffix;
        requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  }, {threshold:.5});
  counters.forEach(el => counterIO.observe(el));
}
function circumference(r){ return 2*Math.PI*r; }
const gaugeIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.gauge-fill, .ring-fill').forEach(circle => {
      const r = parseFloat(circle.getAttribute('r'));
      const c = circumference(r);
      const pct = parseFloat(circle.dataset.pct)/100;
      circle.style.strokeDasharray = c;
      circle.style.strokeDashoffset = c - (c*pct);
    });
    gaugeIO.unobserve(entry.target);
  });
}, {threshold:.3});
document.querySelectorAll('#dashboard .dash-panel, #impact .impact-grid').forEach(el => gaugeIO.observe(el));
