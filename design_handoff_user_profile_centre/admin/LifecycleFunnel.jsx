// §6.2.1 Lifecycle Funnel + Distribution combined.
// Left: funnel bars + micro-funnel + zombie callout
// Right: distribution donut

const FUNNEL = [
  { stage:'Registered', count:12400 },
  { stage:'Onboarded',  count: 8200 },
  { stage:'Activated',  count: 5100 },
  { stage:'Engaged',    count: 3800 },
  { stage:'Churned',    count: 1900 },
];

// §6.2.4 Funnel Analysis — Registration → First login → Onboarding complete
// → Exam pass → First task → Repeat task
const MICRO_FUNNEL = [
  { step:'Registration',    count:12400 },
  { step:'First login',     count:10100 },
  { step:'Onboarding done', count: 8200 },
  { step:'Exam pass',       count: 6400 },
  { step:'First task',      count: 5100 },
  { step:'Repeat task',     count: 3800 },
];

function FunnelBars() {
  const max = FUNNEL[0].count;
  const BAR_H = 80;
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${FUNNEL.length}, 1fr)`,gap:8,alignItems:'end'}}>
      {FUNNEL.map((s,i)=>{
        const h = Math.max((s.count/max)*BAR_H, 6);
        const prev = i>0 ? FUNNEL[i-1].count : null;
        const rate = prev ? Math.round(s.count/prev*100) : 100;
        const isChurn = s.stage==='Churned';
        const isWeak = rate < 85;
        return (
          <div key={s.stage} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,minWidth:0}}>
            <div style={{fontFamily:'Jost',fontSize:11,fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
              {(s.count/1000).toFixed(1)}k
            </div>
            <div style={{width:'100%',height:BAR_H,display:'flex',alignItems:'flex-end'}}>
              <div style={{
                width:'100%',height:h,
                background: isChurn
                  ? 'linear-gradient(180deg,#F44336,#F9A8A8)'
                  : 'linear-gradient(180deg,#4285F4,#9DC6FF)',
                borderRadius:'3px 3px 0 0',
              }}/>
            </div>
            <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#2C2C2C',textAlign:'center',lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'100%'}}>
              {s.stage}
            </div>
            <div style={{fontFamily:'DM Sans',fontSize:9.5,fontWeight:600,lineHeight:1,
              color: i===0?'transparent': isChurn?'#F44336': isWeak?'#F59E0B':'#22C55E'}}>
              {i===0 ? '—' : `${rate}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MicroFunnel() {
  const max = MICRO_FUNNEL[0].count;
  const BAR_H = 54;
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${MICRO_FUNNEL.length}, 1fr)`,gap:6,alignItems:'end'}}>
      {MICRO_FUNNEL.map((m,i)=>{
        const pct = m.count/max;
        const h = Math.max(pct*BAR_H, 6);
        const prev = i>0 ? MICRO_FUNNEL[i-1].count : null;
        const rate = prev ? Math.round(m.count/prev*100) : 100;
        const isWeak = rate < 85;
        return (
          <div key={m.step} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:0}}>
            <div style={{fontFamily:'Jost',fontSize:10,fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
              {(m.count/1000).toFixed(1)}k
            </div>
            <div style={{width:'100%',height:BAR_H,display:'flex',alignItems:'flex-end'}}>
              <div style={{
                width:'100%', height:h,
                background:`linear-gradient(180deg, #4285F4, #9DC6FF)`,
                borderRadius:'3px 3px 0 0'
              }}/>
            </div>
            <div style={{fontFamily:'DM Sans',fontSize:9.5,color:'#6F7482',textAlign:'center',lineHeight:1.15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'100%'}}>
              {m.step}
            </div>
            <div style={{
              fontFamily:'DM Sans',fontSize:9.5,fontWeight:600,lineHeight:1,
              color: i===0 ? 'transparent' : (isWeak ? '#F44336' : '#22C55E')
            }}>
              {i===0 ? '—' : `${rate}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Distribution donut (merged from Panels.jsx, kept in blue family)
const DIST = [
  { stage:'Active Engaged',  count:3800, color:'#4285F4' },
  { stage:'Activated-idle',  count:1300, color:'#7CA9FC' },
  { stage:'Onboarded-pend.', count:3100, color:'#9DC6FF' },
  { stage:'Registered-new',  count:2300, color:'#CFE0FE' },
  { stage:'Churned 90d+',    count:1900, color:'#F44336' },
];
function LifecycleDonut() {
  const total = DIST.reduce((s,d)=>s+d.count,0);
  const size = 150, R=60, cx=size/2, cy=size/2;
  let acc = 0;
  const arc = (start, end) => {
    const a0 = -Math.PI/2 + 2*Math.PI*start;
    const a1 = -Math.PI/2 + 2*Math.PI*end;
    const large = (end-start) > 0.5 ? 1 : 0;
    const outer = [cx + R*Math.cos(a0), cy + R*Math.sin(a0), cx + R*Math.cos(a1), cy + R*Math.sin(a1)];
    const r2 = R-14;
    const inner = [cx + r2*Math.cos(a1), cy + r2*Math.sin(a1), cx + r2*Math.cos(a0), cy + r2*Math.sin(a0)];
    return `M${outer[0]},${outer[1]} A${R},${R} 0 ${large} 1 ${outer[2]},${outer[3]} L${inner[0]},${inner[1]} A${r2},${r2} 0 ${large} 0 ${inner[2]},${inner[3]} Z`;
  };
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
      <svg width={size} height={size}>
        {DIST.map((d,i)=>{
          const start = acc/total;
          acc += d.count;
          const end = acc/total;
          return <path key={i} d={arc(start,end)} fill={d.color}/>;
        })}
        <text x={cx} y={cy-2} textAnchor="middle" fontFamily="Jost" fontSize="22" fontWeight="500" fill="#111125">{(total/1000).toFixed(1)}k</text>
        <text x={cx} y={cy+14} textAnchor="middle" fontFamily="DM Sans" fontSize="11" fill="#6F7482">in pool</text>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:5,width:'100%'}}>
        {DIST.map(d=>{
          const pct = (d.count/total*100).toFixed(0);
          return (
            <div key={d.stage} style={{display:'grid',gridTemplateColumns:'8px 1fr auto auto',alignItems:'center',gap:8}}>
              <span style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
              <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.stage}</span>
              <span style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',fontVariantNumeric:'tabular-nums'}}>{d.count.toLocaleString()}</span>
              <span style={{fontFamily:'Jost',fontSize:11.5,fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums',width:30,textAlign:'right'}}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LifecycleModule({ onNavigate }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:24,alignItems:'start'}}>
      {/* Left: lifecycle stages column chart */}
      <div>
        <div style={{fontFamily:'DM Sans',fontSize:12,fontWeight:600,color:'#111125',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span>Lifecycle stages</span>
          <span style={{color:'#6F7482',fontWeight:500,fontSize:11}}>Registered → Churned</span>
        </div>
        <FunnelBars/>
      </div>

      {/* Right: stage distribution donut */}
      <div style={{borderLeft:'1px solid #F2F3F8',paddingLeft:24}}>
        <div style={{fontFamily:'DM Sans',fontSize:12,fontWeight:600,color:'#111125',marginBottom:12}}>Stage distribution</div>
        <LifecycleDonut/>
      </div>
    </div>
  );
}

window.LifecycleModule = LifecycleModule;
window.LifecycleDonut = LifecycleDonut;
window.FunnelBars = FunnelBars;
window.MicroFunnel = MicroFunnel;
