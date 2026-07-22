import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const newsDir=path.join(root,'news');
let changed=0;

for(const entry of fs.readdirSync(newsDir,{withFileTypes:true})){
  if(!entry.isDirectory())continue;
  const file=path.join(newsDir,entry.name,'index.html');
  if(!fs.existsSync(file))continue;
  const before=fs.readFileSync(file,'utf8');
  const after=before
    .replace(/using the form below/gi,'using the contact options below')
    .replace(/use the form below/gi,'use the contact options below')
    .replace(/through the form below/gi,'through the contact options below')
    .replace(/we will respond within 48 hours/gi,'a senior partner will reply within two business days')
    .replace(/we respond within 48 hours/gi,'a senior partner will reply within two business days')
    .replace(/ and a senior partner will reply within two business days/gi,', and a senior partner will reply within two business days')
    .replace(/\. a senior partner will reply within two business days/gi,'. A senior partner will reply within two business days');
  if(after!==before){fs.writeFileSync(file,after);changed+=1;}
}

console.log(`Updated contact invitations in ${changed} journal articles.`);
