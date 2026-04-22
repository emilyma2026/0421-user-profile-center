// Drill-down modal opened when a user clicks a Coverage axis or a Gap alert.
// Shows the dimension breakdown + recommended campaigns (§6.2.3).

// Per-action campaign descriptions (no budget, no channels)
const GAP_CAMPAIGN_DESC = {
  'Re-engagement campaign':
    'Send a targeted in-app and SMS re-engagement push to dormant labellers in this pool. Prioritise users who completed at least one task before going inactive.',
  'Push Sensitive nudge':
    'Deliver a personalised in-app nudge timed to peak availability windows. Target the Push Sensitive cohort — users who respond to timely prompts.',
  'Upskilling campaign':
    'Launch a guided upskilling programme: recommended tutorial pack, practice tasks, peer comparison, and a micro-credential on completion. Triggered by cohort accuracy drop.',
  'Targeted acquisition campaign': null, // handled as Action Needed
};

function DrillDownModal({ open, onClose, context }) {
  if (!open) return null;

  // context: { kind: 'coverage' | 'gap', data: {...} }
  const isGap = context?.kind === 'gap';
  const title = isGap ? context.data.title : `${context.data.axis} coverage`;
  const sub   = isGap ? `${context.data.type} · ${context.data.dim}` : context.data.tooltip;
  // Determine if this gap needs external recruitment (Action Needed) vs a campaign
  const action = isGap ? (context.data.action || '') : '';
  const isAcquisition = action.toLowerCase().includes('acquisition') || action.toLowerCase().includes('recruit');

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
          <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:12}}>
            {(isGap
              ? [
                  { k:'Severity',  v: context.data.severity, d:'gap classification' },
                  { k:'Affected',  v: (context.data.projects?.length || 0) + ' project' + (context.data.projects?.length !== 1 ? 's' : ''), d:'see below' },
                ]
              : [
                  { k:'Coverage',  v: `${context.data.actual}%`, d:'actual / ideal' },
                  { k:'Gap score', v: context.data.actual < 50 ? 'High' : context.data.actual < 80 ? 'Medium' : 'Low', d:'severity-weighted' },
                ]
            ).map((m,i)=>(
              <div key={i} style={{padding:'12px 14px', background:'#F8F9FC', borderRadius:10}}>
                <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',fontWeight:500,textTransform:'uppercase',letterSpacing:'.04em'}}>{m.k}</div>
                <div style={{fontFamily:'Jost',fontSize:18,fontWeight:500,color:'#111125',marginTop:2}}>{m.v}</div>
                <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>{m.d}</div>
              </div>
            ))}
          </div>

          {/* affected projects chips */}
          {isGap && context.data.projects?.length > 0 && (
            <div>
              <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Affected projects</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {context.data.projects.map(function(p) {
                  return (
                    <button key={p} style={{
                      padding:'5px 12px',borderRadius:999,background:'#fff',border:'1px solid #E1E4EC',
                      fontFamily:'DM Sans',fontSize:12,color:'#111125',cursor:'pointer',
                      transition:'background .15s,border-color .15s',
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.background='#F4F8FF';e.currentTarget.style.borderColor='#4285F4';e.currentTarget.style.color='#1E4FA8';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor='#E1E4EC';e.currentTarget.style.color='#111125';}}
                    >{p}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* recommended campaign / action needed */}
          {isAcquisition ? (
            /* ── Acquisition gap → Action Needed (no channels, no budget) ── */
            <div style={{border:'1.5px solid #EDE9FE',borderRadius:12,overflow:'hidden',background:'#fff'}}>
              <div style={{padding:'10px 16px',background:'#F5F3FF',borderBottom:'1px solid #EDE9FE',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  <Icon name="alert-circle" size={13} color="#7C3AED"/>
                  <span style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#7C3AED'}}>Action Needed</span>
                </div>
                <span style={{padding:'2px 8px',borderRadius:999,background:'#EDE9FE',color:'#6D28D9',fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>Recruitment</span>
              </div>
              <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontFamily:'Jost',fontSize:15,fontWeight:600,color:'#111125'}}>
                  {isGap ? context.data.title : 'Recruitment gap'}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {[
                    { label:'Dimension', value: isGap ? context.data.dim : '—' },
                    { label:'Region',    value: isGap && context.data.dim === 'Language' ? (context.data.geo || 'Global') : (isGap ? context.data.dim : '—') },
                    { label:'Coverage',  value: isGap ? context.data.coverage + '%' : '—' },
                    { label:'Gap',       value: isGap ? context.data.stat : '—', accent: true },
                  ].map(function(row, i) {
                    return (
                      <div key={i} style={{display:'grid',gridTemplateColumns:'90px 1fr',gap:8,alignItems:'baseline'}}>
                        <span style={{fontFamily:'DM Sans',fontSize:10.5,color:'#9AA2B1',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{row.label}</span>
                        <span style={{fontFamily:'DM Sans',fontSize:12,fontWeight: row.accent ? 700 : 500, color: row.accent ? '#7C3AED' : '#111125'}}>{row.value}</span>
                      </div>
                    );
                  })}
                </div>
                {isGap && context.data.note && (
                  <div style={{marginTop:4,padding:'7px 10px',background:'#F5F3FF',borderRadius:7,fontFamily:'DM Sans',fontSize:11.5,color:'#6D28D9',lineHeight:1.5}}>
                    {context.data.note}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Campaign gap → Recommended Campaign ── */
            <div style={{padding:'16px 18px',border:'1px solid #DBE9FF',background:'#F4F8FF',borderRadius:12,display:'flex',gap:12,alignItems:'flex-start'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'#4285F4',display:'grid',placeItems:'center',flexShrink:0}}>
                <Icon name="sparkle" size={16} color="#fff"/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#3160B7'}}>Recommended Campaign</div>
                <div style={{fontFamily:'Jost',fontSize:15,fontWeight:500,color:'#111125',marginTop:2}}>
                  {isGap ? action : 'Weekend availability push — APAC cohort'}
                </div>
                <div style={{fontFamily:'DM Sans',fontSize:13,color:'#2C2C2C',marginTop:6,lineHeight:1.55}}>
                  {(isGap && GAP_CAMPAIGN_DESC[action]) || 'Analyse the matched segment and generate a tailored campaign brief.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.DrillDownModal = DrillDownModal;
