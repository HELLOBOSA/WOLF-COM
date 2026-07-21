import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];

function walk(dir){
  const files=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name==='.git')continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const all=walk(root);
const pages=all.filter(f=>f.endsWith('.html'));
function existsTarget(file,raw){
  if(!raw||raw.startsWith('#')||/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(raw))return true;
  let clean=raw.split('#')[0].split('?')[0];
  try{clean=decodeURIComponent(clean)}catch{}
  const target=clean.startsWith('/')?path.join(root,clean):path.resolve(path.dirname(file),clean);
  if(fs.existsSync(target))return true;
  if(fs.existsSync(path.join(target,'index.html')))return true;
  return false;
}

for(const file of pages){
  const rel=path.relative(root,file);
  const html=fs.readFileSync(file,'utf8');
  if(!html.trim())errors.push(`${rel}: empty file`);
  if(file.endsWith('404.html'))continue;
  if(!/<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']/i.test(html))errors.push(`${rel}: missing staging noindex`);
  if(/wp-content\/uploads/i.test(html))errors.push(`${rel}: depends on WordPress uploads`);
  if(/googletagmanager\.com\/gtag\/js/i.test(html))errors.push(`${rel}: loads analytics before consent`);
  if(/href=["'][^"']*\.\.\/#inquiry/i.test(html))errors.push(`${rel}: obsolete homepage inquiry link`);
  if((html.match(/<link\s+rel=["']canonical["']/gi)||[]).length>1)errors.push(`${rel}: duplicate canonical links`);
  for(const block of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{JSON.parse(block[1])}catch(error){errors.push(`${rel}: invalid JSON-LD (${error.message})`);}
  }
  const nav=(html.match(/<nav id="nav">/g)||[]).length;
  const footer=(html.match(/<footer>/g)||[]).length;
  if(nav!==1)errors.push(`${rel}: expected one global nav, found ${nav}`);
  if(footer!==1)errors.push(`${rel}: expected one global footer, found ${footer}`);
  const desktop=html.match(/<div class="nav-links">([\s\S]*?)<\/div>/)?.[1]||'';
  const navLinks=(desktop.match(/class="nav-link/g)||[]).length;
  if(navLinks!==7)errors.push(`${rel}: expected seven desktop nav links, found ${navLinks}`);
  for(const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
    if(!existsTarget(file,match[1]))errors.push(`${rel}: missing local target ${match[1]}`);
  }
}

const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
for(const url of sitemapUrls){
  const pathname=new URL(url).pathname;
  const target=pathname==='/'?path.join(root,'index.html'):path.join(root,pathname,'index.html');
  if(!fs.existsSync(target))errors.push(`sitemap: missing page ${url}`);
}
const expectedPages=pages.filter(f=>!f.endsWith('404.html')).length;
if(sitemapUrls.length!==expectedPages)errors.push(`sitemap: ${sitemapUrls.length} URLs for ${expectedPages} index pages`);

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Audit passed: ${pages.length} HTML files, ${sitemapUrls.length} sitemap URLs, no missing local links or media.`);
