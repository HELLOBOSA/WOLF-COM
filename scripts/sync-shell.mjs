import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const spanishSourcePaths=new Set([
  'arquitecto-comercial-retail-madrid/index.html',
  'arquitecto-residencial-madrid/index.html',
  'jefe-de-obra-project-manager-madrid/index.html',
  'marketing-growth-manager-madrid/index.html'
]);

function walk(dir){
  const found=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name==='.git'||entry.name==='node_modules')continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())found.push(...walk(full));
    else if(entry.name==='index.html'||entry.name==='404.html')found.push(full);
  }
  return found;
}

function prefixFor(file){
  const rel=path.relative(root,path.dirname(file));
  if(!rel)return '';
  return '../'.repeat(rel.split(path.sep).length);
}

function activeSection(file){
  const rel=path.relative(root,file).split(path.sep);
  return rel.length===1?'':rel[0];
}

const navItems=[
  ['studio/','STUDIO','ESTUDIO','studio'],
  ['services/','SERVICES','SERVICIOS','services'],
  ['portfolio/','PROJECTS','PROYECTOS','portfolio'],
  ['locations/','LOCATIONS','UBICACIONES','locations'],
  ['news/','JOURNAL','JOURNAL','news'],
  ['faq/','FAQ','FAQ','faq'],
  ['contact/','CONTACT','CONTACTO','contact']
];

const moon='<svg id="wb-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const sun='<svg id="wb-sun" style="display:none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const burgerOpen='<svg id="burger-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>';
const burgerClose='<svg id="burger-close-icon" style="display:none" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

function navMarkup(prefix,active){
  const desktop=navItems.map(([href,en,es,section])=>`        <a href="${prefix}${href}" class="nav-link${active===section?' active':''}" data-es="${es}" data-en="${en}"${active===section?' aria-current="page"':''}>${en}</a>`).join('\n');
  const mobile=navItems.map(([href,en,es,section])=>`    <a href="${prefix}${href}" data-es="${es}" data-en="${en}"${active===section?' aria-current="page" style="color:var(--accent)"':''}>${en}</a>`).join('\n');
  return `<nav id="nav">
  <div class="nav-bar">
    <a href="${prefix}" class="nav-logo" aria-label="Wolfblanc home">WOLFBLANC</a>
    <div class="nav-right">
      <div class="nav-links">
${desktop}
      </div>
      <div class="language-switch" aria-label="Select language" data-es-aria="Seleccionar idioma" data-en-aria="Select language"${active==='news'?' data-force-language-switch data-es-url="https://wolfblanc.es/journal/"':''}>
        <button class="lang-btn" type="button" data-lang-switch="es">ES</button>
        <button class="lang-btn active" type="button" data-lang-switch="en">EN</button>
      </div>
      <button class="theme-btn" id="theme-btn" type="button" aria-label="Toggle theme" data-es-aria="Cambiar tema" data-en-aria="Toggle theme">${moon}${sun}</button>
      <button class="burger-btn" id="burger-btn" type="button" aria-label="Menu" data-es-aria="Menú" data-en-aria="Menu">${burgerOpen}${burgerClose}</button>
    </div>
  </div>
  <div class="mob-menu" id="mob-menu">
${mobile}
  </div>
</nav>`;
}

function footerMarkup(prefix){
  return `<footer>
  <span data-es="WOLFBLANC&reg; ARCHITECTS &middot; &copy; 2026" data-en="WOLFBLANC&reg; ARCHITECTS &middot; &copy; 2026">WOLFBLANC&reg; ARCHITECTS &middot; &copy; 2026</span>
  <span><a href="${prefix}studio/" data-es="Estudio" data-en="Studio">Studio</a> &middot; <a href="${prefix}services/" data-es="Servicios" data-en="Services">Services</a> &middot; <a href="${prefix}portfolio/" data-es="Proyectos" data-en="Projects">Projects</a> &middot; <a href="${prefix}locations/" data-es="Ubicaciones" data-en="Locations">Locations</a> &middot; <a href="${prefix}faq/">FAQ</a> &middot; <a href="${prefix}careers/" data-es="Empleo" data-en="Careers">Careers</a> &middot; <a href="${prefix}newsletter/" data-es="Newsletter" data-en="Newsletter">Newsletter</a> &middot; <a href="${prefix}legal/" data-es="Aviso legal" data-en="Legal">Legal</a></span>
  <span><a href="mailto:info@wolfblanc.com">info@wolfblanc.com</a> &middot; <a href="https://wolfblanc.com">wolfblanc.com</a> &middot; <span data-es="Web por" data-en="Web by">Web by</span> <a href="https://eoloslab.com" target="_blank" rel="noopener">Eolos</a></span>
</footer>`;
}

function removeDirectAnalytics(html){
  html=html.replace(/\s*<script\b[^>]*src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-WKLWDZFNKC["'][^>]*><\/script>/gi,'');
  return html.replace(/\s*<script\b[^>]*>([\s\S]*?)<\/script>/gi,(whole,body)=>body.includes('window.dataLayer')&&body.includes('G-WKLWDZFNKC')?'':whole);
}

function makeEnglishSource(html){
  for(let pass=0;pass<3;pass++){
    html=html.replace(/<([a-z][\w-]*)([^>]*\bdata-en="([^"]*)"[^>]*)>([^<]*)<\/\1>/gi,(whole,tag,attrs,en)=>`<${tag}${attrs}>${en}</${tag}>`);
  }
  return html;
}

function normalizeLanguageSignals(html,file){
  const rel=path.relative(root,file).split(path.sep).join('/');
  const lang=spanishSourcePaths.has(rel)?'es':'en';
  html=html.replace(/<html\b([^>]*)\blang=["'][^"']*["']([^>]*)>/i,`<html$1lang="${lang}"$2>`);
  html=html.replace(/\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi,'');
  const canonical=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i)?.[1];
  if(canonical){
    const alternates=`\n  <link rel="alternate" hreflang="${lang}" href="${canonical}">\n  <link rel="alternate" hreflang="x-default" href="${canonical}">`;
    html=html.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i,`$1${alternates}`);
  }
  return html;
}

function normalizeEnglishMetadata(html){
  return html
    .replace(/<meta property="og:locale" content="es_ES">/g,'<meta property="og:locale" content="en_GB">')
    .replace(/"inLanguage":\s*"es(?:-ES)?"/g,'"inLanguage": "en"')
    .replace(/"name": "Inicio"/g,'"name": "Home"')
    .replace(/"name": "Estudio de arquitectura - Wolfblanc Architects"/g,'"name": "Wolfblanc Architects — International Architecture Studio"')
    .replace(/"name": "Estudio de arquitectura"/g,'"name": "Architecture studio"')
    .replace(/"description": "Wolfblanc es un estudio de arquitectura y diseño en Suecia, España y Grecia\. Vivienda, inversión, hostelería y arquitectura comercial\."/g,'"description": "Wolfblanc is an international architecture and design studio working across Spain, Sweden and Greece."')
    .replace(/"description": "Estudio de arquitectura en Suecia, España y Grecia\. Proyectos residenciales, de hostelería e inversión con precisión técnica e identidad mediterránea\. COAM N\.25160, WELL AP\."/g,'"description": "International architecture studio for residential, hospitality and investment projects across Spain, Sweden and Greece. COAM N.25160, SAR/MSA, TEE-TCG and WELL AP."')
    .replace(/"name": "España"/g,'"name": "Spain"')
    .replace(/"hasCredential": \["COAM N\.25160", "WELL AP"\]/g,'"hasCredential": ["COAM N.25160", "SAR/MSA", "TEE-TCG N.168011", "WELL AP"]');
}

function normalizeResponsePromise(html){
  return html
    .replace(/First consultation is free\. We respond within 24 hours\./g,'First consultation is free. We reply within two business days.')
    .replace(/La primera consulta es gratuita\. Respondemos en 24 horas\./g,'La primera consulta es gratuita. Respondemos en dos días laborables.')
    .replace(/Tell us about your project and location\. We will respond within 24 hours\./g,'Tell us about your project and location. We reply within two business days.')
    .replace(/We respond to every enquiry within 24 hours\./g,'We respond to every enquiry within two business days.');
}

let changed=0;
for(const file of walk(root)){
  let html=fs.readFileSync(file,'utf8');
  const before=html;
  const prefix=prefixFor(file);
  if(/<nav id="nav">[\s\S]*?<\/nav>/i.test(html))html=html.replace(/<nav id="nav">[\s\S]*?<\/nav>/i,navMarkup(prefix,activeSection(file)));
  if(/<footer>[\s\S]*?<\/footer>/i.test(html))html=html.replace(/<footer>[\s\S]*?<\/footer>/i,footerMarkup(prefix));
  html=removeDirectAnalytics(html);
  html=html.replace(/\s*<link\s+rel=["']preconnect["']\s+href=["']https:\/\/www\.googletagmanager\.com["'][^>]*>/gi,'');
  html=normalizeLanguageSignals(html,file);
  if(!spanishSourcePaths.has(path.relative(root,file).split(path.sep).join('/'))){
    html=makeEnglishSource(html);
    html=normalizeEnglishMetadata(html);
  }
  html=html.replace(/(["'])(?:\.\.\/)*favicon\.ico\1/g,`$1${prefix}favicon.ico$1`);
  html=html.replace(/(["'])(?:\.\.\/)*apple-touch-icon\.png\1/g,`$1${prefix}apple-touch-icon.png$1`);
  html=html.replace(/(["'])(?:\.\.\/)*images\/Horizon House 01\.webp\1/g,`$1${prefix}images/Horizon House 01.webp$1`);
  html=html.replace(/if\(t!==null\)el\.textContent=t;/g,'if(t!==null)el.innerHTML=t;');
  html=html.replace(/if\(val!==null\)el\.textContent=val;/g,'if(val!==null)el.innerHTML=val;');
  html=normalizeResponsePromise(html);
  if(!html.includes('assets/site-shell.css'))html=html.replace('</head>',`  <link rel="stylesheet" href="${prefix}assets/site-shell.css">\n</head>`);
  if(!html.includes('assets/site-core.js'))html=html.replace('</body>',`<script src="${prefix}assets/site-core.js" defer></script>\n</body>`);
  if(html!==before){fs.writeFileSync(file,html);changed++;}
}

console.log(`Synchronized shared shell across ${changed} HTML files.`);
