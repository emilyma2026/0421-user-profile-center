// §6.2.4 Analytics & Insights — multi-tab analytics dashboard.
// Tabs: Cohort Retention · Funnel · Segment Compare · X→Y Explorer · Zombie Analysis

// ──────── Shared small chart primitives ────────────────────────
function LineChart({ series, width=520, height=220, colors=['#4285F4','#22C55E','#F59E0B','#8B5CF6'], yLabel='%', yMax=100 }) {
  const padL=36, padB=28, padT=10, padR=10;
  const iw = width-padL-padR, ih = height-padT-padB;
  const maxLen = Math.max(...series.map(s=>s.points.length));
  const xAt = (i) => padL + (i/(maxLen-1))*iw;
  const yAt = (v) => padT + (1 - v/yMax)*ih;
  const ticks = [0, 25, 50, 75, 100].filter(t=>t<=yMax);
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      {ticks.map(t=>(
        <g key={t}>
          <line x1={padL} x2={width-padR} y1={yAt(t)} y2={yAt(t)} stroke="#F2F3F8" strokeWidth="1"/>
          <text x={padL-8} y={yAt(t)+3} textAnchor="end" fontFamily="DM Sans" fontSize="10" fill="#6F7482">{t}{yLabel}</text>
        </g>
      ))}
      {series.map((s,si)=>{
        const d = s.points.map((p,i)=>`${i===0?'M':'L'}${xAt(i)},${yAt(p)}`).join(' ');
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={colors[si%colors.length]} strokeWidth="2"/>
            {s.points.map((p,i)=>(
              <circle key={i} cx={xAt(i)} cy={yAt(p)} r="2.5" fill={colors[si%colors.length]}/>
            ))}
          </g>
        );
      })}
      {series[0]?.xLabels?.map((l,i)=>(
        <text key={i} x={xAt(i)} y={height-8} textAnchor="middle" fontFamily="DM Sans" fontSize="10" fill="#6F7482">{l}</text>
      ))}
    </svg>
  );
}

function Legend({ items, inline }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap: inline ? 14 : 8, alignItems:'center'}}>
      {items.map(it=>(
        <div key={it.label} style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <span style={{width:10,height:10,borderRadius:2,background:it.color}}/>
          <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ──────── Cohort Retention View ────────────────────────────────
const COHORTS = [
  { name:'2025-09 · Philippines', color:'#4285F4', points:[100,84,72,64,58,54,51]   },
  { name:'2025-09 · Indonesia',   color:'#22C55E', points:[100,79,66,56,49,44,41]   },
  { name:'2025-09 · Mexico',      color:'#F59E0B', points:[100,88,78,72,68,65,62]   },
  { name:'2025-09 · Egypt',       color:'#8B5CF6', points:[100,72,55,44,36,30,26]   },
];
const COHORT_LABELS = ['Day 0','Day 7','Day 14','Day 30','Day 45','Day 60','Day 90'];

function CohortView({ compareBy }) {
  const series = COHORTS.map(c=>({...c, points:c.points, xLabels:COHORT_LABELS}));
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:20,alignItems:'flex-start'}}>
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125'}}>30/60/90-day retention by cohort</div>
          <Legend items={COHORTS.map(c=>({label:c.name.split('·')[1].trim(), color:c.color}))}/>
        </div>
        <LineChart series={series} colors={COHORTS.map(c=>c.color)} width={640} height={280} yMax={100}/>
        <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:8,lineHeight:1.5}}>
          Day-30 retention varies <b style={{color:'#111125'}}>3× across countries</b> · Mexico (72%) leads, Egypt (44%) trails. Onboarding nudges and language-matched briefs are the main levers.
        </div>
      </div>
      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:14}}>
        <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:10}}>
          Retention breakdown · {compareBy}
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontFamily:'DM Sans',fontSize:12}}>
          <thead>
            <tr style={{background:'#FAFBFD'}}>
              <th style={{padding:'8px 10px',textAlign:'left',color:'#6F7482',fontWeight:600,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.04em'}}>Cohort</th>
              <th style={{padding:'8px 10px',textAlign:'right',color:'#6F7482',fontWeight:600,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.04em'}}>D30</th>
              <th style={{padding:'8px 10px',textAlign:'right',color:'#6F7482',fontWeight:600,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.04em'}}>D60</th>
              <th style={{padding:'8px 10px',textAlign:'right',color:'#6F7482',fontWeight:600,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.04em'}}>D90</th>
            </tr>
          </thead>
          <tbody>
            {COHORTS.map(c=>(
              <tr key={c.name} style={{borderTop:'1px solid #F2F3F8'}}>
                <td style={{padding:'8px 10px',color:'#111125'}}>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
                    <span style={{width:8,height:8,borderRadius:2,background:c.color}}/>{c.name.split('·')[1].trim()}
                  </span>
                </td>
                <td style={{padding:'8px 10px',textAlign:'right',fontFamily:'Jost',fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{c.points[3]}%</td>
                <td style={{padding:'8px 10px',textAlign:'right',fontFamily:'Jost',fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{c.points[5]}%</td>
                <td style={{padding:'8px 10px',textAlign:'right',fontFamily:'Jost',fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{c.points[6]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ──────── Funnel Analysis View ─────────────────────────────────
const FUNNEL_STEPS = [
  { step:'Registration',       count:12400, drop:null },
  { step:'First login',        count:10100, drop:18 },
  { step:'Onboarding complete',count: 8200, drop:19 },
  { step:'Exam pass',          count: 6400, drop:22 },
  { step:'First task',         count: 5100, drop:20 },
  { step:'Repeat task',        count: 3800, drop:25 },
];

function FunnelView() {
  const max = FUNNEL_STEPS[0].count;
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:20,alignItems:'flex-start'}}>
      <div>
        <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125',marginBottom:10}}>Registration → Repeat task (30d conversion)</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {FUNNEL_STEPS.map((s,i)=>{
            const w = s.count/max*100;
            return (
              <div key={s.step} style={{display:'grid',gridTemplateColumns:'170px 1fr 90px 70px',alignItems:'center',gap:10}}>
                <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#2C2C2C'}}>{s.step}</div>
                <div style={{position:'relative',height:28,borderRadius:6,background:'#F2F3F8',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0,width:`${w}%`,
                    background:'linear-gradient(90deg,#4285F4,#7CA9FC)',borderRadius:6}}/>
                  <div style={{position:'absolute',left:8,top:0,bottom:0,display:'flex',alignItems:'center',color:'#fff',fontFamily:'Jost',fontSize:11.5,fontWeight:500,mixBlendMode:'normal'}}>
                    {((s.count/max)*100).toFixed(0)}%
                  </div>
                </div>
                <div style={{textAlign:'right',fontFamily:'Jost',fontSize:13,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums'}}>{s.count.toLocaleString()}</div>
                <div style={{textAlign:'right',fontFamily:'DM Sans',fontSize:11,color: s.drop && s.drop>22 ? '#F44336' : '#6F7482'}}>
                  {s.drop !== null ? `−${s.drop}%` : '—'}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,padding:'10px 12px',background:'#FEECEB',border:'1px solid #F9C4C0',borderRadius:8,fontFamily:'DM Sans',fontSize:11.5,color:'#B42318'}}>
          <b>Biggest drop-off:</b> First task → Repeat task (−25%). Indicates second-task friction; recommend task-match improvements + earnings preview.
        </div>
      </div>

      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:16,display:'flex',flexDirection:'column',gap:14}}>
        <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482'}}>Overall conversion</div>
        <div style={{display:'flex',alignItems:'baseline',gap:10}}>
          <div style={{fontFamily:'Jost',fontSize:42,fontWeight:500,color:'#111125',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>30.6%</div>
          <div style={{fontFamily:'DM Sans',fontSize:12,color:'#6F7482'}}>Registration → Repeat task</div>
        </div>
        <div style={{height:1,background:'#F2F3F8'}}/>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            { label:'Industry benchmark', value:'22%', hint:'+8.6pp better'},
            { label:'Best cohort (2025-07)', value:'38%', hint:'Target for 2025-Q2'},
            { label:'Worst cohort (2025-12)', value:'24%', hint:'Investigate drop'},
          ].map(r=>(
            <div key={r.label} style={{display:'grid',gridTemplateColumns:'1fr auto',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>{r.label}</div>
                <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:1}}>{r.hint}</div>
              </div>
              <div style={{fontFamily:'Jost',fontSize:16,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums'}}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────── Segment Comparison ───────────────────────────────────
const SEGMENT_PRESETS = {
  A: { name:'Weekend PH · L2+', vol:1240, acc:87.2, cov:68, churn:14, tasks:28 },
  B: { name:'Weekday PH · L2+', vol: 980, acc:82.1, cov:52, churn:22, tasks:21 },
  C: { name:'MX Incentive · any', vol: 640, acc:79.0, cov:41, churn:35, tasks:12 },
  D: { name:'SG Evergreen · L3', vol: 380, acc:91.4, cov:82, churn: 6, tasks:34 },
};

function SegmentCompare() {
  const [a, setA] = React.useState('A');
  const [b, setB] = React.useState('B');
  const sa = SEGMENT_PRESETS[a], sb = SEGMENT_PRESETS[b];

  const METRICS = [
    { key:'vol',   label:'Active labellers',       fmt:v=>v.toLocaleString()         },
    { key:'acc',   label:'Avg accuracy',           fmt:v=>`${v}%`,    max:100         },
    { key:'cov',   label:'Coverage (of ideal)',    fmt:v=>`${v}%`,    max:100         },
    { key:'tasks', label:'Tasks/labeller · 7d',    fmt:v=>v                           },
    { key:'churn', label:'Churn risk (avg)',       fmt:v=>`${v}%`,    inverse:true, max:100 },
  ];

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <SegmentPicker label="Segment A" color="#4285F4" value={a} onChange={setA}/>
        <SegmentPicker label="Segment B" color="#F59E0B" value={b} onChange={setB}/>
      </div>

      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:18}}>
        <div style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:14}}>Side-by-side</div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {METRICS.map(m=>{
            const va=sa[m.key], vb=sb[m.key];
            const better = m.inverse ? (va<vb?'A':'B') : (va>vb?'A':'B');
            const diff = m.key==='vol'||m.key==='tasks' ?
              `${((va-vb)/vb*100).toFixed(0)}%` :
              `${(va-vb).toFixed(1)}${m.fmt===((v)=>`${v}%`)?'pp':''}`;
            const sig = Math.abs(va-vb) > (m.max ? m.max*0.1 : vb*0.1);
            return (
              <div key={m.key} style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:14,alignItems:'center'}}>
                <MetricBar side="left"  color="#4285F4" value={va} max={m.max || Math.max(va,vb)*1.2} fmt={m.fmt} best={better==='A'}/>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:'#6F7482'}}>{m.label}</div>
                  <div style={{fontFamily:'DM Sans',fontSize:10.5,color: sig?'#4285F4':'#6F7482',marginTop:3,fontWeight: sig?600:500}}>
                    Δ {diff} {sig && '• significant'}
                  </div>
                </div>
                <MetricBar side="right" color="#F59E0B" value={vb} max={m.max || Math.max(va,vb)*1.2} fmt={m.fmt} best={better==='B'}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SegmentPicker({ label, color, value, onChange }) {
  return (
    <div style={{padding:12,background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,borderTop:`3px solid ${color}`}}>
      <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:6}}>{label}</div>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        width:'100%',padding:'7px 10px',borderRadius:6,border:'1px solid #E1E4EC',background:'#fff',
        fontFamily:'DM Sans',fontSize:13,color:'#111125',cursor:'pointer'
      }}>
        {Object.entries(SEGMENT_PRESETS).map(([k,s])=><option key={k} value={k}>{s.name}</option>)}
      </select>
      <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:6}}>n = {SEGMENT_PRESETS[value].vol.toLocaleString()}</div>
    </div>
  );
}

function MetricBar({ side, color, value, max, fmt, best }) {
  const w = Math.min(100, (value/max)*100);
  const isRight = side==='right';
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,flexDirection: isRight ? 'row' : 'row-reverse'}}>
      <div style={{flex:1, position:'relative', height:18, background:'#F2F3F8', borderRadius:4, overflow:'hidden'}}>
        <div style={{
          position:'absolute', top:0, bottom:0,
          [isRight?'left':'right']:0,
          width:`${w}%`,
          background: color, opacity: best ? 1 : .35, borderRadius:4
        }}/>
      </div>
      <div style={{minWidth:72, textAlign: isRight?'left':'right', fontFamily:'Jost', fontSize:13.5, fontWeight: best?600:500, color:'#111125',fontVariantNumeric:'tabular-nums'}}>
        {fmt(value)}
      </div>
    </div>
  );
}

// ──────── X → Y Correlation Explorer ───────────────────────────
const FEATURE_IMPORTANCES = [
  { feature:'Temporal consistency (days active/week)', importance:0.27, direction:'+', exemplar:'5+ days → retention ↑' },
  { feature:'Day-7 activation (first task within 7d)', importance:0.22, direction:'+', exemplar:'Activated D-7 → retention ×2.4' },
  { feature:'Device: mobile-primary',                  importance:0.11, direction:'−', exemplar:'Mobile-only → retention ↓' },
  { feature:'Employment: part-time',                   importance:0.10, direction:'+', exemplar:'PT "golden segment"'},
  { feature:'Registered on weekend',                   importance:0.08, direction:'+', exemplar:'Wknd cohort → +12% act.'},
  { feature:'Country: Philippines',                    importance:0.07, direction:'−', exemplar:'Dormant pool risk' },
  { feature:'Age group: 25–34',                        importance:0.05, direction:'+', exemplar:'Most consistent band' },
  { feature:'Language count (≥2)',                     importance:0.04, direction:'+', exemplar:'Multilingual → L3 ramp' },
];

// Scatter points for preview (x = feature value normalised, y = retention score)
const SCATTER = [
  {c:'#4285F4', pts:[{x:0.2,y:32},{x:0.3,y:48},{x:0.42,y:55},{x:0.5,y:62},{x:0.6,y:70},{x:0.72,y:78},{x:0.85,y:86}]}, // consistent upward
  {c:'#94A3B8', pts:[{x:0.15,y:22},{x:0.25,y:28},{x:0.35,y:33},{x:0.45,y:30},{x:0.55,y:36},{x:0.68,y:40},{x:0.78,y:44}]},
];

function FeatureBar({ f, max }) {
  const w = (f.importance/max)*100;
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 120px 70px 150px',alignItems:'center',gap:10,padding:'7px 0',borderTop:'1px solid #F2F3F8'}}>
      <div style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>{f.feature}</div>
      <div style={{height:6,background:'#F2F3F8',borderRadius:999,overflow:'hidden',position:'relative'}}>
        <div style={{width:`${w}%`,height:'100%',background: f.direction==='+' ? '#22C55E' : '#F44336',borderRadius:999}}/>
      </div>
      <div style={{fontFamily:'Jost',fontSize:12,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums',textAlign:'right'}}>{f.importance.toFixed(2)}</div>
      <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>{f.exemplar}</div>
    </div>
  );
}

function XYView() {
  const max = Math.max(...FEATURE_IMPORTANCES.map(f=>f.importance));
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div>
            <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125'}}>Feature importance</div>
            <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:2}}>SHAP values · Predicting 30d retention</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 120px 70px 150px',fontFamily:'DM Sans',fontSize:10,fontWeight:700,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.05em',padding:'0 0 6px'}}>
          <span>Feature</span><span>Strength</span><span style={{textAlign:'right'}}>SHAP</span><span>Example</span>
        </div>
        {FEATURE_IMPORTANCES.map(f=><FeatureBar key={f.feature} f={f} max={max}/>)}
      </div>

      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div>
            <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125'}}>Temporal consistency → Retention</div>
            <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:2}}>Scatter · n = 30,600 labellers</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,fontFamily:'DM Sans',fontSize:11,color:'#2C2C2C'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:5}}><span style={{width:8,height:8,borderRadius:99,background:'#4285F4'}}/>Active</span>
            <span style={{display:'inline-flex',alignItems:'center',gap:5}}><span style={{width:8,height:8,borderRadius:99,background:'#94A3B8'}}/>Dormant</span>
          </div>
        </div>
        <Scatter groups={SCATTER} width={440} height={260}/>
        <div style={{marginTop:10, padding:'10px 12px', background:'#EAF1FE', border:'1px solid #DBE9FF',borderRadius:8,fontFamily:'DM Sans',fontSize:11.5,color:'#1E4FA8'}}>
          <b>Strong positive correlation (r = +0.74).</b> Labellers active ≥5 days/week retain at 2.4× the rate of occasional users.
        </div>
      </div>
    </div>
  );
}

function Scatter({ groups, width, height }) {
  const padL=36,padB=28,padT=10,padR=10;
  const iw=width-padL-padR, ih=height-padT-padB;
  const trend = [{x:0.1,y:28},{x:0.9,y:88}];
  const xAt=(x)=>padL+x*iw, yAt=(y)=>padT+(1-y/100)*ih;
  return (
    <svg width={width} height={height}>
      {[0,25,50,75,100].map(t=>(
        <g key={t}>
          <line x1={padL} x2={width-padR} y1={yAt(t)} y2={yAt(t)} stroke="#F2F3F8"/>
          <text x={padL-8} y={yAt(t)+3} textAnchor="end" fontFamily="DM Sans" fontSize="10" fill="#6F7482">{t}%</text>
        </g>
      ))}
      <text x={padL} y={height-8} fontFamily="DM Sans" fontSize="10" fill="#6F7482">0 d/w</text>
      <text x={width-padR} y={height-8} textAnchor="end" fontFamily="DM Sans" fontSize="10" fill="#6F7482">7 d/w</text>
      <line
        x1={xAt(trend[0].x)} y1={yAt(trend[0].y)}
        x2={xAt(trend[1].x)} y2={yAt(trend[1].y)}
        stroke="#4285F4" strokeDasharray="4 4" strokeWidth="1.5"
      />
      {groups.map((g,gi)=>g.pts.map((p,i)=>(
        <circle key={`${gi}-${i}`} cx={xAt(p.x)} cy={yAt(p.y)} r="4" fill={g.c} opacity="0.85"/>
      )))}
    </svg>
  );
}

// ──────── Zombie User Analysis ─────────────────────────────────
const ZOMBIE_BY_COUNTRY = [
  { country:'Philippines', count:6800, pct:74 },
  { country:'Indonesia',   count:1400, pct:15 },
  { country:'Egypt',       count: 560, pct: 6 },
  { country:'Mexico',      count: 280, pct: 3 },
  { country:'Other',       count: 160, pct: 2 },
];
const ZOMBIE_BY_DURATION = [
  { bucket:'1–7 days',   count:  80 },
  { bucket:'8–30 days',  count: 520 },
  { bucket:'31–60 days', count:2400 },
  { bucket:'61–90 days', count:3600 },
  { bucket:'90+ days',   count:2600 },
];

function ZombieView() {
  const totalCountry = ZOMBIE_BY_COUNTRY.reduce((s,d)=>s+d.count,0);
  const maxDur = Math.max(...ZOMBIE_BY_DURATION.map(d=>d.count));

  return (
    <div>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        {[
          {label:'Zombie users total', value:'9,200', hint:'Registered, never activated'},
          {label:'Avg days since reg', value:'67 d',  hint:'Median 54d'},
          {label:'Recoverable (predicted)', value:'32%', hint:'≈ 2,940 users · re-engage'},
          {label:'Est. throughput gain', value:'+ 450/wk', hint:'If 10% convert'},
        ].map(k=>(
          <div key={k.label} style={{flex:1,padding:14,background:'#fff',border:'1px solid #E9ECF3',borderRadius:10}}>
            <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>{k.label}</div>
            <div style={{fontFamily:'Jost',fontSize:24,fontWeight:500,color:'#111125',marginTop:3,fontVariantNumeric:'tabular-nums'}}>{k.value}</div>
            <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:2}}>{k.hint}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:16}}>
          <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125',marginBottom:10}}>By country</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {ZOMBIE_BY_COUNTRY.map(c=>(
              <div key={c.country} style={{display:'grid',gridTemplateColumns:'100px 1fr 60px 40px',alignItems:'center',gap:10}}>
                <span style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>{c.country}</span>
                <div style={{height:10,background:'#F2F3F8',borderRadius:999,overflow:'hidden'}}>
                  <div style={{width:`${c.pct}%`,height:'100%',background:'#94A3B8',borderRadius:999}}/>
                </div>
                <span style={{textAlign:'right',fontFamily:'Jost',fontSize:12,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums'}}>{c.count.toLocaleString()}</span>
                <span style={{textAlign:'right',fontFamily:'DM Sans',fontSize:11,color:'#6F7482',fontVariantNumeric:'tabular-nums'}}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,padding:16}}>
          <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125',marginBottom:10}}>Time-since-registration distribution</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:10,height:140}}>
            {ZOMBIE_BY_DURATION.map(b=>{
              const h = b.count/maxDur*120;
              return (
                <div key={b.bucket} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                  <div style={{fontFamily:'Jost',fontSize:10.5,fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums'}}>{b.count.toLocaleString()}</div>
                  <div style={{width:'100%',height:h,background:'linear-gradient(180deg,#94A3B8,#CBD5E1)',borderRadius:'3px 3px 0 0'}}/>
                  <div style={{fontFamily:'DM Sans',fontSize:10,color:'#6F7482',textAlign:'center',lineHeight:1.2}}>{b.bucket}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10,padding:'8px 10px',background:'#FFF8E6',border:'1px solid #F7E1A7',borderRadius:6,fontFamily:'DM Sans',fontSize:11,color:'#6B4F11'}}>
            Zombie density peaks at 61–90 days. Recall campaigns beyond 90d convert &lt; 4% — prioritise the 30–60d window.
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────── Tab shell ────────────────────────────────────────────
const ANALYTIC_TABS = [
  { k:'cohort',   label:'Cohort Retention',icon:'trending-up' },
  { k:'funnel',   label:'Funnel',          icon:'layers' },
  { k:'compare',  label:'Segment Compare', icon:'users' },
  { k:'xy',       label:'X → Y Explorer',  icon:'target' },
  { k:'zombie',   label:'Zombie Analysis', icon:'alert' },
];

function AnalyticsModule() {
  const [tab, setTab] = React.useState('cohort');
  const [compareBy, setCompareBy] = React.useState('Country');

  return (
    <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>Analytics &amp; Insights</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            Cohort retention, funnel analysis, segment comparison, X→Y correlation explorer (§6.2.4)
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={{padding:'7px 12px',border:'1px solid #E1E4EC',background:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12.5,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
            <Icon name="calendar" size={13} color="#6F7482"/> Last 90d
          </button>
          <button style={{padding:'7px 12px',border:0,background:'#4285F4',color:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
            <Icon name="download" size={13} color="#fff"/> Export insights
          </button>
        </div>
      </div>

      {/* Sub-tab strip */}
      <div style={{display:'flex',gap:4,padding:4,background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,alignSelf:'flex-start'}}>
        {ANALYTIC_TABS.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:'7px 14px',borderRadius:7,border:0,cursor:'pointer',
            background: tab===t.k ? '#EAF1FE' : 'transparent',
            color: tab===t.k ? '#1E4FA8' : '#2C2C2C',
            fontFamily:'DM Sans',fontSize:12.5,fontWeight: tab===t.k ? 600 : 500,
            display:'inline-flex',alignItems:'center',gap:6
          }}>
            <Icon name={t.icon} size={13} color={tab===t.k ? '#1E4FA8':'#6F7482'}/>
            {t.label}
          </button>
        ))}
      </div>

      {/* Secondary toolbar (per-tab) */}
      {tab==='cohort' && (
        <div style={{display:'flex',alignItems:'center',gap:14,padding:'10px 14px',background:'#fff',border:'1px solid #E9ECF3',borderRadius:10}}>
          <span style={{fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:'#6F7482'}}>Compare by</span>
          <div style={{display:'flex',gap:5}}>
            {['Country','Archetype','Registration month'].map(opt=>(
              <button key={opt} onClick={()=>setCompareBy(opt)} style={{
                padding:'5px 10px',borderRadius:999,cursor:'pointer',
                border:`1px solid ${compareBy===opt?'#4285F4':'#E1E4EC'}`,
                background: compareBy===opt?'#EAF1FE':'#fff',
                color: compareBy===opt?'#1E4FA8':'#2C2C2C',
                fontFamily:'DM Sans',fontSize:11.5,fontWeight: compareBy===opt?600:500
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:12,padding:20}}>
        {tab==='cohort'  && <CohortView  compareBy={compareBy}/>}
        {tab==='funnel'  && <FunnelView/>}
        {tab==='compare' && <SegmentCompare/>}
        {tab==='xy'      && <XYView/>}
        {tab==='zombie'  && <ZombieView/>}
      </div>
    </div>
  );
}

window.AnalyticsModule = AnalyticsModule;
