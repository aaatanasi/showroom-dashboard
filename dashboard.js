'use strict';
const by=id=>document.getElementById(id);
const seasons=['FW27','SS27'], brands=['Arden Studio','Forma House','Northline','Sable Editions'], events=['New York','Paris','Milan','Virtual'];
const stores=['Alder & Finch','Bridge Street Edit','Cedar Lane','Dune & Oak','Elm House','Field Note','Harbor Thread','Juniper Row'];
const status=['Confirmed','Pending','Completed','Cancelled'];
const fixtures=seasons.flatMap((season,si)=>Array.from({length:28-si*4},(_,i)=>({
  season,store:stores[(i*3+si)%8],brand:brands[(i+Math.floor(i/5)+si)%4],event:events[(i+Math.floor(i/5)+si)%4],
  date:`${si?'Sep':'Jan'} ${6+Math.floor(i/2)}`,status:status[i%11===0?3:i%5===0?1:i%3===0?2:0],
  sale:i%5===0||i%11===0?0:4500+(i*4171)%15300, ats:i%4===0?1600+(i*137)%1600:0
})));
let active='appointments',mode='';
const options={sales:['By Brand','By Client','Client × Brand','ATS by Brand','ATS by Client','ATS Client × Brand'],reports:['Showroom','By Brand','Retailer Changes','Sales by Location','Conversion','Brands by Retailer']};
for(const [id,values,def] of [['season',seasons,'FW27'],['brand',brands,'All brands'],['event',events,'All events']]){
 by(id).replaceChildren(...(id==='season'?values:[def,...values]).map(v=>new Option(v,v)));
}
const dollars=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const tally=(arr,key)=>arr.reduce((n,r)=>n+(r[key]||0),0);
const filters=(r,season=by('season').value)=>r.season===season&&(!by('store').value.trim()||r.store.toLowerCase().includes(by('store').value.toLowerCase().trim()))&&(by('brand').value==='All brands'||r.brand===by('brand').value)&&(by('event').value==='All events'||r.event===by('event').value);
const card=(label,value,help)=>`<article class="card"><span>${label}</span><b>${value}</b><small>${help}</small></article>`;
let exportData=null;
function panel(title,columns,rows,exportable=true){
 if(exportable) exportData=[columns,...rows.map(row=>row.map(v=>String(v).replace(/<[^>]*>/g,'')))];
 return `<article class="panel"><div class="panelhead"><h2>${title}</h2>${exportable?'<div><button id="excel">Excel (CSV)</button> <button id="pdf">Print / PDF</button></div>':''}</div><div class="rows" tabindex="0"><table><thead><tr>${columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">No records match these filters.</td></tr>`}</tbody></table></div></article>`;
}
function render(){
 const data=fixtures.filter(r=>filters(r)), unique=k=>new Set(data.map(r=>r[k])).size;
 const brandCols=by('brand').value==='All brands'?brands:[by('brand').value];
 const tabs=options[active]||[];
 let html=tabs.length?`<div class="mode" aria-label="View breakdown">${tabs.map(t=>`<button aria-pressed="${t===mode}" data-mode="${t}">${t}</button>`).join('')}</div>`:'';
 let columns,rows,title;
 if(active==='appointments'){
 html+=`<div class="cards">${card('Appointments',data.length,'Matching current filters')}${card('Confirmed',data.filter(r=>r.status==='Confirmed').length,'Upcoming on the calendar')}${card('Pending',data.filter(r=>r.status==='Pending').length,'Awaiting confirmation')}${card('Retailers',unique('store'),'Distinct stores represented')}</div>`;
 columns=['Store',...brandCols,'Total'];
 rows=stores.filter(s=>data.some(r=>r.store===s)).map(s=>{const group=data.filter(r=>r.store===s);return [s,...brandCols.map(b=>group.filter(r=>r.brand===b).length||'—'),group.length];});
 html+=panel('Appointment brand matrix',columns,rows);
 html+=panel('Appointment detail',['Date','Store','Brand','Market','Status'],data.map(r=>[r.date,r.store,r.brand,r.event,`<span class="badge ${r.status.toLowerCase()}">${r.status}</span>`]),false);
 }else if(active==='sales'){
 const key=mode.startsWith('ATS')?'ats':'sale';
 html+=`<div class="cards">${card('Booked sales',dollars(tally(data,'sale')),'Synthetic booked value')}${card('ATS',dollars(tally(data,'ats')),'Available-to-sell fixture')}${card('Brands',unique('brand'),'Matching filters')}${card('Retailers',unique('store'),'Matching filters')}</div>`;
 title=mode; columns=['Group',key==='ats'?'ATS value':'Sales'];
 if(mode.includes('×')){columns=['Store',...brandCols];rows=stores.filter(s=>data.some(r=>r.store===s)).map(s=>[s,...brandCols.map(b=>dollars(tally(data.filter(r=>r.store===s&&r.brand===b),key)))]);}
 else{let field=mode.includes('Client')?'store':'brand';rows=[...new Set(data.map(r=>r[field]))].map(g=>[g,dollars(tally(data.filter(r=>r[field]===g),key))]);}
 html+=panel(title,columns,rows);
 }else{
 const other=seasons.find(s=>s!==by('season').value), previous=fixtures.filter(r=>filters(r,other));
 if(mode==='Retailer Changes'){columns=['Retailer',by('season').value,other,'Change'];rows=stores.filter(s=>[...data,...previous].some(r=>r.store===s)).map(s=>{let curr=data.filter(r=>r.store===s).length,prev=previous.filter(r=>r.store===s).length;return [s,curr,prev,(curr-prev>0?'+':'')+(curr-prev)];});}
 else if(mode==='Brands by Retailer'){columns=['Retailer','Brands'];rows=stores.filter(s=>data.some(r=>r.store===s)).map(s=>[s,[...new Set(data.filter(r=>r.store===s).map(r=>r.brand))].join(', ')]);}
 else{
 const group=mode==='By Brand'?'brand':'event';
 columns=['Group','Appointments',mode==='Conversion'?'Conversion':'Sales'];
 rows=[...new Set(data.map(r=>r[group]))].map(g=>{const grp=data.filter(r=>r[group]===g);return [g,grp.length,mode==='Conversion'?`${Math.round(100*grp.filter(r=>r.sale).length/grp.length)}%`:dollars(tally(grp,'sale'))];});
 }
 html+=panel(mode+' report',columns,rows);
 }
 by('view').innerHTML=html;
 by('view').querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render();by('view').querySelector('[aria-pressed=true]')?.focus();});
 const csv=by('excel');if(csv) csv.onclick=()=>{const blob=new Blob([exportData.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='showroom-sample.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);};
 if(by('pdf'))by('pdf').onclick=()=>window.print();
}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{active=b.dataset.tab;mode=options[active]?.[0]||'';document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
for(const el of [by('brand'),by('event'),by('season'),by('store')]) el.addEventListener(el.type==='search'?'input':'change',render);
by('reset').onclick=()=>{by('season').selectedIndex=by('brand').selectedIndex=by('event').selectedIndex=0;by('store').value='';render();};
render();
