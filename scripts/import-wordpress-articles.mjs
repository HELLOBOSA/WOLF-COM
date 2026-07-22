import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=process.env.WOLFBLANC_WP_EXPORT||'/tmp/wolfblanc-posts.json';
if(!fs.existsSync(source))throw new Error(`WordPress export not found: ${source}`);
const posts=JSON.parse(fs.readFileSync(source,'utf8'));

const selectedSlugs=[
  'architecture-bim-information-system',
  'stockholm-brf-renovation-board-approvals-permits-and-what-foreign-owners-get-wrong',
  'architecture-in-mallorca-renovations-villas-and-what-foreign-buyers-should-know',
  'renovating-an-apartment-in-barcelona-permits-costs-and-common-mistakes',
  'buying-and-renovating-property-in-valencia-as-a-foreigner',
  'architecture-in-thessaloniki-neighborhoods-building-stock-and-renovation-opportunities-for-buyers',
  'architecture-in-marbella-villas-renovations-and-what-international-buyers-should-know',
  'luxury-villa-project-management-in-marbella-how-foreign-investors-control-cost-licenses-and-contractors',
  'boutique-hotel-renovation-in-spain-why-ffe-licensing-and-opening-readiness-must-be-managed-together',
  'commercial-hospitality-architecture-madrid',
  'what-nobody-tells-you-before-hiring-architecture-studio',
  'story-behind-wolfblanc-instinct-precision',
  'architecture-spain-sweden-greece-wolfblanc-practice',
  'wolfblancs-approach-to-sustainability',
  'well-ap-certification',
  'madrid-renovation-guide-costs-permits-timeline',
  'buying-property-madrid-foreigner-renovation-guide',
  'hiring-architect-spain-greece-foreign-buyer',
  'second-home-spain-architecture-renovation-guide',
  'wellbeing-by-design-architecture-health-mood',
  'renovation-mistakes-cost-most-to-fix',
  'swedish-design-thinking-southern-european-homes',
  'home-design-summer-year-round-living-spain-greece-sweden',
  'climate-responsive-architecture-spain-greece-sweden',
  'energy-efficient-homes-sweden-nordic-standard',
  'buying-home-sweden-foreigner-architecture-renovation',
  'greek-island-architecture-renovation-guide',
  'architecture-athens-neighborhoods-renovation-guide',
  'renovating-property-greece-foreign-buyer-guide',
  'architecture-light-design-brighter-home',
  'add-terrace-extension-garden-room-europe-permits',
  'building-pool-spain-greece-sweden-architecture',
  'design-home-ages-well-accessibility-architecture',
  'multi-generational-home-design-architecture'
];

const selected=selectedSlugs.map(slug=>posts.find(post=>post.slug===slug)).filter(Boolean);
if(selected.length!==selectedSlugs.length)throw new Error(`Expected ${selectedSlugs.length} selected posts, found ${selected.length}`);

function strip(value=''){
  return value.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&#8217;/g,"'").replace(/&#038;|&amp;/g,'&').replace(/\s+/g,' ').trim();
}
function attr(value=''){return strip(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function category(post){
  const s=(post.slug+' '+strip(post.title.rendered)).toLowerCase();
  const overrides={
    'renovating-an-apartment-in-barcelona-permits-costs-and-common-mistakes':'Places',
    'luxury-villa-project-management-in-marbella-how-foreign-investors-control-cost-licenses-and-contractors':'Property & Investment',
    'hiring-architect-spain-greece-foreign-buyer':'Property & Investment',
    'swedish-design-thinking-southern-european-homes':'Design & Wellbeing'
  };
  if(overrides[post.slug])return overrides[post.slug];
  if(/hotel|hospitality|commercial/.test(s))return 'Hospitality & Commercial';
  if(/wolfblanc|studio|trademark|well-ap-certification|sustainability/.test(s))return 'Studio';
  if(/bim|climate|energy|mistake|pool|terrace|extension/.test(s))return 'Technology & Climate';
  if(/wellbeing|light|ages-well|multi-generational|summer|scandinavian-design/.test(s))return 'Design & Wellbeing';
  if(/stockholm|mallorca|barcelona|valencia|thessaloniki|marbella|athens|greece|greek-island|sweden/.test(s))return 'Places';
  return 'Property & Investment';
}
function imageUrl(post){
  const html=post.content.rendered||'';
  const candidates=[...html.matchAll(/(?:src|data-src)=["'](https:\/\/wolfblanc\.com\/wp-content\/uploads\/[^"']+?\.webp)["']/gi)].map(match=>match[1]);
  return candidates[0]||'';
}
function cleanInline(value){
  return value.replace(/<a\b[^>]*>/gi,'').replace(/<\/a>/gi,'').replace(/<(?!\/?(?:strong|em|br)\b)[^>]+>/gi,'').trim();
}
function cleanBody(post){
  let raw=post.content.rendered||'';
  const formIndex=raw.search(/<form\b/i);if(formIndex>=0)raw=raw.slice(0,formIndex);
  raw=raw.replace(/<noscript[\s\S]*?<\/noscript>/gi,'').replace(/<figure[\s\S]*?<\/figure>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  const blocks=[];
  const pattern=/<(h2|h3|p|ul|ol|blockquote|table)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for(const match of raw.matchAll(pattern)){
    const tag=match[1].toLowerCase();
    let inside=match[2];
    if(tag==='p'&&!strip(inside))continue;
    if(tag==='h2'||tag==='h3')blocks.push(`<${tag}>${cleanInline(inside)}</${tag}>`);
    else if(tag==='p')blocks.push(`<p>${cleanInline(inside)}</p>`);
    else if(tag==='ul'||tag==='ol'){
      const items=[...inside.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(item=>`<li>${cleanInline(item[1])}</li>`).join('');
      if(items)blocks.push(`<${tag}>${items}</${tag}>`);
    }else if(tag==='blockquote')blocks.push(`<blockquote>${strip(inside)}</blockquote>`);
    else if(tag==='table')blocks.push(`<table>${inside.replace(/<([a-z0-9]+)\b[^>]*>/gi,'<$1>')}</table>`);
  }
  return blocks.join('\n');
}
function displayDate(date){return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'Z'));}

const manifest=selected.map(post=>{
  const sourceImage=imageUrl(post);
  return {slug:post.slug,title:strip(post.title.rendered),excerpt:strip(post.excerpt.rendered),date:post.date.slice(0,10),modified:post.modified.slice(0,10),category:category(post),sourceImage,localImage:sourceImage?`images/journal/${post.slug}.webp`:'images/wolfblanc-team.webp'};
});
fs.mkdirSync(path.join(root,'images/journal'),{recursive:true});
fs.writeFileSync(path.join(root,'news/articles-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'scripts/article-images.tsv'),manifest.filter(item=>item.sourceImage).map(item=>`${item.sourceImage}\t${item.localImage}`).join('\n')+'\n');

function relatedFor(item){return manifest.filter(other=>other.slug!==item.slug&&other.category===item.category).slice(0,3);}
function card(item){return `<a href="../${item.slug}/" class="rel-card"><div class="rel-img-wrap"><img class="rel-img" src="../../${item.localImage}" alt="${attr(item.title)}" loading="lazy" decoding="async"></div><div class="rel-body"><p class="rel-cat">${item.category}</p><p class="rel-title">${item.title}</p></div></a>`;}

for(const post of selected){
  const item=manifest.find(entry=>entry.slug===post.slug);
  const body=cleanBody(post);
  if(body.length<1500)throw new Error(`Sanitised article is unexpectedly short: ${post.slug}`);
  const schema={'@context':'https://schema.org','@type':'Article',headline:item.title,description:item.excerpt,image:`https://wolfblanc.com/${item.localImage}`,datePublished:item.date,dateModified:item.modified,articleSection:item.category,inLanguage:'en',author:{'@type':'Organization',name:'Wolfblanc Architects'},publisher:{'@type':'Organization',name:'Wolfblanc Architects',logo:{'@type':'ImageObject',url:'https://wolfblanc.com/images/210-sq-white-02.webp'}},mainEntityOfPage:`https://wolfblanc.com/news/${item.slug}/`};
  const html=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${item.title} - WOLFBLANC ARCHITECTS</title>
  <meta name="description" content="${attr(item.excerpt)}"><meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://wolfblanc.com/news/${item.slug}/"><link rel="alternate" hreflang="en" href="https://wolfblanc.com/news/${item.slug}/"><link rel="alternate" hreflang="x-default" href="https://wolfblanc.com/news/${item.slug}/">
  <meta property="og:type" content="article"><meta property="og:title" content="${attr(item.title)}"><meta property="og:description" content="${attr(item.excerpt)}"><meta property="og:url" content="https://wolfblanc.com/news/${item.slug}/"><meta property="og:image" content="https://wolfblanc.com/${item.localImage}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(item.title)}"><meta name="twitter:description" content="${attr(item.excerpt)}"><meta name="twitter:image" content="https://wolfblanc.com/${item.localImage}">
  <link rel="icon" href="../../favicon.ico"><link rel="apple-touch-icon" href="../../apple-touch-icon.png"><link rel="stylesheet" href="../../assets/article.css"><link rel="stylesheet" href="../../assets/site-shell.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
<nav id="nav"></nav>
<header class="art-header"><a href="../" class="back-link">← Journal</a><div class="art-meta"><span>${item.category}</span><span class="dot"></span><span class="dim">${displayDate(post.date)}</span><span class="dot"></span><span class="dim">Wolfblanc Architects</span></div><h1>${item.title}</h1><p class="art-lead">${item.excerpt}</p><div class="art-byline"><div class="byline-avatar"><img src="../../images/210-sq-white-02.webp" alt="Wolfblanc Architects" width="34" height="34"></div><p class="byline-text"><strong>Wolfblanc Architects</strong><br>Spain · Sweden · Greece</p></div></header>
<div class="hero-img"><div class="hero-img-wrap"><img src="../../${item.localImage}" alt="${attr(item.title)}" loading="eager" fetchpriority="high" decoding="async"></div><p class="img-caption">Wolfblanc Architects</p></div>
<main><article class="wb-body">${body}</article><section class="cta-section"><div class="cta-bg">WOLFBLANC</div><div class="cta-inner"><span class="cta-ey">PLANNING A PROJECT?</span><p class="cta-title">Every good project starts with a clear conversation.</p><div class="cta-btns"><a href="mailto:info@wolfblanc.com" class="btn-em">Email us</a><a href="../../contact/" class="btn-ct">Tell us about your project →</a></div><p class="cta-note">A senior partner reads every enquiry · reply within two business days</p></div></section><section class="related"><div class="related-inner"><span class="rel-ey">MORE FROM THE JOURNAL</span><div class="rel-grid">${relatedFor(item).map(card).join('')}</div></div></section></main>
<footer></footer><button id="btt" aria-label="Back to top">↑</button>
<div class="cookie-banner" id="cookie-banner" role="region" aria-label="Cookie notice" hidden><div class="cookie-copy"><span class="cookie-title">We use cookies</span><a class="cookie-link" href="../../legal/#cookies">More info</a></div><div class="cookie-actions"><button class="cookie-btn" type="button" data-cookie-choice="reject">Reject</button><button class="cookie-btn accept" type="button" data-cookie-choice="accept">Accept</button></div></div>
<script src="../../assets/article-page.js" defer></script><script src="../../assets/site-core.js" defer></script>
</body></html>`;
  const dir=path.join(root,'news',post.slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}

console.log(`Generated ${selected.length} curated English journal articles.`);
