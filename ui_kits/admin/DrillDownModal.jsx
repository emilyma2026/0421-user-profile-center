// Drill-down modal opened when a user clicks a Coverage axis or a Gap alert.
// Shows the dimension breakdown + recommended campaigns (§6.2.3).

function DrillDownModal({ open, onClose, context }) {
  if (!open) return null;

  // context: { kind: 'coverage' | 'gap', data: {...} }
  const isGap = context?.kind === 'gap';
  const title = isGap ? context.data.title : `${context.data.axis} coverage`;
  const sub   = isGap ? `${context.data.type} · ${context.data.dim}` : context.data.tooltip;

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(11,13,18,.55)', zIndex:50,
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
      backdropFilter:'blur(2px)'
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'min(720px, 100%)', background:'#fff', borderRadius:14, boxShadow:'0 24px 60px rgba(11,13,18,.18)',
        overflow:'hidden', display:'flex', flexDirection:'column', maxHeight:'calc(100vh - 48px)',
        border:'1px solid #E9ECF3'
      }}>
        <div style={{padding:'18px 24px', borderBottom:'1px solid #E9E9E9', display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#4285F4'}}>
              {isGap ? 'Gap alert' : 'Coverage drill-down'}
            </div>
            <div style={{fontFamily:'Jost',fontSize:22,fontWeight:500,color:'#111125',marginTop:2}}>{title}</div>
            <div style={{fontFamily:'DM Sans',fontSize:13,color:'#6F7482',marginTop:2}}>{sub}</div>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:0,cursor:'pointer',fontSize:20,color:'#6F7482',lineHeight:1}}>×</button>
        </div>

        <div style={{padding:'20px 24px', display:'flex',flexDirection:'column',gap:20, overflow:'auto'}}>
          {/* summary */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:12}}>
            {(isGap
              ? [
                  { k:'Coverage',  v: `${context.data.coverage}%`, d:'vs ideal' },
                  { k:'Severity',  v: context.data.severity, d:'gap classification' },
                  { k:'Affected',  v: '2 projects', d:'Legal QA, Medical NER' },
                ]
              : [
                  { k:'Coverage',  v: `${context.data.actual}%`, d:'actual / ideal' },
                  { k:'Gap score', v: context.data.actual < 50 ? 'High' : context.data.actual < 80 ? 'Medium' : 'Low', d:'severity-weighted' },
                  { k:'Trend 30d', v: '−2.4pp', d:'deterioration' },
                ]
            ).map((m,i)=>(
              <div key={i} style={{padding:'12px 14px', background:'#F8F9FC', borderRadius:10}}>
                <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',fontWeight:500,textTransform:'uppercase',letterSpacing:'.04em'}}>{m.k}</div>
                <div style={{fontFamily:'Jost',fontSize:18,fontWeight:500,color:'#111125',marginTop:2}}>{m.v}</div>
                <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>{m.d}</div>
              </div>
            ))}
          </div>

          {/* breakdown */}
          <div>
            <div style={{fontFamily:'Jost',fontSize:14,fontWeight:500,color:'#111125',marginBottom:10}}>Breakdown</div>
            <AvailabilityBreakdown/>
          </div>

          {/* recommended campaign */}
          <div style={{padding:'16px 18px',border:'1px solid #DBE9FF',background:'#F4F8FF',borderRadius:12,display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{width:32,height:32,borderRadius:8,background:'#4285F4',display:'grid',placeItems:'center',flexShrink:0}}>
              <Icon name="sparkle" size={16} color="#fff"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#3160B7'}}>AI-Recommended Campaign</div>
              <div style={{fontFamily:'Jost',fontSize:15,fontWeight:500,color:'#111125',marginTop:2}}>
                {isGap ? context.data.action : 'Weekend recruitment — APAC push-sensitive cohort'}
              </div>
              <div style={{fontFamily:'DM Sans',fontSize:13,color:'#2C2C2C',marginTop:6,lineHeight:1.55}}>
                Est. budget <b>$4,200</b> · Suggested channels: <b>Facebook Lite · TikTok SEA · Upwork SG</b>.
                Optimal send window <b>Sat 19:00 SGT</b> — derived from Temporal Footprint of matched segment.
              </div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button style={{padding:'8px 14px',background:'#4285F4',color:'#fff',border:0,borderRadius:8,fontFamily:'Jost',fontSize:13,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
                  Generate brief <Icon name="arrow-right" size={13} color="#fff"/>
                </button>
                <button style={{padding:'8px 14px',background:'#fff',color:'#2C2C2C',border:'1px solid #E1E1E1',borderRadius:8,fontFamily:'Jost',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                  Export segment ({isGap ? '9,200' : '1,430'})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DrillDownModal = DrillDownModal;
