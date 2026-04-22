// §6.2.3 Gap Detection & Alerts — full module.
// Ranked list of all gaps with scoring transparency, dimension filters,
// and an auto-generated campaign brief drawer.

const ALL_GAPS = [
  {
    id:'gap-ph-dormant', severity:'critical', type:'Throughput Gap', dim:'Geography', geo:'Philippines',
    title:'Philippines dormant pool',
    required:2000, available:0, pct:0,
    note:'9,200 registered · 0 active 30d · high recall opportunity',
    projects:['Tagalog Speech', 'OCR Forms PH'],
    score:88,
    action:'Re-engagement campaign',
    recipe:'reengagement',
    recAction:'Engagement rate in Philippines has dropped to 0% — 9,200 registered labellers have had no task activity in the past 30 days (12pp drop over 7d). Consider releasing a re-engagement campaign to reactivate the dormant pool.',
  },
  {
    id:'gap-apac-weekend', severity:'warning', type:'Throughput Gap', dim:'Engagement', geo:'APAC',
    title:'Weekend availability · APAC',
    required:100, available:34, pct:34,
    note:'Under-supply during Sat 18:00 SGT window',
    projects:['Live Moderation', 'Content Review APAC'],
    score:72,
    action:'Push Sensitive nudge',
    recipe:'nudge',
    recAction:'Engagement rate in APAC has dropped 8pp over the past 7d (42% → 34% of ideal Sat 18:00 SGT window). Consider releasing a re-engagement campaign to reactivate the dormant pool.',
  },
  {
    id:'gap-cohort-quality', severity:'warning', type:'Throughput Gap', dim:'Engagement', geo:'Global',
    title:'Accuracy decline · Cohort 2025-12',
    required:85, available:81, pct:79,
    note:'−4.1pp in last 14d · Medical NER pack v3',
    projects:['Medical NER v3'],
    score:66,
    action:'Upskilling campaign',
    recipe:'upskill',
    recAction:'Average accuracy in Cohort 2025-12 has declined 4.1pp over the past 7d (83% → 79%). Consider an upskilling or corrective campaign for the affected cohort.',
  },
  {
    id:'gap-ar-night', severity:'warning', type:'Acquisition Gap', dim:'Language', geo:'MENA',
    title:'Arabic · MENA · overnight',
    required:40, available:18, pct:45,
    note:'L3 speakers scarce during 00:00–06:00 AST',
    projects:['Dialect Classification', 'Arabic Translate QA'],
    score:61,
    action:'Targeted acquisition campaign',
    recipe:'acquisition',
    recAction:'Arabic L3 speaker pool in MENA is at 45% of required headcount (18 of 40 needed, 00:00–06:00 AST window). Consider targeted recruitment to fill this language gap.',
  },
  {
    id:'gap-vi-l3', severity:'warning', type:'Throughput Gap', dim:'Quality', geo:'Vietnam',
    title:'Vietnamese L3 ramp',
    required:30, available:22, pct:73,
    note:'L2→L3 promotion velocity has slowed',
    projects:['VN Speech Transcription'],
    score:52,
    action:'Upskilling campaign',
    recipe:'upskill',
    recAction:'Average accuracy progression in Vietnam L3 cohort has declined — L2→L3 promotion velocity has slowed over the past 7d (73% of target). Consider an upskilling or corrective campaign for the affected cohort.',
  },
];

function _sevStyles(s){
  if(s==='critical') return { dot:'#F44336', bg:'#FEECEB', ring:'#F9C4C0', label:'Critical', labelColor:'#B42318', score:'#F44336' };
  if(s==='warning')  return { dot:'#F59E0B', bg:'#FFF8E6', ring:'#F7E1A7', label:'Warning',  labelColor:'#6B4F11', score:'#F59E0B' };
  return { dot:'#22C55E', bg:'#E8F6EC', ring:'#BBE7C6', label:'Healthy', labelColor:'#15803D', score:'#22C55E' };
}

// Auto-generated campaign brief recipes (from §6.2.3 table).
const CAMPAIGN_RECIPES = {
  acquisition: {
    channel: 'Facebook + TikTok',
    budget:'$4,800',
    timing:'2-week sprint',
    contentHint:'Highlight flexible earnings · localised language · L2 skill tier entry test',
    kpi:'Target: 50 new L2 speakers · cost-per-activation ≤ $96',
  },
  reengagement: {
    channel:'SMS + in-app push',
    budget:'$1,200',
    timing:'Staggered over 10 days by time-zone',
    contentHint:'Welcome-back bonus · reminder of available tasks · localised (Tagalog)',
    kpi:'Target: 900 reactivations · 10% of dormant pool',
  },
  nudge: {
    channel:'Push notification (segment)',
    budget:'$0 marginal',
    timing:'Send 15min before Sat 18:00 SGT window',
    contentHint:'Peak-window alert · optimal from Temporal Footprint · personalised earning estimate',
    kpi:'Target: lift APAC weekend supply +40%',
  },
  upskill: {
    channel:'In-app tutorial push + email',
    budget:'$0 marginal',
    timing:'Rolling, triggered by cohort accuracy drop',
    contentHint:'Recommended tutorial pack · practice tasks · peer comparison · micro-credential',
    kpi:'Target: restore accuracy to ≥ 84% in 30 days',
  },
  monitor: { channel:'—', budget:'—', timing:'—', contentHint:'Within tolerance · keep monitoring', kpi:'Re-alert threshold: coverage < 90%' },
};

// Gap card (detailed version for the list)
function GapCard({ gap, expanded, onToggle, onLaunch }) {
  const s = _sevStyles(gap.severity);
  return (
    <div style={{
      background:'#fff', border:`1px solid ${expanded ? s.ring : '#E9ECF3'}`, borderRadius:12,
      overflow:'hidden', transition:'border-color .2s'
    }}>
      <div style={{display:'grid', gridTemplateColumns:'8px 1fr auto', cursor:'pointer'}} onClick={onToggle}>
        <div style={{background:s.dot}}/>
        <div style={{padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:6}}>
            <span style={{
              fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
              color:s.labelColor, background:s.bg, border:`1px solid ${s.ring}`, padding:'2px 8px',borderRadius:999
            }}>{s.label}</span>
            <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482',fontWeight:500}}>{gap.type} · {gap.dim} · {gap.geo}</span>
            <span style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:5,fontFamily:'Jost',fontSize:11.5,fontWeight:600,color:s.score,fontVariantNumeric:'tabular-nums'}}>
              score {gap.score}
            </span>
          </div>
          <div style={{fontFamily:'Jost',fontSize:16,fontWeight:500,color:'#111125',marginBottom:4}}>{gap.title}</div>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:220,maxWidth:380}}>
              <div style={{flex:1,height:6,background:'#F2F3F8',borderRadius:999,overflow:'hidden',position:'relative'}}>
                <div style={{width:`${gap.pct}%`,height:'100%',background:s.dot,borderRadius:999}}/>
              </div>
              <span style={{fontFamily:'Jost',fontSize:12,fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums',minWidth:80,textAlign:'right'}}>
                {gap.available}/{gap.required} · {gap.pct}%
              </span>
            </div>
          </div>
          <div style={{fontFamily:'DM Sans',fontSize:12,color:'#6F7482',marginTop:6}}>{gap.note}</div>
        </div>
        <div style={{padding:'14px 16px',display:'flex',alignItems:'center'}}>
          <Icon name={expanded?'chevron-down':'chevron-right'} size={16} color="#6F7482"/>
        </div>
      </div>

      {expanded && (
        <div style={{padding:'0 16px 16px 24px',borderTop:`1px solid ${s.ring}30`,background:`${s.bg}40`}}>
          <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:12}}>
            {/* Affected projects */}
            <div>
              <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>
                Affected projects
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {gap.projects.map(p=>(
                  <button key={p} onClick={(e)=>e.stopPropagation()} style={{
                    padding:'4px 12px',borderRadius:999,background:'#fff',border:'1px solid #E1E4EC',
                    fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C',cursor:'pointer',
                    transition:'background .15s,border-color .15s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#F4F8FF';e.currentTarget.style.borderColor='#4285F4';e.currentTarget.style.color='#1E4FA8';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor='#E1E4EC';e.currentTarget.style.color='#2C2C2C';}}
                  >{p}</button>
                ))}
              </div>
            </div>

            {/* Recommended action */}
            {gap.recAction && (
              <div style={{padding:'12px 14px',background:'#F4F8FF',border:'1px solid #DBE9FF',borderRadius:10,display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:28,height:28,borderRadius:7,background:'#4285F4',display:'grid',placeItems:'center',flexShrink:0,marginTop:1}}>
                  <Icon name="sparkle" size={13} color="#fff"/>
                </div>
                <div>
                  <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'#3160B7',marginBottom:4}}>Recommended action</div>
                  <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#2C2C2C',lineHeight:1.6}}>{gap.recAction}</div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

function _ScoreRow({ label, value, accent, bold }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 10px',background:'#fff',border:'1px solid #E9ECF3',borderRadius:6}}>
      <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>{label}</span>
      <span style={{fontFamily:'Jost',fontSize:12.5,fontWeight:bold?700:500,color:accent||'#111125',fontVariantNumeric:'tabular-nums'}}>{value}</span>
    </div>
  );
}

function CampaignBriefMini({ recipe }) {
  return (
    <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:8,padding:12}}>
      <div style={{display:'grid',gridTemplateColumns:'auto 1fr',columnGap:12,rowGap:6}}>
        {[
          {k:'Channel', v:recipe.channel},
          {k:'Budget',  v:recipe.budget},
          {k:'Timing',  v:recipe.timing},
          {k:'Content', v:recipe.contentHint},
          {k:'KPI',     v:recipe.kpi},
        ].map(row=>(
          <React.Fragment key={row.k}>
            <span style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase',color:'#6F7482',paddingTop:2}}>{row.k}</span>
            <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C',lineHeight:1.5}}>{row.v}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Summary strip
function GapsSummary({ gaps }) {
  const crit = gaps.filter(g=>g.severity==='critical').length;
  const warn = gaps.filter(g=>g.severity==='warning').length;
  const dimCounts = {};
  gaps.forEach(g=>{ dimCounts[g.dim]=(dimCounts[g.dim]||0)+1; });
  const topDim = Object.entries(dimCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];

  const pill = (label, n, color) => (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,flex:1}}>
      <span style={{width:10,height:10,borderRadius:99,background:color}}/>
      <div>
        <div style={{fontFamily:'Jost',fontSize:20,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums',lineHeight:1}}>{n}</div>
        <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:3}}>{label}</div>
      </div>
    </div>
  );

  return (
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
      {pill('Critical gaps', crit, '#F44336')}
      {pill('Warning gaps', warn, '#F59E0B')}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,flex:1}}>
        <div style={{width:28,height:28,borderRadius:6,background:'#EAF1FE',display:'grid',placeItems:'center'}}>
          <Icon name="target" size={14} color="#4285F4"/>
        </div>
        <div>
          <div style={{fontFamily:'Jost',fontSize:13.5,fontWeight:500,color:'#111125',lineHeight:1.2}}>{topDim}</div>
          <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:3}}>Top gap dimension</div>
        </div>
      </div>
    </div>
  );
}

// Main module
function GapAlertsModule() {
  const [expanded, setExpanded] = React.useState('gap-ph-dormant');
  const [sev, setSev] = React.useState('all');
  const [dim, setDim] = React.useState('all');

  const visible = [...ALL_GAPS.filter(g =>
    (sev==='all' || g.severity===sev) &&
    (dim==='all' || g.dim===dim)
  )].sort((a,b)=>b.score-a.score);

  const sevOpts = [
    {k:'all',label:'All severities'},
    {k:'critical',label:'Critical',color:'#F44336'},
    {k:'warning',label:'Warning',color:'#F59E0B'},
  ];
  const dimOpts = ['all','Language','Geography','Engagement','Quality'];

  return (
    <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>Alerts</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            Pool trend monitoring · alerts triggered on detected drops · linked to campaign briefs
          </div>
        </div>
      </div>

      <GapsSummary gaps={ALL_GAPS}/>

      {/* Filter bar */}
      <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',padding:'10px 14px',background:'#fff',border:'1px solid #E9ECF3',borderRadius:10}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontFamily:'DM Sans',fontSize:11,fontWeight:600,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.05em'}}>Severity</span>
          <div style={{display:'flex',gap:5}}>
            {sevOpts.map(o=>(
              <button key={o.k} onClick={()=>setSev(o.k)} style={{
                padding:'5px 10px',borderRadius:999,cursor:'pointer',
                border:`1px solid ${sev===o.k ? (o.color||'#4285F4') : '#E1E4EC'}`,
                background: sev===o.k ? (o.color?`${o.color}18`:'#EAF1FE') : '#fff',
                color: sev===o.k ? (o.color||'#1E4FA8') : '#2C2C2C',
                fontFamily:'DM Sans',fontSize:11.5,fontWeight: sev===o.k ? 600 : 500,
                display:'inline-flex',alignItems:'center',gap:5
              }}>
                {o.color && <span style={{width:6,height:6,borderRadius:99,background:o.color}}/>}
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{width:1,height:22,background:'#E9ECF3'}}/>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontFamily:'DM Sans',fontSize:11,fontWeight:600,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.05em'}}>Dimension</span>
          <select value={dim} onChange={e=>setDim(e.target.value)} style={{
            padding:'5px 10px',borderRadius:6,border:'1px solid #E1E4EC',background:'#fff',
            fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C',cursor:'pointer'
          }}>
            {dimOpts.map(d=><option key={d} value={d}>{d==='all'?'All dimensions':d}</option>)}
          </select>
        </div>
      </div>

      {/* Gap list */}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {visible.map(g=>(
          <GapCard key={g.id} gap={g}
            expanded={expanded===g.id}
            onToggle={()=>setExpanded(expanded===g.id?null:g.id)}
            onLaunch={()=>{}}
          />
        ))}
        {visible.length === 0 && (
          <div style={{padding:'48px 24px',textAlign:'center',background:'#fff',border:'1px dashed #D6D9E1',borderRadius:12,fontFamily:'DM Sans',color:'#6F7482'}}>
            No gaps match current filters.
          </div>
        )}
      </div>
    </div>
  );
}

window.GapAlertsModule = GapAlertsModule;
