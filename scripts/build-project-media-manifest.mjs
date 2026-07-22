import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const sourceFile=process.argv[2];
if(!sourceFile)throw new Error('Usage: node scripts/build-project-media-manifest.mjs <wordpress-portfolio.json>');

const caseStudies=[
  'market-regeneration','senior-coliving','selva-boutique-luxury-design',
  'norrsken-office-workplace-design','granolita-coffee-boutique-cafe-interior-project',
  'a75','k12','k38','bistro-dterra-cafe-restaurant-interior-design','axis',
  'el-pilar','edificio-salamanca','lavapies-intervention','museum','plato',
  'urban-landscape-athens','calderon-stadium-urban-living',
  'casa-boadilla-madrid-luxury-family-residence','horizon','boutique-apartment-v1'
];

const posts=JSON.parse(fs.readFileSync(path.resolve(sourceFile),'utf8'));
const bySlug=new Map(posts.map(post=>[post.slug,post]));
const unavailableSources=new Set([
  'https://wolfblanc.com/wp-content/uploads/2024/12/WolfblancArchitects_P09_12-scaled.jpeg',
  'https://wolfblanc.com/wp-content/uploads/2024/12/WolfblancArchitects_P09_07-scaled.png'
]);

function decode(value=''){
  return value.replace(/&#038;|&amp;/g,'&').replace(/&#8217;/g,'’').replace(/<[^>]+>/g,'').trim();
}

function attribute(tag,name){
  const match=tag.match(new RegExp(`\\s${name}=(['"])([\\s\\S]*?)\\1`,'i'));
  return match?match[2].replace(/&amp;/g,'&'):'';
}

function selectSource(tag){
  const fallback=attribute(tag,'src');
  const candidates=attribute(tag,'srcset').split(',').map(entry=>{
    const match=entry.trim().match(/^(\S+)\s+(\d+)w$/);
    return match?{url:match[1],width:Number(match[2])}:null;
  }).filter(Boolean);
  const preferred=candidates.filter(item=>item.width<=1920).sort((a,b)=>b.width-a.width)[0];
  return preferred?.url||fallback;
}

const projects={};
for(const slug of caseStudies){
  const post=bySlug.get(slug);
  if(!post)throw new Error(`Live portfolio entry not found: ${slug}`);
  const tags=[...post.content.rendered.matchAll(/<img\b[^>]*>/gi)].map(match=>match[0]);
  const seen=new Set();
  const images=[];
  let sequence=0;
  for(const tag of tags){
    const identity=attribute(tag,'src');
    if(!identity||!/^https:\/\/wolfblanc\.com\/wp-content\/uploads\//i.test(identity)||seen.has(identity))continue;
    seen.add(identity);
    sequence++;
    if(unavailableSources.has(identity))continue;
    const source=selectSource(tag);
    const extension=(new URL(source).pathname.match(/\.(webp|jpe?g|png)$/i)?.[1]||'webp').toLowerCase().replace('jpeg','jpg');
    images.push({
      source,
      local:`images/projects/${slug}/${String(sequence).padStart(2,'0')}.${extension}`
    });
  }
  if(images.length<2)throw new Error(`Expected a gallery for ${slug}, found ${images.length} image(s)`);
  projects[slug]={title:decode(post.title.rendered),liveUrl:`https://wolfblanc.com/en/portfolio/${slug}/`,images};
}

const manifest={
  source:'Live wolfblanc.com WordPress portfolio',
  generatedAt:new Date().toISOString(),
  projects
};
fs.writeFileSync(path.join(root,'scripts','project-media-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Mapped ${caseStudies.length} case studies and ${Object.values(projects).reduce((sum,item)=>sum+item.images.length,0)} ordered images.`);
