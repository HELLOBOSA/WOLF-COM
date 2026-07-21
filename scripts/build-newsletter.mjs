import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
let html=fs.readFileSync(path.join(root,'faq/index.html'),'utf8');

html=html
  .replace(/<title>[\s\S]*?<\/title>/,'<title>Newsletter - WOLFBLANC ARCHITECTS</title>')
  .replace(/<meta name="description"[^>]*>/,'<meta name="description" content="Architecture, projects and practical intelligence from Wolfblanc across Spain, Sweden and Greece. Occasional notes, never noise.">')
  .replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://wolfblanc.com/newsletter/">')
  .replace(/\s*<link rel="alternate"[^>]*>/g,'')
  .replace(/<meta property="og:title"[^>]*>/,'<meta property="og:title" content="Newsletter - WOLFBLANC ARCHITECTS">')
  .replace(/<meta property="og:description"[^>]*>/,'<meta property="og:description" content="Architecture, projects and practical intelligence from Wolfblanc across three markets.">')
  .replace(/<meta property="og:url"[^>]*>/,'<meta property="og:url" content="https://wolfblanc.com/newsletter/">')
  .replace(/<meta name="twitter:title"[^>]*>/,'<meta name="twitter:title" content="Newsletter - WOLFBLANC ARCHITECTS">')
  .replace(/<meta name="twitter:description"[^>]*>/,'<meta name="twitter:description" content="Architecture, projects and practical intelligence from Wolfblanc across three markets.">')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"WebPage",
    "@id":"https://wolfblanc.com/newsletter/#webpage",
    "url":"https://wolfblanc.com/newsletter/",
    "name":"Newsletter - WOLFBLANC ARCHITECTS",
    "description":"Architecture, projects and practical intelligence from Wolfblanc across Spain, Sweden and Greece.",
    "inLanguage":"en",
    "isPartOf":{"@type":"WebSite","@id":"https://wolfblanc.com/#website"}
  }
  </script>`);

const extraCss=`
    .newsletter-wrap{max-width:900px;margin:0 auto;padding:88px 32px 112px;display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.78fr);gap:72px;align-items:start}
    .newsletter-copy .eyebrow{margin-bottom:16px}.newsletter-copy h2{font-size:clamp(1.25rem,2.6vw,2rem);font-weight:200;line-height:1.35;letter-spacing:.05em;margin-bottom:26px}
    .newsletter-copy p{color:var(--text2);font-size:1rem;line-height:1.8;margin-bottom:20px}.newsletter-list{list-style:none;margin-top:34px;border-top:1px solid var(--line)}
    .newsletter-list li{padding:15px 0;border-bottom:1px solid var(--line);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text2)}
    .newsletter-form{border:1px solid var(--line);padding:34px;background:color-mix(in srgb,var(--accent) 4%,transparent)}
    .newsletter-form label{display:block;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text2);margin-bottom:9px}
    .newsletter-form input[type=email],.newsletter-form input[type=text]{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);font:300 1rem/1.5 inherit;padding:10px 0 13px;margin-bottom:28px;outline:0}
    .newsletter-form input:focus{border-color:var(--accent)}.newsletter-consent{display:flex;gap:10px;align-items:flex-start;font-size:.72rem;line-height:1.55;color:var(--text2);margin:0 0 28px;text-transform:none;letter-spacing:.01em}
    .newsletter-consent input{margin-top:4px}.newsletter-consent a{color:var(--accent);text-decoration:underline;text-underline-offset:3px}
    .newsletter-submit{width:100%;border:1px solid var(--accent);background:var(--accent);color:var(--bg);padding:15px 20px;font:300 .62rem/1 inherit;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}.newsletter-submit:hover{background:var(--text);border-color:var(--text)}
    .newsletter-note{font-size:.68rem!important;margin:20px 0 0!important}.archive-link{color:var(--accent);text-decoration:underline;text-underline-offset:4px}
    @media(max-width:760px){.newsletter-wrap{grid-template-columns:1fr;gap:48px;padding:64px 24px 88px}.newsletter-form{padding:26px}}
`;
html=html.replace('</style>',`${extraCss}\n  </style>`);

html=html.replace(/<header class="hero">[\s\S]*?<\/header>/,`<header class="hero">
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <a href="../" class="back-link" data-es="← Inicio" data-en="← Home">← Home</a>
    <span class="eyebrow" data-es="NOTAS DEL ESTUDIO · WOLFBLANC" data-en="NOTES FROM THE STUDIO · WOLFBLANC">NOTES FROM THE STUDIO · WOLFBLANC</span>
    <h1 data-es="Arquitectura, sin ruido" data-en="Architecture, without the noise">Architecture, without the noise</h1>
    <p class="lead" data-es="Una selección ocasional de proyectos, lugares e ideas prácticas desde España, Suecia y Grecia." data-en="An occasional selection of projects, places and practical thinking from Spain, Sweden and Greece.">An occasional selection of projects, places and practical thinking from Spain, Sweden and Greece.</p>
  </div>
</header>`);

html=html.replace(/<main>[\s\S]*?<\/main>/,`<main>
  <section class="newsletter-wrap">
    <div class="newsletter-copy">
      <span class="eyebrow" data-es="QUÉ RECIBIRÁS" data-en="WHAT YOU WILL RECEIVE">WHAT YOU WILL RECEIVE</span>
      <h2 data-es="Una lectura útil para quien toma decisiones sobre espacios y propiedades" data-en="A useful read for people making decisions about places and property">A useful read for people making decisions about places and property</h2>
      <p data-es="Compartimos proyectos recientes, observaciones de obra y orientación práctica para propietarios, inversores y operadores. El contenido cruza nuestros tres mercados sin convertirse en un boletín promocional semanal." data-en="We share recent work, observations from delivery and practical guidance for homeowners, investors and operators. The perspective crosses our three markets without becoming a weekly promotional bulletin.">We share recent work, observations from delivery and practical guidance for homeowners, investors and operators. The perspective crosses our three markets without becoming a weekly promotional bulletin.</p>
      <ul class="newsletter-list">
        <li data-es="Proyectos y procesos" data-en="Projects and process">Projects and process</li>
        <li data-es="Arquitectura, paisaje e interiores" data-en="Architecture, landscape and interiors">Architecture, landscape and interiors</li>
        <li data-es="Compra, reforma y entrega internacional" data-en="International buying, renovation and delivery">International buying, renovation and delivery</li>
        <li data-es="España · Suecia · Grecia" data-en="Spain · Sweden · Greece">Spain · Sweden · Greece</li>
      </ul>
      <p class="newsletter-note"><a class="archive-link" href="../news/" data-es="Explorar el Journal →" data-en="Explore the Journal →">Explore the Journal →</a></p>
    </div>
    <form class="newsletter-form" action="https://usebasin.com/f/ce6160f80c8b" method="POST">
      <input type="hidden" name="_subject" value="Newsletter subscription, wolfblanc.com">
      <input type="hidden" name="source" value="wolfblanc.com/newsletter">
      <label for="newsletter-name" data-es="Nombre" data-en="Name">Name</label>
      <input id="newsletter-name" name="name" type="text" autocomplete="name">
      <label for="newsletter-email" data-es="Correo electrónico" data-en="Email">Email</label>
      <input id="newsletter-email" name="email" type="email" autocomplete="email" required>
      <label class="newsletter-consent"><input type="checkbox" name="privacy_consent" value="agreed" required><span><span data-es="Acepto recibir el newsletter y he leído la" data-en="I agree to receive the newsletter and have read the">I agree to receive the newsletter and have read the</span> <a href="../legal/#datos" data-es="política de privacidad" data-en="privacy policy">privacy policy</a>. <span data-es="Puedo darme de baja en cualquier momento." data-en="I can unsubscribe at any time.">I can unsubscribe at any time.</span></span></label>
      <button class="newsletter-submit" type="submit" data-es="Suscribirme →" data-en="Subscribe →">Subscribe →</button>
      <p class="newsletter-note" data-es="Solo enviamos cuando tenemos algo que merece la pena leer." data-en="We only send when there is something worth reading.">We only send when there is something worth reading.</p>
    </form>
  </section>
</main>`);

const out=path.join(root,'newsletter/index.html');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,html);
console.log('Built newsletter/index.html');
