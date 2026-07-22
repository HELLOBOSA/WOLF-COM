import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts','project-media-manifest.json'),'utf8'));

function dimensions(relativePath){
  const output=execFileSync('sips',['-g','pixelWidth','-g','pixelHeight',path.join(root,relativePath)],{encoding:'utf8'});
  return {
    width:Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]||0),
    height:Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]||0)
  };
}

function escapeAttribute(value){
  return value.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
}

function replaceProjectCardImage(html,slug,image,title){
  const pattern=new RegExp(`(<a href="\\.\\.\\/portfolio\\/${slug}\\/" class="wb-card"[\\s\\S]*?<div class="card-img"><img class="wb-img" src=")[^"]+(" alt=")[^"]+(")`);
  return html.replace(pattern,`$1../${image.local}$2${escapeAttribute(title)}$3`);
}

let hub=fs.readFileSync(path.join(root,'portfolio','index.html'),'utf8');
for(const [slug,project] of Object.entries(manifest.projects)){
  const hero=project.images[0];
  hub=replaceProjectCardImage(hub,slug,hero,project.title);
  if(slug==='horizon'){
    hub=hub.replace(/(<a href="\.\.\/portfolio\/horizon\/" class="featured">[\s\S]*?<img class="wb-img" src=")[^"]+(" alt=")[^"]+(")/,`$1../${hero.local}$2${escapeAttribute(project.title)}$3`);
  }
}
fs.writeFileSync(path.join(root,'portfolio','index.html'),hub);

for(const [slug,project] of Object.entries(manifest.projects)){
  const file=path.join(root,'portfolio',slug,'index.html');
  let html=fs.readFileSync(file,'utf8');
  const hero=project.images[0];
  const heroDimensions=dimensions(hero.local);
  const absoluteHero=`https://wolfblanc.com/${hero.local}`;

  html=html.replace(/(<meta property="og:image" content=")[^"]+/,`$1${absoluteHero}`);
  html=html.replace(/(<meta name="twitter:image" content=")[^"]+/,`$1${absoluteHero}`);
  html=html.replace(/(<meta property="og:image:width" content=")[^"]+/,`$1${heroDimensions.width}`);
  html=html.replace(/(<meta property="og:image:height" content=")[^"]+/,`$1${heroDimensions.height}`);
  html=html.replace(/("image":\s*")https:\/\/wolfblanc\.com\/images\/[^"]+/,`$1${absoluteHero}`);
  html=html.replace(/(<div class="hero-img-wrap">\s*<img)\s+[^>]*>/,`$1 src="../../${hero.local}" alt="${escapeAttribute(project.title)} — Wolfblanc Architects" width="${heroDimensions.width}" height="${heroDimensions.height}" loading="eager" fetchpriority="high" decoding="async">`);
  html=html.replace(/\s*<section class="project-gallery"[\s\S]*?<\/section>\s*/i,'\n');

  const figures=project.images.slice(1).map((image,index)=>{
    const size=dimensions(image.local);
    return `    <figure><img src="../../${image.local}" alt="${escapeAttribute(project.title)} — project view ${index+2}" width="${size.width}" height="${size.height}" loading="lazy" decoding="async"><figcaption>${escapeAttribute(project.title)} · Wolfblanc Architects</figcaption></figure>`;
  }).join('\n');
  const gallery=`\n  <section class="project-gallery" aria-label="${escapeAttribute(project.title)} project gallery">\n${figures}\n  </section>\n`;
  html=html.replace(/(\s*<section class="cta-section">)/i,gallery+'$1');
  fs.writeFileSync(file,html);
}

console.log(`Aligned hub cards, heroes and full local galleries for ${Object.keys(manifest.projects).length} case studies.`);
