(function(){
  'use strict';

  // FAQ, byline logo and footer are now static HTML in each article.
  // This file only keeps the back-to-top button clear of BOTH the cookie
  // banner and the footer so nothing overlaps. It is non-critical: if it
  // fails to load, the page and all content still work.

  var footer=document.querySelector('footer');
  var btt=document.getElementById('btt');
  var banner=document.getElementById('cookie-banner');
  if(btt){
    function bannerVisible(){return banner && !banner.hidden && window.getComputedStyle(banner).display!=='none';}
    function baseBottom(){return bannerVisible()?banner.offsetHeight+40:32;}
    function placeButton(){
      btt.classList.toggle('visible',window.scrollY>400);
      var bottom=baseBottom();
      if(footer){
        var rect=footer.getBoundingClientRect();
        if(rect.top<window.innerHeight)bottom=Math.max(bottom,window.innerHeight-rect.top+16);
      }
      btt.style.bottom=bottom+'px';
    }
    window.addEventListener('scroll',placeButton,{passive:true});
    window.addEventListener('resize',placeButton,{passive:true});
    if(banner){
      new MutationObserver(placeButton).observe(banner,{attributes:true,attributeFilter:['hidden','style','class']});
      banner.addEventListener('click',function(){setTimeout(placeButton,0);});
    }
    placeButton();
  }
})();
