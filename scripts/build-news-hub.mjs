import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const file=path.join(root,'news/index.html');
const items=JSON.parse(fs.readFileSync(path.join(root,'news/articles-manifest.json'),'utf8'));
let html=fs.readFileSync(file,'utf8');

function attr(value=''){return value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function displayDate(date){return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z')).toUpperCase();}
const featured=items.find(item=>item.slug==='architecture-spain-sweden-greece-wolfblanc-practice')||items[0];
const categories=[...new Set(items.map(item=>item.category))];

const buttons=['All',...categories].map((category,index)=>`<button type="button" class="fbtn${index===0?' on':''}" data-filter="${attr(category)}">${category}</button>`).join('\n      ');
const cards=items.map(item=>`    <a href="./${item.slug}/" class="wb-card" data-cat="${attr(item.category)}">
      <div class="card-img"><img class="wb-img" src="../${item.localImage}" alt="${attr(item.title)}" loading="lazy" decoding="async"></div>
      <div class="card-body"><div class="card-meta"><span>${item.category}</span><span class="dim">· ${displayDate(item.date)}</span></div><h3 class="card-title">${item.title}</h3><p class="card-desc">${item.excerpt}</p><span class="wb-go">Read article →</span></div>
    </a>`).join('\n');

const main=`<main>
  <a href="./${featured.slug}/" class="featured">
    <div class="feat-img"><img class="wb-img" src="../${featured.localImage}" alt="${attr(featured.title)}" loading="eager" fetchpriority="high" decoding="async"><span class="feat-badge">Featured</span></div>
    <div class="feat-body"><div class="feat-meta"><span>${featured.category}</span><span class="dot"></span><span class="dim">${displayDate(featured.date)}</span></div><h2 class="feat-title">${featured.title}</h2><p class="feat-desc">${featured.excerpt}</p><span class="wb-go">Read article →</span></div>
  </a>
  <div class="filter-bar"><div class="filter-btns">${buttons}</div><span class="fcount"><span id="art-count">${items.length}</span> articles</span></div>
  <div class="grid3">${cards}</div>
  <div class="lm-wrap"><button type="button" class="lm-btn">Load more</button></div>
</main>`;

html=html.replace(/<title>[\s\S]*?<\/title>/i,'<title>Journal: Architecture Across Spain, Sweden & Greece - WOLFBLANC</title>');
html=html.replace(/<meta name="description" content="[^"]*">/i,'<meta name="description" content="Wolfblanc Journal: curated architecture, property, design, BIM, climate and hospitality insight across Spain, Sweden and Greece.">');
html=html.replace(/<meta property="og:title" content="[^"]*">/i,'<meta property="og:title" content="Wolfblanc Journal: Architecture Across Three Markets">');
html=html.replace(/<meta property="og:description" content="[^"]*">/i,'<meta property="og:description" content="Architecture, property, design and investment insight from Spain, Sweden and Greece.">');
html=html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i,'<h1>Architecture across three markets</h1>');
html=html.replace(/<p class="lead"[^>]*>[\s\S]*?<\/p>/i,'<p class="lead">Field notes on architecture, property, design, BIM, hospitality and climate from a practice working across Spain, Sweden and Greece.</p>');
html=html.replace(/<main>[\s\S]*?<\/main>/i,main);
html=html.replace(/var activeFilter='Todas';/g,"var activeFilter='All';");
html=html.replace(/activeFilter==='Todas'/g,"activeFilter==='All'");
fs.writeFileSync(file,html);
console.log(`Rebuilt Journal hub with ${items.length} curated articles across ${categories.length} filters.`);
