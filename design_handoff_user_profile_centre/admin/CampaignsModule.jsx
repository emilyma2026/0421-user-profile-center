// §6.2.5 Campaign Management — recommended/active/completed + A/B test view + detail drawer.

const CAMPAIGNS_REC = [
  {
    id:'r1', type:'acquisition', priority:'high',
    title:'Spanish L2 acquisition · LATAM',
    reason:'Critical gap · Legal QA Brazil blocked',
    eta:'2-week sprint',
    budget:'$4,800',
    channel:'Facebook + TikTok',
    expected:'+ 50 L2 speakers',
    confidence:82,
    gap:'gap-es-latam',
  },
  {
    id:'r2', type:'reengagement', priority:'high',
    title:'Philippines dormant recall',
    reason:'9,200 registered · 0 active 30d',
    eta:'10-day rolling',
    budget:'$1,200',
    channel:'SMS + push',
    expected:'≈ 900 reactivations',
    confidence:68,
    gap:'gap-ph-dormant',
  },
  {
    id:'r3', type:'nudge', priority:'medium',
    title:'APAC weekend peak-window nudge',
    reason:'Under-supply Sat 18:00 SGT · Push Sensitive segment',
    eta:'Recurring',
    budget:'$0 marginal',
    channel:'Push notification',
    expected:'+ 40% weekend supply',
    confidence:74,
    gap:'gap-apac-weekend',
  },
  {
    id:'r4', type:'upskill', priority:'medium',
    title:'Medical NER v3 upskilling',
    reason:'Accuracy −4.1pp on 2025-12 cohort',
    eta:'30-day rolling',
    budget:'$0 marginal',
    channel:'In-app + email',
    expected:'Accuracy → 84%',
    confidence:61,
    gap:'gap-cohort-quality',
  },
];

const CAMPAIGNS_ACTIVE = [
  {
    id:'c-101', type:'acquisition', status:'active',
    title:'Tagalog Speech acquisition · PH',
    started:'14 days ago · ends in 10d',
    channel:'Facebook + TikTok · PH-targeted',
    budget:{ spent:2840, total:4800 },
    progress:{ acquired:312, target:500 },
    cpa:9.10, cpaTarget:9.60,
    accuracy:83.4,
    variants:[
      { name:'A · Earnings-first', acquired:182, cpa:8.70, ctr:3.1, best:true },
      { name:'B · Flexibility-first', acquired:130, cpa:9.80, ctr:2.4 },
    ],
    health:'on-track',
  },
  {
    id:'c-102', type:'reengagement', status:'active',
    title:'Indonesia dormant SMS recall',
    started:'6 days ago · ends in 4d',
    channel:'SMS · ID · batch 1/3',
    budget:{ spent:410, total:900 },
    progress:{ acquired:162, target:500 },
    cpa:2.53, cpaTarget:1.80,
    accuracy:78.2,
    variants:[
      { name:'A · Welcome-back bonus', acquired:98, cpa:2.20, ctr:6.4, best:true },
      { name:'B · Urgency framing',    acquired:64, cpa:3.10, ctr:4.1 },
    ],
    health:'warning',
  },
  {
    id:'c-103', type:'nudge', status:'active',
    title:'APAC peak-window push · weekly',
    started:'Running 5 wks · recurring',
    channel:'In-app push · segment: Push Sensitive',
    budget:{ spent:0, total:0 },
    progress:{ acquired:340, target:300, lift:'+42%' },
    cpa:0, cpaTarget:0,
    accuracy:89.1,
    variants:[
      { name:'A · Personalised earnings',  acquired:204, cpa:0, ctr:18.2, best:true },
      { name:'B · Generic "tasks waiting"',acquired:136, cpa:0, ctr:11.4 },
    ],
    health:'on-track',
  },
];

const CAMPAIGNS_HISTORY = [
  { id:'h-55', title:'MX Incentive · Jan 2025',     type:'acquisition', acquired:640, cpa:11.20, retention30:24, rating:'under-performed' },
  { id:'h-54', title:'SG L3 Upskill · Dec 2024',    type:'upskill',     acquired:180, cpa:0,     retention30:82, rating:'outperformed' },
  { id:'h-53', title:'VN Evening Nudge',            type:'nudge',       acquired:520, cpa:0,     retention30:71, rating:'on-target'      },
  { id:'h-52', title:'Egypt Recall · Nov 2024',     type:'reengagement',acquired: 90, cpa: 4.50, retention30:18, rating:'under-performed'},
  { id:'h-51', title:'PH Onboarding Optimised',     type:'acquisition', acquired:920, cpa: 7.80, retention30:48, rating:'outperformed'   },
];

// ──────── Small helpers ────────────────────────────────────────
function _typeStyles(t) {
  switch(t){
    case 'acquisition':  return {color:'#4285F4', bg:'#EAF1FE', border:'#DBE9FF', icon:'users',      label:'Acquisition'};
    case 'reengagement': return {color:'#F59E0B', bg:'#FFF8E6', border:'#F7E1A7', icon:'refresh',    label:'Re-engagement'};
    case 'nudge':        return {color:'#22C55E', bg:'#E8F6EC', border:'#BBE7C6', icon:'bell',       label:'Nudge'};
    case 'upskill':      return {color:'#8B5CF6', bg:'#F3EEFF', border:'#DCCBFF', icon:'graduation', label:'Upskill'};
    default:             return {color:'#6F7482', bg:'#F2F3F8', border:'#E1E4EC', icon:'target',     label:t};
  }
}
function _healthStyles(h){
  switch(h){
    case 'on-track': return {color:'#15803D', bg:'#E8F6EC', dot:'#22C55E', label:'On track'};
    case 'warning':  return {color:'#6B4F11', bg:'#FFF8E6', dot:'#F59E0B', label:'Needs attention'};
    default:         return {color:'#B42318', bg:'#FEECEB', dot:'#F44336', label:'Off-track'};
  }
}

// ──────── Recommended card ──────────────────────────────────────
function RecommendedCard({ c, onApprove }) {
  const t = _typeStyles(c.type);
  return (
    <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:12,padding:16,display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,borderRadius:7,background:t.bg,border:`1px solid ${t.border}`,display:'grid',placeItems:'center'}}>
          <Icon name={t.icon} size={15} color={t.color}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:t.color}}>{t.label}</div>
          <div style={{fontFamily:'Jost',fontSize:15,fontWeight:500,color:'#111125',marginTop:2,lineHeight:1.3}}>{c.title}</div>
        </div>
        {c.priority==='high' && (
          <span style={{padding:'3px 8px',borderRadius:999,background:'#FEECEB',border:'1px solid #F9C4C0',color:'#B42318',fontFamily:'DM Sans',fontSize:10.5,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>
            High priority
          </span>
        )}
      </div>

      <div style={{fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C',lineHeight:1.5,background:'#FAFBFD',border:'1px solid #F2F3F8',borderRadius:7,padding:'8px 10px'}}>
        <span style={{color:'#6F7482'}}>Why · </span>{c.reason}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {[
          {k:'Channel', v:c.channel},
          {k:'Budget',  v:c.budget},
          {k:'Timing',  v:c.eta},
          {k:'Expected',v:c.expected},
        ].map(x=>(
          <div key={x.k}>
            <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.04em',fontWeight:600}}>{x.k}</div>
            <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#111125',marginTop:2}}>{x.v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{flex:1,height:6,background:'#F2F3F8',borderRadius:999,overflow:'hidden',position:'relative'}}>
          <div style={{width:`${c.confidence}%`,height:'100%',background:'linear-gradient(90deg,#4285F4,#22C55E)',borderRadius:999}}/>
        </div>
        <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>Confidence <b style={{color:'#111125'}}>{c.confidence}%</b></div>
      </div>

      <div style={{display:'flex',gap:8}}>
        <button onClick={onApprove} style={{
          flex:1,padding:'8px 12px',border:0,background:'#4285F4',color:'#fff',borderRadius:7,
          fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,cursor:'pointer',
          display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6
        }}>
          <Icon name="sparkle" size={13} color="#fff"/> Approve &amp; launch
        </button>
        <button style={{padding:'8px 12px',border:'1px solid #E1E4EC',background:'#fff',color:'#2C2C2C',borderRadius:7,fontFamily:'DM Sans',fontSize:12.5,fontWeight:500,cursor:'pointer'}}>Edit</button>
        <button style={{padding:'8px 10px',border:'1px solid #E1E4EC',background:'#fff',color:'#6F7482',borderRadius:7,fontFamily:'DM Sans',fontSize:12.5,cursor:'pointer'}}>Dismiss</button>
      </div>
    </div>
  );
}

// ──────── Active campaign row ──────────────────────────────────
function ActiveCampaignRow({ c, selected, onSelect }) {
  const t = _typeStyles(c.type), h = _healthStyles(c.health);
  const budgetPct = c.budget.total ? Math.round(c.budget.spent/c.budget.total*100) : 0;
  const progPct = c.progress.target ? Math.round(c.progress.acquired/c.progress.target*100) : 100;
  return (
    <div onClick={onSelect} style={{
      cursor:'pointer',
      background:'#fff',
      border:`1px solid ${selected ? '#4285F4' : '#E9ECF3'}`,
      boxShadow: selected ? '0 0 0 3px #EAF1FE' : 'none',
      borderRadius:10,padding:14,transition:'all .15s'
    }}>
      <div style={{display:'grid',gridTemplateColumns:'auto 1.5fr 1fr 1fr 1fr auto',gap:14,alignItems:'center'}}>
        <div style={{width:32,height:32,borderRadius:7,background:t.bg,border:`1px solid ${t.border}`,display:'grid',placeItems:'center'}}>
          <Icon name={t.icon} size={14} color={t.color}/>
        </div>
        <div style={{minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 7px',borderRadius:99,background:h.bg,color:h.color,fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>
              <span style={{width:6,height:6,borderRadius:99,background:h.dot}}/>{h.label}
            </span>
            <span style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>{c.started}</span>
          </div>
          <div style={{fontFamily:'Jost',fontSize:14,fontWeight:500,color:'#111125'}}>{c.title}</div>
          <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:2}}>{c.channel}</div>
        </div>
        <_CampaignMetric
          label="Progress"
          value={`${c.progress.acquired.toLocaleString()} / ${c.progress.target.toLocaleString()}`}
          pct={progPct} color="#4285F4"
        />
        <_CampaignMetric
          label="Budget"
          value={c.budget.total ? `$${c.budget.spent.toLocaleString()} / $${c.budget.total.toLocaleString()}` : 'No cost'}
          pct={budgetPct} color="#8B5CF6" hideBar={!c.budget.total}
        />
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'#6F7482'}}>CPA</div>
          <div style={{fontFamily:'Jost',fontSize:14,fontWeight:500,color: c.cpa && c.cpa>c.cpaTarget ? '#F44336' : '#111125',fontVariantNumeric:'tabular-nums',marginTop:2}}>
            {c.cpa ? `$${c.cpa.toFixed(2)}` : '—'}
          </div>
          {c.cpa ? (
            <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:1}}>target ${c.cpaTarget.toFixed(2)}</div>
          ) : <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#22C55E',marginTop:1}}>within SLA</div>}
        </div>
        <Icon name={selected?'chevron-down':'chevron-right'} size={16} color="#6F7482"/>
      </div>
    </div>
  );
}
function _CampaignMetric({ label, value, pct, color, hideBar }) {
  return (
    <div>
      <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'#6F7482'}}>{label}</div>
      <div style={{fontFamily:'Jost',fontSize:13,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums',marginTop:2}}>{value}</div>
      {!hideBar && (
        <div style={{height:4,background:'#F2F3F8',borderRadius:99,overflow:'hidden',marginTop:4}}>
          <div style={{width:`${Math.min(100,pct)}%`,height:'100%',background:color,borderRadius:99}}/>
        </div>
      )}
    </div>
  );
}

// ──────── A/B test panel (inside the active-campaign drawer)
function ABTestPanel({ campaign }) {
  const variants = campaign.variants;
  const totalAcq = variants.reduce((s,v)=>s+v.acquired,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482'}}>
        A/B test · {variants.length} variants · n = {totalAcq.toLocaleString()}
      </div>
      {variants.map(v=>(
        <div key={v.name} style={{
          padding:12,background:'#fff',border:`1px solid ${v.best?'#BBE7C6':'#E9ECF3'}`,borderRadius:8,
          boxShadow: v.best ? '0 0 0 3px #E8F6EC' : 'none'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontFamily:'Jost',fontSize:13.5,fontWeight:500,color:'#111125'}}>{v.name}</span>
            {v.best && (
              <span style={{padding:'2px 7px',borderRadius:99,background:'#E8F6EC',color:'#15803D',fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>
                Winner
              </span>
            )}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {[
              {k:'Acquired', v:v.acquired.toLocaleString()},
              {k:'CPA',      v:v.cpa?`$${v.cpa.toFixed(2)}`:'—'},
              {k:'CTR',      v:`${v.ctr.toFixed(1)}%`},
            ].map(m=>(
              <div key={m.k}>
                <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482'}}>{m.k}</div>
                <div style={{fontFamily:'Jost',fontSize:14,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums',marginTop:1}}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:8, height:4,background:'#F2F3F8',borderRadius:99,overflow:'hidden'}}>
            <div style={{width:`${v.acquired/totalAcq*100}%`,height:'100%',background: v.best ? '#22C55E' : '#94A3B8',borderRadius:99}}/>
          </div>
        </div>
      ))}
      <div style={{padding:'10px 12px',background:'#EAF1FE',border:'1px solid #DBE9FF',borderRadius:8,fontFamily:'DM Sans',fontSize:11.5,color:'#1E4FA8',lineHeight:1.5}}>
        <b>Recommendation:</b> Promote winning variant to 100% traffic. Statistical significance reached at p &lt; 0.05.
      </div>
    </div>
  );
}

// ──────── Campaign detail drawer (inline expansion) ───────────
function CampaignDetail({ campaign }) {
  const t = _typeStyles(campaign.type);
  return (
    <div style={{padding:16,background:'#FAFBFD',border:'1px solid #E9ECF3',borderRadius:10,display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:20}}>
      <div>
        <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Performance</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <_Stat label="Acquired" value={campaign.progress.acquired.toLocaleString()} sub={`target ${campaign.progress.target.toLocaleString()}`}/>
          <_Stat label="Accuracy (post-onboard)" value={`${campaign.accuracy}%`} sub="baseline 80%"/>
          {campaign.cpa > 0 && <_Stat label="CPA" value={`$${campaign.cpa.toFixed(2)}`} sub={`target $${campaign.cpaTarget.toFixed(2)}`}/>}
          <_Stat label="Channel" value={campaign.channel} sub={campaign.started}/>
        </div>
        <div style={{marginTop:14,fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Over time</div>
        <MiniTrend/>
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button style={{padding:'7px 12px',border:'1px solid #E1E4EC',background:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12,cursor:'pointer'}}>Pause</button>
          <button style={{padding:'7px 12px',border:'1px solid #E1E4EC',background:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12,cursor:'pointer'}}>Edit targeting</button>
          <button style={{padding:'7px 12px',border:0,background:'#4285F4',color:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12,fontWeight:600,cursor:'pointer',marginLeft:'auto'}}>
            Promote winner
          </button>
        </div>
      </div>
      <ABTestPanel campaign={campaign}/>
    </div>
  );
}

function _Stat({ label, value, sub }) {
  return (
    <div style={{padding:10,background:'#fff',border:'1px solid #E9ECF3',borderRadius:8}}>
      <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{label}</div>
      <div style={{fontFamily:'Jost',fontSize:17,fontWeight:500,color:'#111125',marginTop:4,fontVariantNumeric:'tabular-nums'}}>{value}</div>
      {sub && <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:1}}>{sub}</div>}
    </div>
  );
}

function MiniTrend() {
  const pts = [12,28,34,41,48,56,62,71,80,88,96,104,112];
  const w=440,h=90,pad=8;
  const max=Math.max(...pts);
  const x=(i)=>pad+i/(pts.length-1)*(w-pad*2);
  const y=(v)=>pad+(1-v/max)*(h-pad*2);
  const d = pts.map((p,i)=>`${i===0?'M':'L'}${x(i)},${y(p)}`).join(' ');
  const a = `${d} L${x(pts.length-1)},${h-pad} L${x(0)},${h-pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:'block',background:'#fff',border:'1px solid #E9ECF3',borderRadius:8}}>
      <defs>
        <linearGradient id="campTrend" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4285F4" stopOpacity=".3"/>
          <stop offset="1" stopColor="#4285F4" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={a} fill="url(#campTrend)"/>
      <path d={d} stroke="#4285F4" strokeWidth="2" fill="none"/>
      <text x={pad} y={h-2} fontFamily="DM Sans" fontSize="9" fill="#6F7482">Day 1</text>
      <text x={w-pad} y={h-2} textAnchor="end" fontFamily="DM Sans" fontSize="9" fill="#6F7482">Today</text>
    </svg>
  );
}

// ──────── History table ────────────────────────────────────────
function HistoryTable() {
  return (
    <div style={{background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,overflow:'hidden'}}>
      <div style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px',padding:'10px 14px',background:'#FAFBFD',borderBottom:'1px solid #E9ECF3',fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482'}}>
        <span>Campaign</span><span>Type</span><span style={{textAlign:'right'}}>Acquired</span><span style={{textAlign:'right'}}>CPA</span><span style={{textAlign:'right'}}>D30 Retention</span><span style={{textAlign:'right'}}>Result</span>
      </div>
      {CAMPAIGNS_HISTORY.map(c=>{
        const t=_typeStyles(c.type);
        const resColor = c.rating==='outperformed' ? '#22C55E' : c.rating==='on-target' ? '#4285F4' : '#F44336';
        const resLabel = c.rating==='outperformed' ? 'Outperformed' : c.rating==='on-target' ? 'On target' : 'Under';
        return (
          <div key={c.id} style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px',padding:'10px 14px',borderBottom:'1px solid #F2F3F8',alignItems:'center'}}>
            <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#111125'}}>{c.title}</div>
            <div>
              <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 7px',borderRadius:99,background:t.bg,color:t.color,fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>
                <Icon name={t.icon} size={10} color={t.color}/>{t.label}
              </span>
            </div>
            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:12.5,fontVariantNumeric:'tabular-nums'}}>{c.acquired.toLocaleString()}</div>
            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:12.5,fontVariantNumeric:'tabular-nums'}}>{c.cpa?`$${c.cpa.toFixed(2)}`:'—'}</div>
            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:12.5,fontVariantNumeric:'tabular-nums'}}>{c.retention30}%</div>
            <div style={{textAlign:'right'}}>
              <span style={{padding:'3px 8px',borderRadius:99,background:`${resColor}18`,color:resColor,fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>
                {resLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────── Tab shell ────────────────────────────────────────────
function CampaignModule() {
  const [tab, setTab] = React.useState('recommended');
  const [selected, setSelected] = React.useState('c-101');
  const [toast, setToast] = React.useState(null);
  const approve = (c) => { setToast(`Campaign "${c.title}" queued for launch`); setTimeout(()=>setToast(null),2200); };

  const tabs = [
    { k:'recommended', label:'Recommended', count: CAMPAIGNS_REC.length,    icon:'sparkle' },
    { k:'active',      label:'Active',      count: CAMPAIGNS_ACTIVE.length, icon:'activity' },
    { k:'history',     label:'History',     count: CAMPAIGNS_HISTORY.length,icon:'archive' },
  ];

  return (
    <div style={{padding:24,display:'flex',flexDirection:'column',gap:16,position:'relative'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>Campaigns</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            Recommended actions · active campaigns · performance history (§6.2.5)
          </div>
        </div>
        <button style={{padding:'7px 12px',border:0,background:'#4285F4',color:'#fff',borderRadius:7,fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
          <Icon name="plus" size={13} color="#fff"/> New campaign
        </button>
      </div>

      {/* Sub tabs */}
      <div style={{display:'flex',gap:4,padding:4,background:'#fff',border:'1px solid #E9ECF3',borderRadius:10,alignSelf:'flex-start'}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:'7px 14px',borderRadius:7,border:0,cursor:'pointer',
            background: tab===t.k ? '#EAF1FE' : 'transparent',
            color: tab===t.k ? '#1E4FA8' : '#2C2C2C',
            fontFamily:'DM Sans',fontSize:12.5,fontWeight: tab===t.k ? 600 : 500,
            display:'inline-flex',alignItems:'center',gap:7
          }}>
            <Icon name={t.icon} size={13} color={tab===t.k?'#1E4FA8':'#6F7482'}/>
            {t.label}
            <span style={{
              minWidth:18,padding:'1px 6px',borderRadius:99,textAlign:'center',
              background: tab===t.k ? '#fff' : '#F2F3F8',
              color: tab===t.k ? '#1E4FA8' : '#6F7482',
              fontFamily:'DM Sans',fontSize:10.5,fontWeight:700
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab==='recommended' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {CAMPAIGNS_REC.map(c=><RecommendedCard key={c.id} c={c} onApprove={()=>approve(c)}/>)}
        </div>
      )}

      {tab==='active' && (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {CAMPAIGNS_ACTIVE.map(c=>(
            <React.Fragment key={c.id}>
              <ActiveCampaignRow c={c} selected={selected===c.id} onSelect={()=>setSelected(selected===c.id?null:c.id)}/>
              {selected===c.id && <CampaignDetail campaign={c}/>}
            </React.Fragment>
          ))}
        </div>
      )}

      {tab==='history' && <HistoryTable/>}

      {toast && (
        <div style={{
          position:'fixed',bottom:24,right:24,padding:'12px 16px',background:'#111125',color:'#fff',borderRadius:8,
          fontFamily:'DM Sans',fontSize:13,boxShadow:'0 12px 32px rgba(0,0,0,0.2)',display:'inline-flex',alignItems:'center',gap:8,zIndex:100
        }}>
          <Icon name="check" size={14} color="#22C55E"/> {toast}
        </div>
      )}
    </div>
  );
}

window.CampaignModule = CampaignModule;
window.CampaignsModule = CampaignModule;
