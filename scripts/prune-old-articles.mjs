import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const newsDir=path.join(root,'news');
const manifest=JSON.parse(fs.readFileSync(path.join(newsDir,'articles-manifest.json'),'utf8'));
const keep=new Set(manifest.map(item=>item.slug));
let removed=0;
for(const entry of fs.readdirSync(newsDir,{withFileTypes:true})){
  if(!entry.isDirectory()||keep.has(entry.name))continue;
  const target=path.join(newsDir,entry.name);
  if(!fs.existsSync(path.join(target,'index.html')))continue;
  fs.rmSync(target,{recursive:true});
  removed++;
}
console.log(`Removed ${removed} superseded article directories; ${keep.size} curated articles remain.`);
