import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const projects={
  'horizon':['Horizon House 02.webp','Horizon House 03.webp'],
  'a75':['Luxury Renovation A75_02.webp','Luxury Renovation A75_03.webp'],
  'bistro-dterra-cafe-restaurant-interior-design':['Bistro Dterra 02.webp'],
  'boutique-apartment-v1':['Boutique Apartment V1_02.webp','Boutique Apartment V1_03.webp'],
  'k38':['Residential Rehabilitation K38_02.webp','Residential Rehabilitation K38_03.webp'],
  'casa-boadilla-madrid-luxury-family-residence':['Casa Boadilla 02.webp','Casa Boadilla 03.webp'],
  'edificio-salamanca':['Edificio Salamanca 02.webp'],
  'norrsken-office-workplace-design':['Norrsken Office 02.webp'],
  'market-regeneration':['Market Regeneration 02.webp','Market Regeneration 03.webp'],
  'senior-coliving':['Senior Coliving 02.webp'],
  'museum':['Nexus museum 02.webp'],
  'selva-boutique-luxury-design':['Selva Hotel 02.webp'],
  'axis':['Distrito AXIS 02.webp'],
  'granolita-coffee-boutique-cafe-interior-project':['Granolita Coffee Brand 02.webp'],
  'k12':['Compact Living Concept K12_02.webp']
};

for(const [slug,images] of Object.entries(projects)){
  const file=path.join(root,'portfolio',slug,'index.html');
  if(!fs.existsSync(file))continue;
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/\s*<section class="project-gallery[\s\S]*?<\/section>\s*/i,'\n');
  const title=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||slug).replace(/<[^>]+>/g,'').trim();
  const figures=images.map((image,index)=>`    <figure><img src="../../images/${image}" alt="${title} — project view ${index+2}" loading="lazy" decoding="async"><figcaption>${title} · Wolfblanc Architects</figcaption></figure>`).join('\n');
  const gallery=`\n  <section class="project-gallery${images.length===1?' single':''}" aria-label="${title} project gallery">\n${figures}\n  </section>\n`;
  html=html.replace(/(\s*<section class="cta-section">)/i,gallery+'$1');
  html=html.replace(/Wolfblanc Architects's\s+philosophy/g,'Wolfblanc Architects’ philosophy');
  fs.writeFileSync(file,html);
}

console.log(`Enhanced ${Object.keys(projects).length} case studies with local WebP galleries.`);
