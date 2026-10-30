const $=id=>document.getElementById(id);
const LINK='https://next.vestmarkets.com/r/4nallthingscrypto';
// Whole dollars stay whole ($90); anything with cents shows them ($85.50).
const money=n=>{const r=Math.round(n*100)/100;return '$'+r.toLocaleString('en-US',{minimumFractionDigits:r%1?2:0,maximumFractionDigits:2})};
// Prices from Vest's live builder and Get Funded page (checked Oct 29, 2026).
const TWO={5000:15,10000:35,25000:90,50000:175};
const INST={5000:200,10000:400,25000:1000,50000:2000};
const DEF={5000:40,10000:80,25000:210,50000:415};
const RANGE={5000:[20,220],10000:[45,440],25000:[120,1100],50000:[230,2170]};
const ONE={'target':{5:580,15:330,20:250},'dd':{7:510,8:630},'daily':{3:210,4:280,5:370},'split':{70:350,90:450,95:500}};
let mode='custom';
function customPrice(s,t,d,dl,sp){
  if(t==10&&d==6&&dl==3&&sp==80)return DEF[s];
  if(s!=25000)return null;
  const base={target:10,dd:6,daily:0,split:80},cur={target:t,dd:d,daily:dl,split:sp};
  const diff=Object.keys(base).filter(k=>base[k]!=cur[k]);
  if(diff.length==0)return 375;
  if(diff.length==1){const k=diff[0];return ONE[k][cur[k]]??null}
  return null;
}
const row=(a,b)=>'<div class="row"><span>'+a+'</span><b>'+b+'</b></div>';
function render(){
  const s=+$('size').value;let h='',price,label;
  document.querySelectorAll('.cust').forEach(e=>e.style.display=mode=='custom'?'':'none');
  if(mode=='custom'){
    const t=+$('target').value,d=+$('dd').value,dl=+$('daily').value,sp=+$('split').value;
    price=customPrice(s,t,d,dl,sp);label='1-Step';
    h+=row('Plan',label+' '+money(s));
    h+=row('Floor (account closes here)',money(s*(1-d/100)));
    h+=row('Daily loss limit',dl?money(s*dl/100)+' a day':'None');
    h+=row('Profit target',money(s*t/100)+' ('+t+'%)');
    h+=row('Your share at target',money(s*t/100*sp/100)+' ('+sp+'%)');
  }else if(mode=='instant'){
    price=INST[s];label='Instant';
    h+=row('Plan',label+' '+money(s));
    h+=row('Floor (account closes here)',money(s*0.96)+' (4%)');
    h+=row('Daily loss limit','None');
    h+=row('Profit target','None, funded right away');
    h+=row('Profit split','95%');
  }else{
    price=TWO[s];label='2-Step';
    h+=row('Plan',label+' '+money(s));
    h+=row('Phase 1 target',money(s*0.10)+' (10%)');
    h+=row('Phase 2 target',money(s*0.05)+' (5%)');
    h+=row('Floor (account closes here)',money(s*0.94)+' (6%)');
    h+=row('Daily loss limit',money(s*0.03)+' a day (3%)');
    h+=row('Profit split','80%');
  }
  if(price!=null)h+='<p class="small">Price <s>'+money(price)+'</s></p><div class="calcprice">'+money(price*0.95)+' with ATC</div>';
  else{const r=RANGE[s];h+='<p class="small">This exact mix: '+money(r[0])+' to '+money(r[1])+' before ATC</p><div class="calcprice">See the live price on Vest</div>'}
  h+='<a class="btn" href="'+LINK+'" target="_blank" rel="noopener">Get this plan with code ATC</a>';
  $('out').innerHTML=h;
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.mode;render()});
['size','target','dd','daily','split'].forEach(id=>$(id).onchange=render);
render();
