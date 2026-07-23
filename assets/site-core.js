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

  function submitBasinForm(form,event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
      event.__wbBasinHandled=true;
    }
    if(form.getAttribute('data-basin-submitting')==='true')return false;

    var submitButton=form.querySelector('[type="submit"]');
    var submitLabel=submitButton&&(submitButton.querySelector('[data-submit-label]')||submitButton);
    var successSelector=form.getAttribute('data-success-target');
    var errorSelector=form.getAttribute('data-error-target');
    var success=successSelector?document.querySelector(successSelector):null;
    var error=errorSelector?document.querySelector(errorSelector):null;

    function currentLanguage(){return (document.documentElement.lang||'en').slice(0,2)==='es'?'es':'en';}
    function restoreButton(){
      form.removeAttribute('data-basin-submitting');
      if(!submitButton)return;
      submitButton.disabled=false;
      submitButton.removeAttribute('aria-busy');
      var translated=submitLabel&&submitLabel.getAttribute('data-'+currentLanguage());
      if(submitLabel&&translated!==null)submitLabel.innerHTML=translated;
    }

    if(!form.checkValidity()){form.reportValidity();return false;}
    if(error)error.hidden=true;
    form.setAttribute('data-basin-submitting','true');
    if(submitButton){submitButton.disabled=true;submitButton.setAttribute('aria-busy','true');}
    if(submitLabel)submitLabel.textContent='…';
    var submittedAt=form.querySelector('[name="submitted_at"]');
    if(submittedAt)submittedAt.value=new Date().toISOString();

    fetch(form.action,{
      method:(form.method||'POST').toUpperCase(),
      body:new FormData(form),
      headers:{Accept:'application/json'}
    }).then(function(response){
      if(!response.ok)throw new Error('Form submission rejected');
      form.hidden=true;
      form.style.display='none';
      if(success){success.hidden=false;success.style.display='block';}
      var eventName=form.getAttribute('data-ga-event');
      if(eventName&&typeof window.gtag==='function'){
        window.gtag('event',eventName,{
          event_category:form.getAttribute('data-ga-category')||'form',
          event_label:form.getAttribute('data-ga-label')||form.id||'basin_form'
        });
      }
    }).catch(function(){
      if(error)error.hidden=false;
      else window.alert(currentLanguage()==='es'?'No se ha podido enviar. Escríbenos a info@wolfblanc.com.':'The form could not be sent. Please email info@wolfblanc.com.');
      restoreButton();
    });
    return false;
  }

  window.WolfblancSubmitBasin=submitBasinForm;

  function configureBasinForms(){
    document.querySelectorAll('form[data-basin-form]').forEach(function(form){
      if(form.getAttribute('data-basin-ready')==='true')return;
      form.setAttribute('data-basin-ready','true');
      form.addEventListener('submit',function(event){
        if(event.__wbBasinHandled)return;
        submitBasinForm(form,event);
      });
    });
  }

  function configureSite(){
    configureLanguageSwitch();
    configureBasinForms();
  }

  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('[data-cookie-choice]');
    if(!button)return;
  },true);

  document.addEventListener('submit',function(event){
    var form=event.target&&event.target.closest&&event.target.closest('form[data-basin-form]');
    if(form)submitBasinForm(form,event);
  },true);

  loadAnalytics();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',configureSite);
  else configureSite();
})();
