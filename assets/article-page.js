(function(){
  'use strict';
  var root=document.documentElement;
  var themeButton=document.getElementById('theme-btn');
  var moon=document.getElementById('wb-moon');
  var sun=document.getElementById('wb-sun');
  function setTheme(dark){
    root.classList.toggle('wb-dark',dark);
    if(moon)moon.style.display=dark?'none':'';
    if(sun)sun.style.display=dark?'':'none';
    localStorage.setItem('wb-theme',dark?'dark':'light');
  }
  setTheme(localStorage.getItem('wb-theme')==='dark');
  if(themeButton)themeButton.addEventListener('click',function(){setTheme(!root.classList.contains('wb-dark'));});
  var lang=localStorage.getItem('wb-es-lang')||'en';
  function applyLang(){
    document.querySelectorAll('[data-es],[data-en]').forEach(function(el){
      var val=el.getAttribute('data-'+lang);
      if(val!==null)el.innerHTML=val;
    });
    document.querySelectorAll('[data-lang-switch]').forEach(function(b){
      b.classList.toggle('active',b.getAttribute('data-lang-switch')===lang);
    });
    root.setAttribute('lang',lang);
    localStorage.setItem('wb-es-lang',lang);
  }
  applyLang();
  document.querySelectorAll('[data-lang-switch]').forEach(function(b){
    b.addEventListener('click',function(){
      var chosen=b.getAttribute('data-lang-switch');
      lang=chosen;
      localStorage.setItem('wb-es-lang',chosen);
      applyLang();
    });
  });
  var burger=document.getElementById('burger-btn');
  var menu=document.getElementById('mob-menu');
  if(burger&&menu)burger.addEventListener('click',function(){menu.style.display=menu.style.display==='block'?'none':'block';});
  var nav=document.getElementById('nav');
  var btt=document.getElementById('btt');
  var banner=document.getElementById('cookie-banner');
  var footer=document.querySelector('footer');
  if(banner){
    var key='wb-cookie-choice';
    var raw=localStorage.getItem(key),valid=false;
    if(raw)try{var saved=JSON.parse(raw);valid=Boolean(saved&&saved.expires>Date.now());}catch(e){valid=true;}
    banner.hidden=valid;
    banner.querySelectorAll('[data-cookie-choice]').forEach(function(button){button.addEventListener('click',function(){localStorage.setItem(key,JSON.stringify({choice:button.getAttribute('data-cookie-choice'),expires:Date.now()+180*24*60*60*1000}));banner.hidden=true;});});
  }
  function bannerVisible(){return banner&&!banner.hidden&&window.getComputedStyle(banner).display!=='none';}
  function adjustBtt(){
    if(!btt)return;
    btt.classList.toggle('visible',window.scrollY>400);
    var base=bannerVisible()?banner.offsetHeight+40:32;
    if(footer){
      var rect=footer.getBoundingClientRect();
      if(rect.top<window.innerHeight){
        btt.style.bottom=Math.max(base,window.innerHeight-rect.top+16)+'px';
        return;
      }
    }
    btt.style.bottom=bannerVisible()?base+'px':'';
  }
  window.addEventListener('scroll',function(){
    if(nav)nav.classList.toggle('scrolled',window.scrollY>20);
    adjustBtt();
  },{passive:true});
  window.addEventListener('resize',adjustBtt,{passive:true});
  if(banner){
    new MutationObserver(adjustBtt).observe(banner,{attributes:true,attributeFilter:['hidden','style','class']});
    banner.addEventListener('click',function(){setTimeout(adjustBtt,0);});
  }
  adjustBtt();
  if(btt)btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();
