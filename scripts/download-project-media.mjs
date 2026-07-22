import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts','project-media-manifest.json'),'utf8'));
const queue=Object.values(manifest.projects).flatMap(project=>project.images);
let downloaded=0;
let skipped=0;

async function download(item){
  const destination=path.join(root,item.local);
  if(fs.existsSync(destination)&&fs.statSync(destination).size>0){skipped++;return;}
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  let lastError;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(item.source,{headers:{'User-Agent':'Mozilla/5.0 (compatible; Wolfblanc static migration)'}});
      if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
      const bytes=Buffer.from(await response.arrayBuffer());
      if(bytes.length<1000)throw new Error(`Unexpectedly small response (${bytes.length} bytes)`);
      const temporary=destination+'.download';
      fs.writeFileSync(temporary,bytes);
      fs.renameSync(temporary,destination);
      downloaded++;
      return;
    }catch(error){
      lastError=error;
      if(attempt<3)await new Promise(resolve=>setTimeout(resolve,attempt*500));
    }
  }
  throw new Error(`Failed to download ${item.source}: ${lastError?.message}`);
}

const concurrency=4;
for(let index=0;index<queue.length;index+=concurrency){
  await Promise.all(queue.slice(index,index+concurrency).map(download));
  if((index+concurrency)%40===0||index+concurrency>=queue.length)console.log(`Checked ${Math.min(index+concurrency,queue.length)} / ${queue.length}`);
}
console.log(`Project media ready: ${downloaded} downloaded, ${skipped} already present.`);
