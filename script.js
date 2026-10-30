(function(){
  const year=document.getElementById('current-year');if(year)year.textContent=new Date().getFullYear();
  const btn=document.getElementById('nav-toggle'),nav=document.getElementById('nav-list');
  if(btn&&nav){btn.addEventListener('click',()=>{const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Close navigation':'Open navigation')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));}
  const headings=document.querySelectorAll('main section[id]');const navlinks=document.querySelectorAll('.main-nav a');
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){navlinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-25% 0px -60% 0px'});headings.forEach(h=>observer.observe(h));}
})();
