// §6.2.1 Lifecycle Funnel
// 6-stage funnel bar chart (full width). Eligible added between Onboarded and Activated.

const FUNNEL = [
  { stage:'Registered', count:12400, desc:'Account created · onboarding not started' },
  { stage:'Onboarded',  count: 8200, desc:'Tutorial complete · no tasks finished' },
  { stage:'Eligible',   count: 6800, desc:'First exam passed' },
  { stage:'Activated',  count: 5100, desc:'First task completed' },
  { stage:'Engaged',    count: 3800, desc:'Active within past 7 days' },
  { stage:'Churned',    count: 1900, desc:'≥7 days no task activity' },
];

function FunnelBars() {
  const max = FUNNEL[0].count;
  const BAR_H = 88;
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
            <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:600,color:'#2C2C2C',textAlign:'center',lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'100%'}}>
              {s.stage}
            </div>
            <div style={{fontFamily:'DM Sans',fontSize:9,color:'#9AA2B1',textAlign:'center',lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',width:'100%',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
              {s.desc}
            </div>
            <div style={{fontFamily:'DM Sans',fontSize:9.5,fontWeight:600,lineHeight:1,marginTop:2,
              color: i===0?'transparent': isChurn?'#F44336': isWeak?'#F59E0B':'#22C55E'}}>
              {i===0 ? '—' : `${rate}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LifecycleModule({ onNavigate }) {
  return (
    <div>
      <div style={{fontFamily:'DM Sans',fontSize:12,fontWeight:600,color:'#111125',marginBottom:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span>Lifecycle stages</span>
        <span style={{color:'#6F7482',fontWeight:500,fontSize:11}}>Registered → Churned · conversion rate per stage</span>
      </div>
      <FunnelBars/>
    </div>
  );
}

window.LifecycleModule = LifecycleModule;
window.FunnelBars = FunnelBars;
