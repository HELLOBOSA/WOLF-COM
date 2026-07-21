import fs from 'node:fs';
import path from 'node:path';

const file=path.resolve(import.meta.dirname,'../faq/index.html');
let html=fs.readFileSync(file,'utf8');

function decode(value){
  return value
    .replace(/&amp;/g,'&')
    .replace(/&quot;/g,'"')
    .replace(/&apos;|&#39;/g,"'")
    .replace(/&nbsp;/g,' ')
    .replace(/&rarr;/g,'→')
    .replace(/&larr;/g,'←')
    .replace(/<[^>]+>/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

const entities=[];
const pattern=/<details class="faq-item">([\s\S]*?)<\/details>/gi;
for(const match of html.matchAll(pattern)){
  const block=match[1];
  const question=block.match(/<summary[^>]*\bdata-en="([^"]*)"[^>]*>/i)?.[1];
  const answer=block.match(/<p[^>]*\bdata-en="([^"]*)"[^>]*>/i)?.[1];
  if(!question||!answer)continue;
  entities.push({
    '@type':'Question',
    name:decode(question),
    acceptedAnswer:{'@type':'Answer',text:decode(answer)}
  });
}

const schema={
  '@context':'https://schema.org',
  '@type':'FAQPage',
  '@id':'https://wolfblanc.com/faq/#faq',
  url:'https://wolfblanc.com/faq/',
  inLanguage:'en',
  isPartOf:{'@type':'WebSite',name:'Wolfblanc Architects',url:'https://wolfblanc.com/'},
  publisher:{'@type':'Organization',name:'Wolfblanc Architects',url:'https://wolfblanc.com/',logo:{'@type':'ImageObject',url:'https://wolfblanc.com/images/210-sq-white-02.webp'}},
  mainEntity:entities
};

let replaced=false;
html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,(whole,body)=>{
  if(!body.includes('FAQPage'))return whole;
  replaced=true;
  return `<script type="application/ld+json">\n${JSON.stringify(schema,null,2)}\n  </script>`;
});
if(!replaced)throw new Error('FAQPage schema block not found');
fs.writeFileSync(file,html);
console.log(`Updated FAQ schema with ${entities.length} English questions.`);
