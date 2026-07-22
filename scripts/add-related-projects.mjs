import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const hub=fs.readFileSync(path.join(root,'portfolio','index.html'),'utf8');
const projects=[{
  slug:'horizon',category:'Residential',title:'Horizon House',image:'Horizon House 01.webp'
}];

for(const match of hub.matchAll(/<a href="\.\.\/portfolio\/([^/]+)\/" class="wb-card" data-cat="([^"]+)">([\s\S]*?)<\/a>/g)){
  const [,slug,rawCategory,card]=match;
  const image=card.match(/<img[^>]+src="\.\.\/images\/([^"]+)"/)?.[1];
  const title=card.match(/<h3 class="card-title"[^>]*data-en="([^"]+)"/)?.[1]||card.match(/<h3 class="card-title"[^>]*>([^<]+)</)?.[1];
  const category={Residencial:'Residential',Hosteleria:'Hospitality',Comercial:'Commercial',Urbano:'Urban & public'}[rawCategory]||rawCategory;
  if(image&&title&&!projects.some(project=>project.slug===slug))projects.push({slug,category,title,image});
}

if(projects.length!==20)throw new Error(`Expected 20 projects, found ${projects.length}`);

function relatedFor(project){
  const related=projects.filter(item=>item.slug!==project.slug&&item.category===project.category).slice(0,3);
  for(const item of projects){
    if(related.length===3)break;
    if(item.slug!==project.slug&&!related.some(candidate=>candidate.slug===item.slug))related.push(item);
  }
  return related;
}

function card(item){
  return `<a class="project-related-card" href="../${item.slug}/"><div class="project-related-img"><img src="../../images/${item.image}" alt="${item.title} — Wolfblanc Architects" loading="lazy" decoding="async"></div><div class="project-related-body"><p class="project-related-cat">${item.category}</p><p class="project-related-title">${item.title}</p></div></a>`;
}

for(const project of projects){
  const file=path.join(root,'portfolio',project.slug,'index.html');
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<body(?: class="([^"]*)")?>/,(_,classes='')=>`<body class="${[...new Set(classes.split(/\s+/).filter(Boolean).concat('project-page'))].join(' ')}">`);
  html=html.replace(/\s*<section class="project-related"[\s\S]*?<\/section>/,'');
  const section=`\n  <section class="project-related" aria-labelledby="related-projects-title">
    <div class="project-related-inner">
      <div class="project-related-head"><span class="project-related-ey" id="related-projects-title" data-es="MÁS PROYECTOS" data-en="MORE PROJECTS">MORE PROJECTS</span><a class="project-related-all" href="../" data-es="Todos los proyectos →" data-en="All projects →">All projects →</a></div>
      <div class="project-related-grid">${relatedFor(project).map(card).join('')}</div>
    </div>
  </section>\n`;
  if(!html.includes('<section class="cta-section">'))throw new Error(`CTA not found: ${project.slug}`);
  html=html.replace(/\s*<\/main>/,`${section}</main>`);
  fs.writeFileSync(file,html);
}

console.log(`Added related projects to ${projects.length} case studies.`);
