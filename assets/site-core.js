(function(){
  'use strict';
  var measurementId='G-WKLWDZFNKC';
  var storageKey='wb-cookie-choice';

  function readConsent(){
    var raw=localStorage.getItem(storageKey);
    if(!raw)return null;
    try{
      var saved=JSON.parse(raw);
      if(saved&&saved.expires&&saved.expires<Date.now()){
        localStorage.removeItem(storageKey);
        return null;
      }
      return saved&&saved.choice?saved.choice:null;
    }catch(e){return raw;}
  }

  function loadAnalytics(){
    if(window.__wbAnalyticsLoaded)return;
    window.__wbAnalyticsLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    window.gtag('js',new Date());
    window.gtag('config',measurementId,{anonymize_ip:true});
    var script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies(){
    ['_ga','_gid','_gat'].forEach(function(name){
      document.cookie=name+'=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie=name+'=; Max-Age=0; path=/; domain=.'+location.hostname+'; SameSite=Lax';
    });
  }

  function configureLanguageSwitch(){
    var languageSwitch=document.querySelector('.language-switch');
    if(!languageSwitch)return;
    languageSwitch.hidden=false;
    if(languageSwitch.hasAttribute('data-force-language-switch')){
      var spanishUrl=languageSwitch.getAttribute('data-es-url');
      languageSwitch.querySelectorAll('[data-lang-switch]').forEach(function(button){
        button.addEventListener('click',function(){
          if(button.getAttribute('data-lang-switch')==='es'&&spanishUrl)window.location.href=spanishUrl;
        });
      });
      return;
    }
    document.documentElement.lang=document.documentElement.lang||'en';
  }

  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('[data-cookie-choice]');
    if(!button)return;
    var choice=button.getAttribute('data-cookie-choice');
    if(choice==='accept')loadAnalytics();
    if(choice==='reject')clearAnalyticsCookies();
  },true);

  if(readConsent()==='accept')loadAnalytics();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',configureLanguageSwitch);
  else configureLanguageSwitch();
})();
