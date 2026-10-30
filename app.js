const $=id=>document.getElementById(id);
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
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
function render(){
  const s=+$('size').value;let t,d,dl,sp,price,label;
  document.querySelectorAll('.cust').forEach(e=>e.style.display=mode=='custom'?'':'none');
  if(mode=='custom'){t=+$('target').value;d=+$('dd').value;dl=+$('daily').value;sp=+$('split').value;price=customPrice(s,t,d,dl,sp);label='Customizer'}
  else if(mode=='instant'){t=null;d=4;dl=0;sp=95;price=INST[s];label='Instant'}
  else{t=null;d=null;dl=null;sp=null;price=TWO[s];label='2-Step'}
  let h='<div class="row"><span>Plan</span><b>'+label+' '+money(s)+'</b></div>';
  if(d!=null)h+='<div class="row"><span>Floor (account closes here)</span><b>'+money(s*(1-d/100))+'</b></div>';
  if(dl!=null)h+='<div class="row"><span>Daily loss limit</span><b>'+(dl?money(s*dl/100)+'/day':'None')+'</b></div>';
  if(t)h+='<div class="row"><span>Profit target</span><b>'+money(s*t/100)+'</b></div>';
  if(t&&sp)h+='<div class="row"><span>Your share at target</span><b>'+money(s*t/100*sp/100)+'</b></div>';
  if(mode=='instant')h+='<div class="row"><span>Profit split</span><b>95%</b></div>';
  if(mode=='two')h+='<div class="row"><span>Rules</span><b>Two evaluation phases, set by plan</b></div>';
  if(price!=null)h+='<p>Price <s>'+money(price)+'</s></p><div class="price">'+money(price*0.95)+' with ATC</div>';
  else{const r=RANGE[s];h+='<p>Price range '+money(r[0])+' to '+money(r[1])+'</p><div class="price">See the live price at checkout</div>'}
  h+='<p><a class="btn" href="https://next.vestmarkets.com/r/4nallthingscrypto" target="_blank" rel="noopener">Get this plan with code ATC</a></p>';
  $('out').innerHTML=h;
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.mode;render()});
['size','target','dd','daily','split'].forEach(id=>$(id).onchange=render);
render();
