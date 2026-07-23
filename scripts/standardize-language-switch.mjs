import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
let changed=0;

function walk(directory){
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    if(entry.name.startsWith('.'))continue;
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory())walk(absolute);
    else if(entry.name.endsWith('.html')){
      const before=fs.readFileSync(absolute,'utf8');
      const after=before.replace(
        /(<button class="lang-btn(?: active)?" type="button" data-lang-switch="es">ES<\/button>)\s*(<button class="lang-btn(?: active)?" type="button" data-lang-switch="en">EN<\/button>)/g,
        '$2\n        $1'
      );
      if(after!==before){
        fs.writeFileSync(absolute,after);
        changed++;
      }
    }
  }
}

walk(root);
console.log(`Standardized language order to EN · ES on ${changed} pages.`);
