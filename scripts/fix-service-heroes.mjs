import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const heroImages={
  architecture:['Casa Boadilla 01.webp','Architecture project by Wolfblanc Architects'],
  'landscape-architecture':['Market Regeneration 02.webp','Landscape architecture by Wolfblanc Architects'],
  'residential-interiors':['Boutique Apartment V1_01.webp','Residential interior by Wolfblanc Architects'],
  'commercial-interiors-hospitality':['Bistro Dterra 01.webp','Hospitality interior by Wolfblanc Architects'],
  'project-management':['Luxury Renovation A75_01.webp','Project delivery by Wolfblanc Architects'],
  'urban-design':['Market Regeneration 01.webp','Urban design by Wolfblanc Architects'],
  bim:['Distrito AXIS 01.webp','BIM consultancy by Wolfblanc Architects'],
  wellbeing:['Senior Coliving 01.webp','Well-being-led architecture by Wolfblanc Architects'],
  'due-diligence':['Edificio Salamanca 01.webp','Technical due diligence by Wolfblanc Architects'],
  visualization:['Nexus museum 01.webp','Architectural visualization by Wolfblanc Architects']
};

for(const [slug,[image,alt]] of Object.entries(heroImages)){
  const file=path.join(root,'services',slug,'index.html');
  let html=fs.readFileSync(file,'utf8');
  const intro=html.match(/<article class="wb-body">\s*<span class="eyebrow">([\s\S]*?)<\/span>\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*<p class="opening">([\s\S]*?)<\/p>/);
  if(!intro){
    if(html.includes('<p class="img-caption">Wolfblanc Architects</p>'))continue;
    throw new Error(`Service introduction not found: ${slug}`);
  }
  const [,eyebrow,title,lead]=intro;
  html=html.replace(/<header class="hero">[\s\S]*?<\/header>/,`<header class="hero">
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <a href="../../" class="back-link" data-es="← Inicio" data-en="← Home">← Home</a>
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</header>`);
  html=html.replace(/<div class="hero-img">\s*<div class="hero-img-wrap">\s*<img[^>]*>\s*<\/div>\s*<p class="img-caption"[^>]*>[\s\S]*?<\/p>\s*<\/div>/,`<div class="hero-img">
  <div class="hero-img-wrap">
    <img src="../../images/${image}" alt="${alt}" loading="eager" fetchpriority="high" decoding="async">
  </div>
  <p class="img-caption">Wolfblanc Architects</p>
</div>`);
  html=html.replace(intro[0],'<article class="wb-body">');
  fs.writeFileSync(file,html);
}

console.log(`Updated ${Object.keys(heroImages).length} service heroes.`);
