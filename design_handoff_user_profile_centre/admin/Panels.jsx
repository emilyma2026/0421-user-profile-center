// Supporting panels for Pool Health Overview.
// - GapAlertPanel: top gap alerts (preview; full module lives in §6.2.3)
// - AvailabilityBreakdown: weak-dimension drill
// (LifecycleDonut moved to LifecycleFunnel.jsx)

// ─────────────────────────────────────────────────────────────────
// Gap Alerts preview (cards from §6.2.3)
const GAPS = [
  {
    severity:'critical', type:'Acquisition Gap',
    title:'Spanish · LATAM · L2',
    stat:'3 active / 50 required',
    coverage:6, dim:'Language',
    note:'Blocking Legal QA — Brazil launch',
    action:'Launch targeted acquisition',
  },
  {
    severity:'critical', type:'Throughput Gap',
    title:'Philippines dormant pool',
    stat:'9,200 registered · 0 active 30d',
    coverage:0, dim:'Geography',
    note:'High-intent recall opportunity',
    action:'Re-engagement campaign',
  },
  {
    severity:'warning', type:'Throughput Gap',
    title:'Weekend availability (APAC)',
    stat:'34% of ideal window',
    coverage:34, dim:'Availability',
    note:'Under-supply during Sat 18:00 SGT window',
    action:'Push Sensitive nudge',
  },
  {
    severity:'warning', type:'Throughput Gap',
    title:'Accuracy decline · Cohort 2025-12',
    stat:'−4.1pp in last 14d',
    coverage:79, dim:'Engagement',
    note:'Quality drift in Medical NER pack v3',
    action:'Upskilling campaign',
  },
];
function severityStyles(s){
  if(s==='critical') return { dot:'#F44336', bg:'#FEECEB', ring:'#F9C4C0', label:'Critical', labelColor:'#B42318' };
  if(s==='warning')  return { dot:'#F59E0B', bg:'#FFF8E6', ring:'#F7E1A7', label:'Warning',  labelColor:'#6B4F11' };
  return { dot:'#22C55E', bg:'#E8F6EC', ring:'#BBE7C6', label:'Healthy', labelColor:'#15803D' };
}
function GapAlertRow({ gap, onOpen }) {
  const s = severityStyles(gap.severity);
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'auto 1fr', gap:12,
      padding:'12px 14px', border:'1px solid #E9E9E9', borderRadius:10, background:'#fff',
    }}>
      <div style={{
        width:8, alignSelf:'stretch', background:s.dot, borderRadius:4,
      }}/>
      <div style={{display:'flex',flexDirection:'column',gap:6, minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <span style={{
            fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
            color:s.labelColor, background:s.bg, border:`1px solid ${s.ring}`, padding:'2px 7px',borderRadius:999,
            whiteSpace:'nowrap'
          }}>{s.label}</span>
          <span style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',fontWeight:500}}>{gap.type} · {gap.dim}</span>
        </div>
        <div style={{fontFamily:'Jost',fontSize:14,fontWeight:500,color:'#111125'}}>{gap.title}</div>
        <div style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>{gap.stat} · <span style={{color:'#6F7482'}}>{gap.note}</span></div>
        <button onClick={()=>onOpen && onOpen(gap)} style={{
          marginTop:4, alignSelf:'flex-start',
          display:'inline-flex', alignItems:'center', gap:6, padding:'7px 12px',
          background:'#4285F4', color:'#fff', border:0, borderRadius:7,
          fontFamily:'Jost', fontSize:12, fontWeight:500, cursor:'pointer',
          whiteSpace:'nowrap'
        }}>
          <Icon name="sparkle" size={12} color="#fff"/>
          {gap.action}
          <Icon name="arrow-right" size={12} color="#fff"/>
        </button>
      </div>
    </div>
  );
}
function GapAlertPanel({ onOpen, onViewAll }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {GAPS.slice(0,3).map((g,i)=><GapAlertRow key={i} gap={g} onOpen={onOpen}/>)}
      <button onClick={onViewAll} style={{
        marginTop:2, alignSelf:'flex-start', background:'transparent',border:0, color:'#4285F4',
        fontFamily:'Jost',fontSize:13,fontWeight:500,cursor:'pointer',padding:0,
        display:'inline-flex',alignItems:'center',gap:4
      }}>View all 4 gap alerts <Icon name="arrow-right" size={13}/></button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Weak-dimension drill — mini bar list for a dimension
const WEAK_AVAILABILITY = [
  { win:'Weekday · 09–18 UTC',   actual:72, target:80 },
  { win:'Weekday · 18–24 UTC',   actual:58, target:80 },
  { win:'Weekend · 00–12 UTC',   actual:24, target:70 },
  { win:'Weekend · 12–24 UTC',   actual:19, target:70 },
  { win:'APAC late-night (SGT)', actual:12, target:60 },
];
function AvailabilityBreakdown() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {WEAK_AVAILABILITY.map(w=>{
        const pct = w.actual / w.target * 100;
        const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#F44336';
        return (
          <div key={w.win} style={{display:'grid',gridTemplateColumns:'170px 1fr 72px',alignItems:'center',gap:10}}>
            <div style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>{w.win}</div>
            <div style={{position:'relative',height:8,borderRadius:999,background:'#F2F3F8',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,width:`${w.actual}%`,background:color,borderRadius:999}}/>
              <div style={{position:'absolute',top:-3,bottom:-3,left:`${w.target}%`,width:2,background:'#111125',opacity:.25}}/>
            </div>
            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:12,fontWeight:500,color,fontVariantNumeric:'tabular-nums'}}>
              {w.actual}/{w.target}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.GapAlertPanel = GapAlertPanel;
window.GapAlertRow = GapAlertRow;
window.AvailabilityBreakdown = AvailabilityBreakdown;
window.GAPS_DATA = GAPS;
