const fs = require('fs');
const text = fs.readFileSync('style.css', 'utf8');
const lines = text.split(/\r?\n/);
function findBlock(marker){
  let start = null;
  for(let i=0;i<lines.length;i++){
    if(lines[i].trim().startsWith(marker)) { start=i; break; }
  }
  if(start===null) return [null, null];
  let depth = 0;
  for(let j=start;j<lines.length;j++){
    for(const ch of lines[j]){
      if(ch === '{') depth++;
      else if(ch === '}') depth--;
    }
    if(depth===0 && j>start) return [start, j];
  }
  return [start, null];
}
const markers=['.skill-card {','.project-modal {','.stat-box {','.portfolio-item {','.hero-section {','.about-image {','.skill-progress-item {','.institute-box {'];
for(const marker of markers){
  const [s,e]=findBlock(marker);
  console.log(marker, s, e);
}
