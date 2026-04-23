// §6.2.1 Lifecycle Funnel + Stated Preference + Motivation survey pies

const FUNNEL = [
  { stage:'Registered', count:12400, desc:'Account created · onboarding not started' },
  { stage:'Onboarded',  count: 8200, desc:'tutorial completed' },
  { stage:'Eligible',   count: 6800, desc:'First exam passed' },
  { stage:'Activated',  count: 5100, desc:'First task completed' },
  { stage:'Engaged',    count: 3800, desc:'Active within past 7 days' },
  { stage:'Churned',    count: 1900, desc:'≥7 days no task activity' },
];

// ─── Survey data ──────────────────────────────────────────────────
// Stated Preference — work_pace / work_style / task_complexity
const PREF_SURVEYS = [
  {
    title: 'Work pace',
    items: [
      { label:'quick',     count:138, color:'#4285F4' },
      { label:'thorough',  count:178, color:'#9DC6FF' },
    ],
  },
  {
    title: 'Work style',
    items: [
      { label:'independent',    count:176, color:'#4285F4' },
      { label:'collaborative',  count:140, color:'#9DC6FF' },
    ],
  },
  {
    title: 'Task complexity',
    items: [
      { label:'simple',   count:158, color:'#4285F4' },
      { label:'complex',  count:158, color:'#9DC6FF' },
    ],
  },
];

// Motivation — motivations[] / leaderboard_pref
const MOTIV_SURVEYS = [
  {
    title: 'Motivations',
    note: '% of responses · multi-select',
    items: [
      { label:'money',       count: 96, color:'#3160B7' },
      { label:'skills',      count: 64, color:'#4285F4' },
      { label:'productive',  count: 58, color:'#7CA9FC' },
      { label:'contribute',  count: 53, color:'#9DC6FF' },
      { label:'referral',    count:  6, color:'#CFE0FE' },
      { label:'other',       count:  2, color:'#E8F2FE' },
    ],
  },
  {
    title: 'Leaderboard performance',
    items: [
      { label:'climb',     count: 55, color:'#3160B7' },
      { label:'personal',  count: 40, color:'#7CA9FC' },
      { label:'ignore',    count: 17, color:'#CFE0FE' },
    ],
  },
];

// ─── Generic survey donut ─────────────────────────────────────────
function SurveyDonut({ title, note, items }) {
  const size = 110, R = 42, r2 = R - 13, cx = size/2, cy = size/2;
  const total = items.reduce((s,d) => s + d.count, 0);
  let acc = 0;

  const arc = (start, end) => {
    const gap = end - start;
    if (gap <= 0) return '';
    // Full circle: draw as two halves
    if (gap >= 0.9999) {
      const mid = start + gap/2;
      const am = -Math.PI/2 + 2*Math.PI*mid;
      const a0 = -Math.PI/2 + 2*Math.PI*start;
      return [
        `M${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)}`,
        `A${R},${R} 0 1 1 ${cx+R*Math.cos(am)},${cy+R*Math.sin(am)}`,
        `A${R},${R} 0 1 1 ${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)}`,
        `L${cx+r2*Math.cos(a0)},${cy+r2*Math.sin(a0)}`,
        `A${r2},${r2} 0 1 0 ${cx+r2*Math.cos(am)},${cy+r2*Math.sin(am)}`,
        `A${r2},${r2} 0 1 0 ${cx+r2*Math.cos(a0)},${cy+r2*Math.sin(a0)} Z`,
      ].join(' ');
    }
    const a0 = -Math.PI/2 + 2*Math.PI*start;
    const a1 = -Math.PI/2 + 2*Math.PI*end;
    const lg = gap > 0.5 ? 1 : 0;
    return [
      `M${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)}`,
      `A${R},${R} 0 ${lg} 1 ${cx+R*Math.cos(a1)},${cy+R*Math.sin(a1)}`,
      `L${cx+r2*Math.cos(a1)},${cy+r2*Math.sin(a1)}`,
      `A${r2},${r2} 0 ${lg} 0 ${cx+r2*Math.cos(a0)},${cy+r2*Math.sin(a0)} Z`,
    ].join(' ');
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap:8, minWidth:0}}>
      <div style={{fontFamily:'DM Sans', fontSize:11, fontWeight:700, color:'#111125', lineHeight:1.3}}>
        {title}
      </div>
      <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
        <svg width={size} height={size} style={{flexShrink:0}}>
          {items.map((d,i) => {
            const start = acc/total;
            acc += d.count;
            const end = acc/total;
            return <path key={i} d={arc(start, end)} fill={d.color}/>;
          })}
        </svg>
        <div style={{display:'flex', flexDirection:'column', gap:4, flex:1, minWidth:0, paddingTop:4}}>
          {note && <div style={{fontFamily:'DM Sans', fontSize:9, color:'#9AA2B1', marginBottom:2}}>{note}</div>}
          {items.map((d,i) => {
            const pct = (d.count/total*100).toFixed(0);
            return (
              <div key={i} style={{display:'grid', gridTemplateColumns:'7px 1fr auto', gap:5, alignItems:'center'}}>
                <span style={{width:7, height:7, borderRadius:2, background:d.color, flexShrink:0}}/>
                <span style={{fontFamily:'DM Sans', fontSize:10.5, color:'#6F7482', lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{d.label}</span>
                <span style={{fontFamily:'Jost', fontSize:10.5, fontWeight:600, color:'#111125', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap'}}>{d.count} <span style={{fontWeight:400, color:'#9AA2B1'}}>({pct}%)</span></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Funnel bars ──────────────────────────────────────────────────
function FunnelBars() {
  const max = FUNNEL[0].count;
  const BAR_H = 88;
  return (
    <div style={{display:'grid', gridTemplateColumns:`repeat(${FUNNEL.length}, 1fr)`, gap:8, alignItems:'end'}}>
      {FUNNEL.map((s,i) => {
        const h = Math.max((s.count/max)*BAR_H, 6);
        const prev = i>0 ? FUNNEL[i-1].count : null;
        const rate = prev ? Math.round(s.count/prev*100) : 100;
        const isChurn = s.stage === 'Churned';
        const isWeak  = rate < 85;
        return (
          <div key={s.stage} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:0}}>
            <div style={{fontFamily:'Jost', fontSize:11, fontWeight:600, color:'#111125', fontVariantNumeric:'tabular-nums', lineHeight:1}}>
              {(s.count/1000).toFixed(1)}k
            </div>
            <div style={{width:'100%', height:BAR_H, display:'flex', alignItems:'flex-end'}}>
              <div style={{
                width:'100%', height:h,
                background: isChurn
                  ? 'linear-gradient(180deg,#F44336,#F9A8A8)'
                  : 'linear-gradient(180deg,#4285F4,#9DC6FF)',
                borderRadius:'3px 3px 0 0',
              }}/>
            </div>
            <div style={{fontFamily:'DM Sans', fontSize:10.5, fontWeight:600, color:'#2C2C2C', textAlign:'center', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100%'}}>
              {s.stage}
            </div>
            <div style={{fontFamily:'DM Sans', fontSize:9, color:'#9AA2B1', textAlign:'center', lineHeight:1.3, overflow:'hidden', width:'100%', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>
              {s.desc}
            </div>
            <div style={{fontFamily:'DM Sans', fontSize:9.5, fontWeight:600, lineHeight:1, marginTop:2,
              color: i===0 ? 'transparent' : isChurn ? '#F44336' : isWeak ? '#F59E0B' : '#22C55E'}}>
              {i===0 ? '—' : `${rate}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Lifecycle module (funnel only) ───────────────────────────────
function LifecycleModule({ onNavigate }) {
  return (
    <div>
      <div style={{fontFamily:'DM Sans', fontSize:12, fontWeight:600, color:'#111125', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span>Lifecycle stages</span>
        <span style={{color:'#6F7482', fontWeight:500, fontSize:11}}>Registered → Churned · conversion rate per stage</span>
      </div>
      <FunnelBars/>
    </div>
  );
}

// ─── Survey module (stated preference + motivation) ────────────────
function SurveyModule() {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
      {/* Stated Preference */}
      <div>
        <div style={{fontFamily:'DM Sans', fontSize:11.5, fontWeight:700, color:'#6F7482', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14}}>
          Stated Preference
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
          {PREF_SURVEYS.map((s,i) => (
            <SurveyDonut key={i} title={s.title}items={s.items}/>
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div style={{borderLeft:'1px solid #F2F3F8', paddingLeft:24}}>
        <div style={{fontFamily:'DM Sans', fontSize:11.5, fontWeight:700, color:'#6F7482', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14}}>
          Motivation
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16}}>
          {MOTIV_SURVEYS.map((s,i) => (
            <SurveyDonut key={i} title={s.title}note={s.note} items={s.items}/>
          ))}
        </div>
      </div>
    </div>
  );
}

window.LifecycleModule = LifecycleModule;
window.SurveyModule = SurveyModule;
window.FunnelBars = FunnelBars;
