// Dry-run by default. Real publish only when LIVE=1 AND post.status==="approved".
import fs from 'fs';
const q=JSON.parse(fs.readFileSync('queue.json','utf8'));const live=process.env.LIVE==='1';const now=new Date();
for(const p of q.posts){
  if(p.status!=='approved'||p.published||new Date(p.at)>now)continue;
  if(!live){console.log(`[DRY-RUN] would publish ${p.id} to ${p.network}`);continue}
  console.log(`[LIVE] ${p.id}: adapter for ${p.network} not connected yet`); // adapters added per network after owner authorizes
}
