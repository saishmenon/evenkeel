// Template kit: pasted at the top of the template/flow scripts (use_figma has no imports).
await Promise.all([...['Regular','Medium','Semi Bold','Bold'].map(style=>figma.loadFontAsync({family:'Inter',style})), ...['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'Bricolage Grotesque',style}))]);
const colls=Object.fromEntries((await figma.variables.getLocalVariableCollectionsAsync()).map(c=>[c.name,c]));
const V=Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(v=>[v.name,v]));
const TS=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.name,s]));
const ES=Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s=>[s.name,s]));
const IC={plus:'12:184',x:'12:194',check:'12:199','chevron-down':'12:204','chevron-right':'12:209','arrow-right':'12:219','external-link':'12:224',search:'12:229',filter:'12:234',more:'12:239',info:'12:244','check-circle':'12:249','alert-triangle':'12:254','x-circle':'12:259',mail:'12:264',user:'12:269',lock:'12:274',eye:'12:284',copy:'12:289',trash:'12:294',pencil:'12:299',download:'12:304',star:'12:309',settings:'12:314',globe:'12:319','chevron-left':'37:179',home:'37:215',chart:'37:221',server:'37:227',database:'37:233',bell:'37:239',help:'37:245',layers:'37:251',folder:'37:257',leaf:'37:263',activity:'37:269',refresh:'37:293',users:'60:179','credit-card':'60:185',key:'60:191',clock:'60:197','file-text':'60:203',shield:'60:209','eye-off':'60:215',rocket:'60:221'};
const paint=r=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V[r]);
const RADII=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const bind=(n,ps,v)=>ps.forEach(p=>n.setBoundVariable(p,V[v]));
const padX=(n,v)=>bind(n,['paddingLeft','paddingRight'],v);const padY=(n,v)=>bind(n,['paddingTop','paddingBottom'],v);
const mode=(n,c,m)=>n.setExplicitVariableModeForCollection(colls[c],colls[c].modes.find(x=>x.name===m).modeId);
async function text(str,style,role='label/primary',width){const t=figma.createText();await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.fills=[paint(role)];if(width){t.textAutoResize='HEIGHT';t.resize(width,t.height);}return t;}
const AL=(dir,name,p={})=>{const f=figma.createAutoLayout(dir,{name,...p});f.fills=[];return f;};
const fillW=(par,ch)=>{par.appendChild(ch);ch.layoutSizingHorizontal='FILL';return ch;};
const grow=(par,ch)=>{par.appendChild(ch);ch.layoutGrow=1;return ch;};
async function iconInst(name,size,role,nodeName='icon'){const c=await figma.getNodeByIdAsync(IC[name]);const i=c.createInstance();i.name=nodeName;i.resize(size,size);i.findAllWithCriteria({types:['VECTOR']}).forEach(v=>{v.strokes=[paint(role)];});return i;}
const props=c=>Object.fromEntries(c.name.split(', ').map(x=>x.split('=')));
function keyOf(set,name){const d=set.componentPropertyDefinitions;return Object.keys(d).find(k=>k.split('#')[0]===name);}
function inst(set,match={},pv={}){const v=set.type==='COMPONENT'?set:set.children.find(c=>Object.entries(match).every(([k,x])=>props(c)[k]===x));if(!v)throw new Error('no variant '+set.name+JSON.stringify(match));const i=v.createInstance();const m={};for(const[k,x]of Object.entries(pv)){const kk=keyOf(set.type==='COMPONENT'?set:set,k);if(kk)m[kk]=x;}if(Object.keys(m).length)i.setProperties(m);return i;}
const SID={top:'40:982',item:'40:247',bc:'39:198',ph:'40:735',button:'14:1314',ib:'15:366',badge:'25:222',tf:'17:226',ta:'18:215',select:'20:225',cb:'21:272',radio:'22:220',toggle:'23:212',seg:'24:210',segment:'24:188',pb:'26:215',tab:'39:485',hc:'42:204',cell:'42:264',kv:'39:299',sheet:'44:433',ins:'44:626',insSec:'44:611',alert:'47:292',pg:'47:488',empty:'47:681',metric:'48:224',avatar:'47:847',card:'48:453',art:'48:366',chart:'48:651',donut:'63:260',barlist:'63:650',barrow:'63:9089',spark:'63:559',heat:'63:799',cellH:'63:798',gauge:'63:412',menu:'52:473',toast:'52:779',steps:'54:449',step:'54:378',combo:'54:675',tag:'54:1039',taggroup:'54:1040',exp:'54:238',search:'19:203',link:'16:200',logo:'40:912',tooltip:'52:199',popover:'52:290',skeleton:'52:916'};
const S={};for(const[k,id]of Object.entries(SID))S[k]=await figma.getNodeByIdAsync(id);
const btn=(v,l,size='md',ic,right)=>inst(S.button,{Variant:v,Size:size,State:'default'},{Label:l,'Show icon left':!!ic&&!right,'Show icon right':!!ic&&!!right,...(ic?{[right?'Icon right':'Icon left']:IC[ic]}:{})});
const ibtn=(ic,v='plain',size='sm')=>inst(S.ib,{Variant:v,Size:size,State:'default'},{Icon:IC[ic]});
const badge=(tone,l,ic)=>inst(S.badge,{Tone:tone,Style:'subtle'},{Label:l,'Show icon':!!ic,...(ic?{Icon:IC[ic]}:{})});
async function boxF(title,desc,actions){const b=AL('VERTICAL',title||'Box');b.fills=[paint('background/primary')];b.strokes=[paint('separator/default')];b.strokeWeight=1;b.strokeAlign='INSIDE';bind(b,RADII,'radius/container');b.setBoundVariable('itemSpacing',V['space/4']);bind(b,['paddingLeft','paddingRight','paddingTop','paddingBottom'],'container/padding');b.clipsContent=true;
  if(title){const hr=AL('HORIZONTAL','header',{counterAxisAlignItems:'MIN'});const h=AL('VERTICAL','titles',{itemSpacing:2});fillW(h,await text(title,'title-3'));if(desc)fillW(h,await text(desc,'subheadline','label/secondary'));grow(hr,h);if(actions)for(const a of actions)hr.appendChild(a);fillW(b,hr);}return b;}
async function header(title,desc,actions=[],level='1',counter){const r=AL('HORIZONTAL','header row',{counterAxisAlignItems:'MAX'});r.setBoundVariable('itemSpacing',V['space/6']);
  const ph=inst(S.ph,{Level:level},{Title:title,'Show counter':!!counter,...(counter?{Counter:' '+counter}:{}),'Show badge':false,'Show description':!!desc,...(desc?{Description:desc}:{}),'Show actions':false});ph.name='Page header';grow(r,ph);ph.layoutSizingHorizontal='FILL';
  const ac=AL('HORIZONTAL','actions',{counterAxisAlignItems:'CENTER'});ac.setBoundVariable('itemSpacing',V['control/gap']);for(const a of actions)ac.appendChild(a);r.appendChild(ac);return r;}
const row=(name,gap='space/4',align='MIN')=>{const r=AL('HORIZONTAL',name,{counterAxisAlignItems:align});r.setBoundVariable('itemSpacing',V[gap]);return r;};
const col=(name,gap='space/4')=>{const c=AL('VERTICAL',name);c.setBoundVariable('itemSpacing',V[gap]);return c;};
const kL=keyOf(S.kv,'Label'),kV=keyOf(S.kv,'Value');
function kvs(pairs,layout='stacked',w=200){const f=AL(layout==='stacked'?'HORIZONTAL':'VERTICAL','key-values');if(layout==='stacked'){f.layoutWrap='WRAP';f.setBoundVariable('itemSpacing',V['space/6']);f.setBoundVariable('counterAxisSpacing',V['space/4']);}
  for(const[a,b]of pairs){const i=S.kv.children.find(c=>c.name==='Layout='+layout).createInstance();i.setProperties({[kL]:a,[kV]:b});if(layout==='stacked')i.resize(w,i.height);f.appendChild(i);if(layout!=='stacked')i.layoutSizingHorizontal='FILL';}return f;}
// table: cols [{label,w(0=grow),kind:'text|link|badge|number|select',align}], rows: arrays of values (badge: [tone,label])
function table(cols,rows,{states=[],sort}={}){const T=AL('VERTICAL','Table');const hr=AL('HORIZONTAL','Header');T.appendChild(hr);hr.layoutSizingHorizontal='FILL';
  const place=(r,i,w)=>{r.appendChild(i);if(w)i.resize(w,i.height);else i.layoutGrow=1;};
  for(const c of cols){const i=c.kind==='select'?inst(S.hc,{Kind:'select'}):inst(S.hc,{Kind:'label',Sort:c.label===sort?'ascending':c.sortable===false?'unsortable':'none',Align:c.kind==='number'?'end':'start'},{Label:c.label});place(hr,i,c.w);}
  rows.forEach((vals,ri)=>{const st=states[ri]||'default';const r=AL('HORIZONTAL','Row '+(ri+1));T.appendChild(r);r.layoutSizingHorizontal='FILL';
    cols.forEach((c,ci)=>{const v=vals[ci];let i;
      if(c.kind==='select')i=inst(S.cell,{Kind:'select',State:st});
      else if(c.kind==='badge'){i=inst(S.cell,{Kind:'badge',State:st});const b=i.findOne(n=>n.name==='badge');b.swapComponent(S.badge.children.find(x=>x.name===`Tone=${v[0]}, Style=subtle`));b.setProperties({[keyOf(S.badge,'Label')]:v[1],[keyOf(S.badge,'Show icon')]:!!v[2],...(v[2]?{[keyOf(S.badge,'Icon')]:IC[v[2]]}:{})});}
      else i=inst(S.cell,{Kind:c.kind||'text',State:st},{Text:String(v)});
      place(r,i,c.w);});});
  return T;}
function tableBox(T,top){const b=AL('VERTICAL','Table container');b.fills=[paint('background/primary')];b.strokes=[paint('separator/default')];b.strokeWeight=1;b.strokeAlign='INSIDE';bind(b,RADII,'radius/container');b.clipsContent=true;if(top){const t=AL('VERTICAL','top');t.setBoundVariable('itemSpacing',V['space/3']);bind(t,['paddingLeft','paddingRight','paddingTop'],'container/padding');t.setBoundVariable('paddingBottom',V['space/3']);for(const x of top)fillW(t,x);fillW(b,t);}fillW(b,T);return b;}
async function makeSidebar(current){const it=S.item;const kLab=keyOf(it,'Label'),kIcon=keyOf(it,'Icon'),kSC=keyOf(it,'Show count'),kC=keyOf(it,'Count'),kExt=keyOf(it,'External');
  const sb=AL('VERTICAL','Sidebar');sb.resize(260,900);sb.primaryAxisSizingMode='FIXED';sb.counterAxisSizingMode='FIXED';sb.fills=[paint('background/secondary')];sb.strokes=[paint('separator/default')];sb.strokeAlign='INSIDE';sb.strokeTopWeight=sb.strokeBottomWeight=sb.strokeLeftWeight=0;sb.strokeRightWeight=1;sb.paddingLeft=sb.paddingRight=8;sb.paddingTop=8;sb.itemSpacing=1;
  const add=(label,icon,count)=>{const i=inst(it,{Kind:'link',State:label===current?'current':'default'});const p={[kLab]:label,[kIcon]:IC[icon],[kSC]:count!=null,[kExt]:false};if(count!=null)p[kC]=String(count);i.setProperties(p);i.name=label;fillW(sb,i);};
  const title=async t=>{const f=AL('HORIZONTAL','Section · '+t);f.paddingLeft=f.paddingRight=10;f.paddingTop=16;f.paddingBottom=4;f.appendChild(await text(t,'footnote-emphasized','label/secondary'));fillW(sb,f);};
  add('Dashboard','home');await title('Payments');add('Transactions','activity',8);add('Payouts','download',3);await title('Insights');add('Revenue report','chart');add('Logs','file-text');add('Compare','layers');await title('Account');add('Team','users');add('Billing','credit-card');add('Activity','clock');add('Settings','settings');
  return sb;}
async function shell(name,current,crumbs,{width=1440,inspector}={}){const c=figma.createComponent();c.name=name;c.layoutMode='VERTICAL';c.counterAxisSizingMode='FIXED';c.resize(width,900);c.primaryAxisSizingMode='AUTO';c.fills=[paint('background/primary')];c.clipsContent=true;
  const tb=inst(S.top,{Breakpoint:'desktop'},{'Show inspector toggle':!!inspector});tb.name='Top bar';fillW(c,tb);
  const body=AL('HORIZONTAL','Body');fillW(c,body);body.minHeight=848;
  const sb=await makeSidebar(current);body.appendChild(sb);sb.layoutSizingVertical='FILL';
  const ct=AL('VERTICAL','Content');ct.setBoundVariable('itemSpacing',V['section/gap']);padX(ct,'space/8');ct.setBoundVariable('paddingTop',V['space/6']);ct.setBoundVariable('paddingBottom',V['space/16']);grow(body,ct);ct.layoutSizingHorizontal='FILL';
  if(crumbs){const n=crumbs.length+1;const b=inst(S.bc,{Items:String(Math.min(4,n))},{'Crumb 1':'Mintline',...(n>2?{'Crumb 2':crumbs[0]}:{}),...(n>3?{'Crumb 3':crumbs[1]}:{}),Current:crumbs[crumbs.length-1]});b.name='Breadcrumbs';ct.appendChild(b);}
  if(inspector){body.appendChild(inspector);inspector.layoutSizingVertical='FILL';}
  return {c,ct,body};}
async function tabs(labels,active,counts={}){const r=AL('HORIZONTAL','Tabs');r.setBoundVariable('itemSpacing',V['space/6']);r.strokes=[paint('separator/default')];r.strokeAlign='INSIDE';r.strokeTopWeight=r.strokeLeftWeight=r.strokeRightWeight=0;r.strokeBottomWeight=1;
  for(const l of labels){const i=inst(S.tab,{Selected:l===active?'true':'false',State:'default'},{Label:l,'Show count':counts[l]!=null,...(counts[l]!=null?{Count:String(counts[l])}:{})});r.appendChild(i);}return r;}
async function placeOnPage(comps,label,x0=0,y0=0,gap=160){let x=x0;for(const c of comps){c.x=x;c.y=y0;const t=await text(c.name,'title-2');t.x=x;t.y=y0-56;x+=c.width+gap;}}
// ===== end kit =====
