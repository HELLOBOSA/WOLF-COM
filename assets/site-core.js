(function(){
  'use strict';
  var measurementId='G-WKLWDZFNKC';
  var storageKey='wb-cookie-choice';
  // Two independent switches: WB_BANNER_ENABLED renders the banner,
  // WB_CONSENT_ENFORCED makes tracking wait for and obey the choice.
  if(window.WB_BANNER_ENABLED===undefined)window.WB_BANNER_ENABLED=true;
  if(window.WB_CONSENT_ENFORCED===undefined)window.WB_CONSENT_ENFORCED=false;

  function pushConsent(choice){
    if(window.WB_CONSENT_ENFORCED===false)return;
    var g=choice==='accept'?'granted':'denied';
    if(window.gtag)window.gtag('consent','update',{ad_storage:g,ad_user_data:g,ad_personalization:g,analytics_storage:g});
  }

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
    var granted=!window.WB_CONSENT_ENFORCED||readConsent()==='accept';
    var cg=granted?'granted':'denied';
    var cd={ad_storage:cg,ad_user_data:cg,ad_personalization:cg,analytics_storage:cg,functionality_storage:'granted',security_storage:'granted'};
    if(window.WB_CONSENT_ENFORCED)cd.wait_for_update=500;
    window.gtag('consent','default',cd);
    window.gtag('js',new Date());
    window.gtag('config',measurementId,{
      anonymize_ip:true,
      linker:{domains:['wolfblanc.com','wolfblanc.es','wolfblanc.se','wolfblanc.gr'],accept_incoming:true}
    });
    var script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies(){
    ['_ga','_gid','_gat','_ga_'+measurementId.slice(2)].forEach(function(name){
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

  function configureCalEmbeds(){
    var triggers=document.querySelectorAll('[data-wb-cal-trigger]');
    if(!triggers.length)return;

    (function(C,A,L){
      var p=function(a,ar){a.q.push(ar);};
      var d=C.document;
      C.Cal=C.Cal||function(){
        var cal=C.Cal;
        var ar=arguments;
        if(!cal.loaded){
          cal.ns={};
          cal.q=cal.q||[];
          d.head.appendChild(d.createElement('script')).src=A;
          cal.loaded=true;
        }
        if(ar[0]===L){
          var api=function(){p(api,arguments);};
          var namespace=ar[1];
          api.q=api.q||[];
          if(typeof namespace==='string'){
            cal.ns[namespace]=cal.ns[namespace]||api;
            p(cal.ns[namespace],ar);
            p(cal,['initNamespace',namespace]);
          }else p(cal,ar);
          return;
        }
        p(cal,ar);
      };
    })(window,'https://app.cal.com/embed/embed.js','init');

    window.Cal('init','30min',{origin:'https://app.cal.com'});
    window.Cal.config=window.Cal.config||{};
    window.Cal.config.forwardQueryParams=true;

    var cssVarsPerTheme={
      light:{
        'cal-brand':'#0d0b0a','cal-brand-emphasis':'#94856a','cal-brand-text':'#f4f1ea',
        'cal-brand-subtle':'#c3b087','cal-brand-accent':'#f4f1ea','cal-text':'#6a655b',
        'cal-text-emphasis':'#0d0b0a','cal-text-subtle':'#6a655b','cal-text-muted':'#aaa397',
        'cal-text-inverted':'#f4f1ea','cal-bg':'#f4f1ea','cal-bg-emphasis':'#e7e1d6',
        'cal-bg-subtle':'#eee9e0','cal-bg-muted':'#f8f5ef','cal-bg-inverted':'#0d0b0a',
        'cal-border':'#d8d0c1','cal-border-emphasis':'#94856a','cal-border-subtle':'#e1d9cc',
        'radius-xl':'0px','radius-2xl':'0px','radius-3xl':'0px'
      },
      dark:{
        'cal-brand':'#c3b087','cal-brand-emphasis':'#f0ede7','cal-brand-text':'#0d0b0a',
        'cal-brand-subtle':'#94856a','cal-brand-accent':'#0d0b0a','cal-text':'#8f887c',
        'cal-text-emphasis':'#f0ede7','cal-text-subtle':'#a39b8e','cal-text-muted':'#655f56',
        'cal-text-inverted':'#0d0b0a','cal-bg':'#0d0b0a','cal-bg-emphasis':'#29241e',
        'cal-bg-subtle':'#191612','cal-bg-muted':'#100e0c','cal-bg-inverted':'#f0ede7',
        'cal-border':'#3a342c','cal-border-emphasis':'#c3b087','cal-border-subtle':'#2b2721',
        'radius-xl':'0px','radius-2xl':'0px','radius-3xl':'0px'
      }
    };

    function currentTheme(){
      var root=document.documentElement;
      return root.classList.contains('dark')||root.classList.contains('wb-dark')?'dark':'light';
    }
    function applyCalTheme(){
      var theme=currentTheme();
      triggers.forEach(function(trigger){
        trigger.setAttribute('data-cal-link','wolfblanc/30min');
        trigger.setAttribute('data-cal-namespace','30min');
        trigger.setAttribute('aria-haspopup','dialog');
        trigger.setAttribute('data-cal-config',JSON.stringify({
          layout:'month_view',
          useSlotsViewOnSmallScreen:'true',
          theme:theme,
          utm_source:'wolfblanc.com',
          utm_medium:'website',
          utm_campaign:'introductory_call',
          utm_content:window.location.pathname
        }));
      });
      window.Cal.ns['30min']('ui',{
        theme:theme,
        hideEventTypeDetails:false,
        layout:'month_view',
        cssVarsPerTheme:cssVarsPerTheme
      });
    }

    applyCalTheme();
    triggers.forEach(function(trigger){
      trigger.addEventListener('click',function(event){
        var theme=currentTheme();
        event.preventDefault();
        event.stopImmediatePropagation();
        applyCalTheme();
        window.Cal.ns['30min']('modal',{
          calLink:'wolfblanc/30min',
          config:{
            layout:'month_view',
            useSlotsViewOnSmallScreen:'true',
            theme:theme,
            utm_source:'wolfblanc.com',
            utm_medium:'website',
            utm_campaign:'introductory_call',
            utm_content:window.location.pathname
          }
        });
      },true);
    });
    var themeButton=document.getElementById('theme-btn');
    if(themeButton)themeButton.addEventListener('click',function(){window.setTimeout(applyCalTheme,0);});
  }

  function configureSite(){
    configureLanguageSwitch();
    configureBasinForms();
    configureCalEmbeds();
  }

  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('[data-cookie-choice]');
    if(!button)return;
    var choice=button.getAttribute('data-cookie-choice');
    if(choice==='accept'){loadAnalytics();pushConsent('accept');}
    else{pushConsent('reject');clearAnalyticsCookies();}
  },true);

  document.addEventListener('submit',function(event){
    var form=event.target&&event.target.closest&&event.target.closest('form[data-basin-form]');
    if(form)submitBasinForm(form,event);
  },true);

  loadAnalytics();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',configureSite);
  else configureSite();
})();
