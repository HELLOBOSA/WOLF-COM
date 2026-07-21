import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const today='2026-07-21';

function walk(dir){
  const pages=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','assets','images','scripts'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())pages.push(...walk(full));
    else if(entry.name==='index.html')pages.push(full);
  }
  return pages;
}

function urlFor(file){
  const rel=path.relative(root,path.dirname(file)).split(path.sep).join('/');
  return rel?`https://wolfblanc.com/${rel}/`:'https://wolfblanc.com/';
}

function priority(url){
  const p=new URL(url).pathname;
  if(p==='/')return '1.0';
  if(['/studio/','/services/','/portfolio/','/locations/','/news/','/contact/'].includes(p))return '0.9';
  if(p==='/faq/'||p==='/careers/'||p==='/newsletter/')return '0.8';
  if(p.startsWith('/services/')||p.startsWith('/locations/')||p.startsWith('/portfolio/')||p.startsWith('/news/'))return '0.7';
  if(p==='/legal/')return '0.3';
  return '0.6';
}

function changefreq(url){
  const p=new URL(url).pathname;
  if(p==='/news/'||p==='/portfolio/')return 'weekly';
  if(p==='/legal/')return 'yearly';
  return 'monthly';
}

const urls=walk(root).map(urlFor).sort((a,b)=>{
  if(a==='https://wolfblanc.com/')return -1;
  if(b==='https://wolfblanc.com/')return 1;
  return a.localeCompare(b);
});

const rows=urls.map(url=>`  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq(url)}</changefreq>\n    <priority>${priority(url)}</priority>\n  </url>`).join('\n');
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`);
console.log(`Built sitemap.xml with ${urls.length} URLs.`);
