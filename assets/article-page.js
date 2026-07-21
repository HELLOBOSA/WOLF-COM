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
  var burger=document.getElementById('burger-btn');
  var menu=document.getElementById('mob-menu');
  if(burger&&menu)burger.addEventListener('click',function(){menu.style.display=menu.style.display==='block'?'none':'block';});
  var nav=document.getElementById('nav');
  var btt=document.getElementById('btt');
  window.addEventListener('scroll',function(){
    if(nav)nav.classList.toggle('scrolled',window.scrollY>20);
    if(btt)btt.classList.toggle('visible',window.scrollY>400);
  },{passive:true});
  if(btt)btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  var banner=document.getElementById('cookie-banner');
  if(banner){
    var key='wb-cookie-choice';
    var raw=localStorage.getItem(key),valid=false;
    if(raw)try{var saved=JSON.parse(raw);valid=Boolean(saved&&saved.expires>Date.now());}catch(e){valid=true;}
    banner.hidden=valid;
    banner.querySelectorAll('[data-cookie-choice]').forEach(function(button){button.addEventListener('click',function(){localStorage.setItem(key,JSON.stringify({choice:button.getAttribute('data-cookie-choice'),expires:Date.now()+180*24*60*60*1000}));banner.hidden=true;});});
  }
})();
