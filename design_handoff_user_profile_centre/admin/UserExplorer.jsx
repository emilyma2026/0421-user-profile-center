// §6.2.2 User Explorer — segment builder + user list + AI recommendations.
// Left: 4 filters (country/language dropdown, accuracy bar, headcount) + submit.
// Center: results table (AND logic, updates on Apply Filter).
// Right: AI-generated action recommendations.

// ─── Mock dataset ────────────────────────────────────────────────
const ARCHETYPES = [
  { key:'evergreen',   label:'Evergreen',          color:'#22C55E' },
  { key:'push',        label:'Push Sensitive',     color:'#4285F4' },
  { key:'incentive',   label:'Incentive Sensitive',color:'#F59E0B' },
  { key:'potential',   label:'High Potential',     color:'#8B5CF6' },
  { key:'unresponsive',label:'Non-Responsive',     color:'#94A3B8' },
];
const ARCH_BY = Object.fromEntries(ARCHETYPES.map(a=>[a.key,a]));

const USERS = [
  { id:'U-84219', country:'Philippines', flag:'\uD83C\uDDF5\uD83C\uDDED', lang:'English, Tagalog',  stage:'Engaged',   archetype:'evergreen',    reg:'2024-03-12', acc:92, churn:8,  trajectory:'up',   lastActive:'2h ago',  volTier:'L3', accTier:'L3' },
  { id:'U-84186', country:'Vietnam',     flag:'\uD83C\uDDFB\uD83C\uDDF3', lang:'Vietnamese',        stage:'Engaged',   archetype:'push',         reg:'2024-06-02', acc:88, churn:12, trajectory:'up',   lastActive:'5h ago',  volTier:'L2', accTier:'L3' },
  { id:'U-84991', country:'Indonesia',   flag:'\uD83C\uDDEE\uD83C\uDDE9', lang:'Bahasa Indonesia',  stage:'Activated', archetype:'incentive',    reg:'2024-09-20', acc:81, churn:38, trajectory:'flat', lastActive:'3d ago',  volTier:'L1', accTier:'L2' },
  { id:'U-85440', country:'Thailand',    flag:'\uD83C\uDDF9\uD83C\uDDED', lang:'Thai',              stage:'Engaged',   archetype:'potential',    reg:'2025-01-14', acc:84, churn:18, trajectory:'up',   lastActive:'4h ago',  volTier:'L2', accTier:'L2' },
  { id:'U-83011', country:'Egypt',       flag:'\uD83C\uDDEA\uD83C\uDDEC', lang:'Arabic',            stage:'Registered',archetype:'unresponsive', reg:'2024-11-01', acc:72, churn:74, trajectory:'down', lastActive:'21d ago', volTier:'L1', accTier:'L1' },
  { id:'U-85602', country:'Mexico',      flag:'\uD83C\uDDF2\uD83C\uDDFD', lang:'Spanish',           stage:'Churned',   archetype:'incentive',    reg:'2024-07-22', acc:76, churn:88, trajectory:'down', lastActive:'45d ago', volTier:'L1', accTier:'L1' },
  { id:'U-84450', country:'Malaysia',    flag:'\uD83C\uDDF2\uD83C\uDDFE', lang:'Malay, English',    stage:'Onboarded', archetype:'potential',    reg:'2025-02-08', acc:80, churn:29, trajectory:'flat', lastActive:'6d ago',  volTier:'L1', accTier:'L2' },
  { id:'U-84881', country:'Singapore',   flag:'\uD83C\uDDF8\uD83C\uDDEC', lang:'English',           stage:'Engaged',   archetype:'evergreen',    reg:'2024-02-14', acc:95, churn:5,  trajectory:'up',   lastActive:'1h ago',  volTier:'L3', accTier:'L3' },
  { id:'U-85100', country:'Philippines', flag:'\uD83C\uDDF5\uD83C\uDDED', lang:'Tagalog',           stage:'Activated', archetype:'push',         reg:'2024-10-01', acc:83, churn:22, trajectory:'flat', lastActive:'2d ago',  volTier:'L2', accTier:'L2' },
  { id:'U-85230', country:'Indonesia',   flag:'\uD83C\uDDEE\uD83C\uDDE9', lang:'Bahasa Indonesia',  stage:'Registered',archetype:'unresponsive', reg:'2025-01-03', acc:68, churn:81, trajectory:'down', lastActive:'30d ago', volTier:'L1', accTier:'L1' },
  { id:'U-83890', country:'Vietnam',     flag:'\uD83C\uDDFB\uD83C\uDDF3', lang:'Vietnamese',        stage:'Activated', archetype:'incentive',    reg:'2024-05-14', acc:86, churn:21, trajectory:'up',   lastActive:'8h ago',  volTier:'L2', accTier:'L2' },
  { id:'U-84760', country:'Egypt',       flag:'\uD83C\uDDEA\uD83C\uDDEC', lang:'Arabic',            stage:'Onboarded', archetype:'potential',    reg:'2025-03-01', acc:77, churn:44, trajectory:'flat', lastActive:'9d ago',  volTier:'L1', accTier:'L1' },
];

// Language pool capacity (total available in full dataset, for gap analysis)
const LANG_POOL = {
  English:820, Spanish:62, Arabic:180, Vietnamese:420, Thai:280,
  'Bahasa Indonesia':550, Malay:220, Tagalog:380,
};

// ─── Multi-select dropdown ──────────────────────────────────────
function MultiSelect({ label, options, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = opt => onChange(value.includes(opt) ? value.filter(v=>v!==opt) : [...value, opt]);
  const display = value.length === 0 ? 'All'
    : value.length <= 2 ? value.join(', ')
    : value.slice(0,2).join(', ') + ' +' + (value.length-2);
  return (
    <div ref={ref} style={{position:'relative'}}>
      <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{label}</div>
      <button onClick={()=>setOpen(!open)} style={{
        width:'100%', padding:'7px 10px', border:'1px solid #E1E4EC', borderRadius:7, background:'#fff',
        display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer',
        fontFamily:'DM Sans', fontSize:12, color: value.length ? '#111125' : '#9AA2B1', boxSizing:'border-box',
      }}>
        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'85%',textAlign:'left'}}>{display}</span>
        <Icon name={open?'chevron-down':'chevron-right'} size={11} color="#6F7482"/>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 3px)', left:0, right:0, zIndex:200,
          background:'#fff', border:'1px solid #E1E4EC', borderRadius:8,
          boxShadow:'0 6px 20px rgba(0,0,0,.1)', maxHeight:200, overflowY:'auto',
        }}>
          {options.map(opt=>(
            <label key={opt} style={{
              display:'flex', alignItems:'center', gap:8, padding:'7px 12px', cursor:'pointer',
              background: value.includes(opt) ? '#F4F8FF' : 'transparent',
              borderBottom:'1px solid #F9F9FB',
            }}
              onMouseEnter={e=>{ if(!value.includes(opt)) e.currentTarget.style.background='#FAFBFC'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background = value.includes(opt) ? '#F4F8FF' : 'transparent'; }}
            >
              <input type="checkbox" checked={value.includes(opt)} onChange={()=>toggle(opt)}
                style={{accentColor:'#4285F4',width:13,height:13,flexShrink:0,cursor:'pointer'}}/>
              <span style={{fontFamily:'DM Sans',fontSize:12,color:'#111125'}}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Accuracy progress bar ──────────────────────────────────────
function AccuracyBar({ value, onChange }) {
  const color = value >= 85 ? '#22C55E' : value >= 70 ? '#F59E0B' : '#F44336';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Min accuracy</span>
        <span style={{fontFamily:'Jost',fontSize:13,fontWeight:700,color:color,fontVariantNumeric:'tabular-nums'}}>{value}%</span>
      </div>
      <div style={{position:'relative',height:8,background:'#F2F3F8',borderRadius:999}}>
        <div style={{width:value+'%',height:'100%',background:color,borderRadius:999,transition:'width .15s'}}/>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={e=>onChange(+e.target.value)}
        style={{width:'100%',accentColor:color}}/>
    </div>
  );
}

// ─── Segment Builder ───────────────────────────────────────────
function SegmentBuilder({ draft, setDraft, onSubmit, resultCount }) {
  const reset = () => setDraft({ country:[], lang:[], minAcc:0, headcount:'' });
  return (
    <aside style={{
      width:240, flexShrink:0, background:'#fff', border:'1px solid #E9ECF3',
      borderRadius:12, display:'flex', flexDirection:'column', overflow:'visible',
      alignSelf:'flex-start',
    }}>
      <div style={{padding:'14px 14px 10px', borderBottom:'1px solid #F2F3F8', display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:14,fontWeight:700,color:'#111125'}}>Segment filters</div>
          <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:2}}>{resultCount.toLocaleString()} users matched</div>
        </div>
        <button onClick={reset} style={{background:'transparent',border:0,cursor:'pointer',fontFamily:'DM Sans',fontSize:11,color:'#4285F4',fontWeight:500}}>Reset</button>
      </div>

      <div style={{padding:'14px', display:'flex', flexDirection:'column', gap:14, overflow:'visible'}}>
        <MultiSelect label="Country"
          options={['Philippines','Indonesia','Vietnam','Thailand','Egypt','Mexico','Malaysia','Singapore']}
          value={draft.country||[]} onChange={v=>setDraft({...draft,country:v})}/>
        <MultiSelect label="Language"
          options={['English','Spanish','Arabic','Vietnamese','Thai','Bahasa Indonesia','Malay','Tagalog']}
          value={draft.lang||[]} onChange={v=>setDraft({...draft,lang:v})}/>
        <AccuracyBar value={draft.minAcc||0} onChange={v=>setDraft({...draft,minAcc:v})}/>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Headcount requirement</div>
          <div style={{position:'relative'}}>
            <input type="number" min={1} placeholder="e.g. 50"
              value={draft.headcount||''}
              onChange={e=>setDraft({...draft,headcount:e.target.value})}
              style={{
                width:'100%', padding:'7px 32px 7px 10px', border:'1px solid #E1E4EC', borderRadius:7,
                fontFamily:'Jost', fontSize:13, color:'#111125', background:'#fff',
                outline:'none', boxSizing:'border-box',
              }}/>
            <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontFamily:'DM Sans',fontSize:10.5,color:'#9AA2B1',pointerEvents:'none'}}>users</span>
          </div>
        </div>
      </div>

      <div style={{padding:'12px 14px', borderTop:'1px solid #F2F3F8'}}>
        <button onClick={onSubmit} style={{
          width:'100%', padding:'9px', background:'#4285F4', color:'#fff', border:0, borderRadius:7,
          fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,cursor:'pointer',
          display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,
        }}>
          <Icon name="filter" size={13} color="#fff"/> Apply Filter
        </button>
      </div>
    </aside>
  );
}

// ─── User Table ────────────────────────────────────────────────
function TierPill({ tier }) {
  const filled = tier==='L3'?'#4285F4':tier==='L2'?'#7CA9FC':tier==='L1'?'#9DC6FF':'#E1E6F0';
  const fg = (tier==='L3'||tier==='L2')?'#fff':'#2C2C2C';
  return <span style={{display:'inline-block',padding:'2px 7px',borderRadius:4,fontFamily:'Jost',fontSize:11,fontWeight:600,background:filled,color:fg,minWidth:28,textAlign:'center'}}>{tier}</span>;
}
function ArchetypeBadge({ kind }) {
  const a = ARCH_BY[kind]; if(!a) return null;
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 7px',borderRadius:999,background:a.color+'15',border:'1px solid '+a.color+'40',color:a.color,fontFamily:'DM Sans',fontSize:10.5,fontWeight:600,whiteSpace:'nowrap'}}>
    <span style={{width:5,height:5,borderRadius:99,background:a.color}}/>{a.label}</span>;
}
function TrajectoryArrow({ t }) {
  if(t==='up') return <Icon name="trending-up" size={13} color="#22C55E"/>;
  if(t==='down') return <Icon name="trending-down" size={13} color="#F44336"/>;
  return <span style={{width:13,height:1,background:'#CBD5E1',display:'inline-block'}}/>;
}
function UserRow({ user, onOpen, selected, onToggleSelect }) {
  return (
    <tr style={{borderTop:'1px solid #F2F3F8',background:selected?'#F8FBFF':'#fff'}}>
      <td style={{padding:'9px 12px'}}><input type="checkbox" checked={selected} onChange={onToggleSelect} style={{accentColor:'#4285F4'}}/></td>
      <td style={{padding:'9px 4px',fontFamily:'Jost',fontSize:12.5,color:'#111125',fontWeight:500}}>
        <button onClick={onOpen} style={{background:'transparent',border:0,padding:0,color:'#4285F4',fontFamily:'inherit',fontSize:'inherit',fontWeight:'inherit',cursor:'pointer',textDecoration:'underline',textUnderlineOffset:2}}>{user.id}</button>
      </td>
      <td style={{padding:'9px 4px',fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:5}}><span style={{fontSize:13}}>{user.flag}</span>{user.country}</span>
      </td>
      <td style={{padding:'9px 4px',fontFamily:'DM Sans',fontSize:12,color:'#6F7482'}}>{user.lang}</td>
      <td style={{padding:'9px 4px'}}>
        <span style={{display:'inline-block',padding:'2px 8px',borderRadius:999,
          background:user.stage==='Churned'?'#FEECEB':user.stage==='Engaged'?'#E8F6EC':user.stage==='Activated'?'#EAF1FE':'#FFF8E6',
          color:user.stage==='Churned'?'#B42318':user.stage==='Engaged'?'#15803D':user.stage==='Activated'?'#1E4FA8':'#6B4F11',
          fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>{user.stage}</span>
      </td>
      <td style={{padding:'9px 4px'}}><ArchetypeBadge kind={user.archetype}/></td>
      <td style={{padding:'9px 4px',textAlign:'right',fontFamily:'Jost',fontSize:12.5,fontWeight:600,color:user.acc>=85?'#22C55E':user.acc>=75?'#F59E0B':'#F44336',fontVariantNumeric:'tabular-nums'}}>{user.acc}%</td>
      <td style={{padding:'9px 4px',fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482'}}>{user.lastActive}</td>
      <td style={{padding:'9px 12px',textAlign:'right'}}>
        <button onClick={onOpen} style={{padding:'4px 8px',background:'#fff',border:'1px solid #E1E4EC',borderRadius:5,fontFamily:'DM Sans',fontSize:11,cursor:'pointer',color:'#2C2C2C',display:'inline-flex',alignItems:'center',gap:3}}>
          View <Icon name="arrow-right" size={10} color="#6F7482"/>
        </button>
      </td>
    </tr>
  );
}
function UserTable({ users, onOpen, selected, setSelected }) {
  const allSelected = users.length>0 && users.every(u=>selected.has(u.id));
  return (
    <div style={{overflow:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontFamily:'DM Sans',minWidth:700}}>
        <thead>
          <tr style={{background:'#FAFBFD'}}>
            <th style={{padding:'9px 12px',width:30}}><input type="checkbox" checked={allSelected} onChange={()=>allSelected?setSelected(new Set()):setSelected(new Set(users.map(u=>u.id)))} style={{accentColor:'#4285F4'}}/></th>
            {['User','Country','Language','Stage','Archetype','Accuracy','Last active',''].map((h,i)=>(
              <th key={i} style={{padding:'9px 4px',textAlign:i===6?'right':'left',fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.05em'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length===0
            ? <tr><td colSpan={9} style={{padding:'40px 24px',textAlign:'center',fontFamily:'DM Sans',fontSize:13,color:'#9AA2B1'}}>No users match current filters.</td></tr>
            : users.map(u=><UserRow key={u.id} user={u} onOpen={()=>onOpen(u)} selected={selected.has(u.id)} onToggleSelect={()=>{const n=new Set(selected);n.has(u.id)?n.delete(u.id):n.add(u.id);setSelected(n);}}/>)
          }
        </tbody>
      </table>
    </div>
  );
}

// ─── AI Recommendation cards ──────────────────────────────────

// RecoCard — used for existing-user campaigns (re-engagement, quality, etc.)
function RecoCard({ icon, title, detail, action, actionColor, tag }) {
  return (
    <div style={{border:'1px solid #E9ECF3',borderRadius:10,overflow:'hidden',background:'#fff'}}>
      <div style={{padding:'10px 12px',display:'flex',alignItems:'flex-start',gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:actionColor+'18',display:'grid',placeItems:'center',flexShrink:0}}>
          <Icon name={icon} size={14} color={actionColor}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
            <span style={{fontFamily:'DM Sans',fontSize:11.5,fontWeight:700,color:'#111125'}}>{title}</span>
            {tag && <span style={{padding:'1px 6px',borderRadius:999,background:actionColor+'18',color:actionColor,fontFamily:'DM Sans',fontSize:9.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>{tag}</span>}
          </div>
          <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',lineHeight:1.5}}>{detail}</div>
        </div>
      </div>
      <div style={{padding:'8px 12px',borderTop:'1px solid #F2F3F8',background:'#FAFBFD'}}>
        <button style={{
          display:'inline-flex',alignItems:'center',gap:5,padding:'5px 10px',
          background:actionColor,color:'#fff',border:0,borderRadius:5,
          fontFamily:'DM Sans',fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',
        }}>
          <Icon name="sparkle" size={10} color="#fff"/> {action}
        </button>
      </div>
    </div>
  );
}

// ActionNeededCard — used for external recruitment gaps (no channels, no budget)
function ActionNeededCard({ lang, region, gapCount, currentCount, targetCount, note }) {
  const rows = [
    { label:'Language', value: lang },
    region ? { label:'Region', value: region } : null,
    { label:'Current pool', value: currentCount + ' labellers' },
    targetCount > 0 ? { label:'Target', value: targetCount + ' labellers' } : null,
    { label:'Gap', value: gapCount > 0 ? '+' + gapCount + ' needed' : 'Below threshold' },
  ].filter(Boolean);

  return (
    <div style={{border:'1.5px solid #EDE9FE',borderRadius:10,overflow:'hidden',background:'#fff'}}>
      <div style={{
        padding:'7px 12px',background:'#F5F3FF',borderBottom:'1px solid #EDE9FE',
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <Icon name="alert-circle" size={11} color="#7C3AED"/>
          <span style={{fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#7C3AED'}}>
            Action Needed
          </span>
        </div>
        <span style={{padding:'1px 7px',borderRadius:999,background:'#EDE9FE',color:'#6D28D9',fontFamily:'DM Sans',fontSize:9.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>
          Recruitment
        </span>
      </div>
      <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{fontFamily:'Jost',fontSize:13.5,fontWeight:600,color:'#111125',marginBottom:2}}>
          Recruit {gapCount > 0 ? gapCount : 'more'} {lang} labellers
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {rows.map(function(row, i) {
            const isGap = row.label === 'Gap';
            return (
              <div key={i} style={{display:'grid',gridTemplateColumns:'88px 1fr',gap:6,alignItems:'baseline'}}>
                <span style={{fontFamily:'DM Sans',fontSize:10.5,color:'#9AA2B1',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>
                  {row.label}
                </span>
                <span style={{fontFamily:'DM Sans',fontSize:11.5,fontWeight: isGap ? 700 : 500,color: isGap ? '#7C3AED' : '#111125'}}>
                  {row.value}
                </span>
              </div>
            );
          })}
        </div>
        {note && (
          <div style={{marginTop:4,padding:'5px 8px',background:'#F5F3FF',borderRadius:6,fontFamily:'DM Sans',fontSize:10.5,color:'#6D28D9',lineHeight:1.5}}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

function AIRecommendations({ filters, users, headcount }) {
  if(!filters || Object.keys(filters).every(k=>!filters[k]||(Array.isArray(filters[k])&&!filters[k].length))) {
    return (
      <aside style={{width:280,flexShrink:0,background:'#fff',border:'1px solid #E9ECF3',borderRadius:12,padding:'20px 16px',alignSelf:'flex-start'}}>
        <div style={{fontFamily:'DM Sans',fontSize:14,fontWeight:700,color:'#111125',marginBottom:4}}>AI Recommendations</div>
        <div style={{fontFamily:'DM Sans',fontSize:12,color:'#9AA2B1',lineHeight:1.6}}>Apply a filter to see recommended actions based on your segment.</div>
        <div style={{marginTop:16,padding:'12px',background:'#F7F8FB',borderRadius:8,display:'flex',alignItems:'center',gap:8}}>
          <Icon name="sparkle" size={14} color="#4285F4"/>
          <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482'}}>I will analyse your segment and suggest campaigns, quality actions, or recruitment targets.</span>
        </div>
      </aside>
    );
  }

  const existingRecos = [];
  const externalRecos = [];
  const hc = parseInt(headcount) || 0;

  // ── Existing users analysis ──────────────────────────────────
  const inactive = users.filter(u => u.stage === 'Registered' || u.stage === 'Onboarded' || u.stage === 'Churned');
  const inactiveRate = users.length > 0 ? inactive.length / users.length : 0;
  const avgAcc = users.length > 0 ? users.reduce((s,u)=>s+u.acc,0)/users.length : 0;
  const countries = (filters.country||[]).join(', ') || '';

  if(inactive.length > 0 && inactiveRate >= 0.2) {
    existingRecos.push({
      icon:'users', tag:'Re-engagement',
      actionColor:'#4285F4',
      title: inactive.length + ' inactive users' + (countries ? ' in ' + countries : ''),
      detail: Math.round(inactiveRate*100) + '% of matched users are Registered/Onboarded/Churned. A targeted re-engagement campaign (SMS + in-app push) could reactivate this pool.',
      action:'Launch campaign',
    });
  }

  if(avgAcc > 0 && avgAcc < 80) {
    existingRecos.push({
      icon:'target', tag:'Penalty',
      actionColor:'#F44336',
      title:'Low accuracy: avg ' + avgAcc.toFixed(1) + '%',
      detail:'Segment average is below the 80% threshold. Apply performance penalty rules to flag underperformers and trigger corrective flows.',
      action:'Apply penalty rules',
    });
  } else if(avgAcc >= 80 && avgAcc < 85) {
    existingRecos.push({
      icon:'star', tag:'Treasure Hunt',
      actionColor:'#F59E0B',
      title:'Accuracy borderline: avg ' + avgAcc.toFixed(1) + '%',
      detail:'Users are near the quality threshold. Launch a Treasure Hunting programme — gamified quality tasks with bonus rewards — to push accuracy above 85%.',
      action:'Launch Treasure Hunt',
    });
  }

  if(users.length > 0 && inactiveRate < 0.5 && avgAcc >= 85) {
    existingRecos.push({
      icon:'trending-up', tag:'Evergreen',
      actionColor:'#22C55E',
      title:'High-quality active segment',
      detail:'This segment has strong accuracy (' + avgAcc.toFixed(1) + '%) and low dormancy. Consider enrolling these users in advanced task queues or skill-upgrade tracks.',
      action:'Enrol in advanced queue',
    });
  }

  // ── External / Recruitment gaps ──────────────────────────────
  // Language-based gap: show Action Needed card per language
  if(filters.lang && filters.lang.length > 0) {
    filters.lang.forEach(function(lang) {
      const pool = LANG_POOL[lang] || 0;
      const gap = hc > 0 ? Math.max(0, hc - pool) : (pool < 100 ? Math.round(100 - pool * 0.6) : 0);
      if(gap > 0 || pool < 150) {
        externalRecos.push({
          type:'action-needed',
          lang: lang,
          region: countries || null,
          gapCount: gap > 0 ? gap : Math.max(0, 150 - pool),
          currentCount: pool,
          targetCount: hc > 0 ? hc : 150,
          note: pool < 100 ? lang + ' pool is below minimum viable size for task allocation.' : null,
        });
      }
    });
  }

  // Headcount gap across entire segment
  if(hc > 0 && users.length < hc) {
    const gap = hc - users.length;
    const langLabel = (filters.lang && filters.lang.length > 0) ? filters.lang.join(', ') : 'any language';
    externalRecos.push({
      type:'action-needed',
      lang: langLabel,
      region: countries || null,
      gapCount: gap,
      currentCount: users.length,
      targetCount: hc,
      note: 'Segment matches only ' + users.length + ' of ' + hc + ' required. Broaden country or language scope to fill this gap.',
    });
  }

  const totalActions = existingRecos.length + externalRecos.length;

  return (
    <aside style={{width:280,flexShrink:0,background:'#F7F8FB',border:'1px solid #E9ECF3',borderRadius:12,overflow:'hidden',alignSelf:'flex-start',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 14px',borderBottom:'1px solid #E9ECF3',background:'#fff',display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:24,height:24,borderRadius:6,background:'#EAF1FE',display:'grid',placeItems:'center'}}>
          <Icon name="sparkle" size={12} color="#4285F4"/>
        </div>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:700,color:'#111125'}}>AI Recommendations</div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482'}}>{totalActions} action{totalActions!==1?'s':''} suggested</div>
        </div>
      </div>

      <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:8,overflow:'auto'}}>
        {existingRecos.length > 0 && (
          <>
            <div style={{fontFamily:'DM Sans',fontSize:9.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#9AA2B1',padding:'2px 2px'}}>
              Existing users ({users.length} matched)
            </div>
            {existingRecos.map(function(r,i){ return React.createElement(RecoCard, Object.assign({key:'e'+i}, r)); })}
          </>
        )}
        {externalRecos.length > 0 && (
          <>
            <div style={{fontFamily:'DM Sans',fontSize:9.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#9AA2B1',padding:'2px 2px',marginTop:existingRecos.length>0?4:0}}>
              Recruitment gaps
            </div>
            {externalRecos.map(function(r,i){ return React.createElement(ActionNeededCard, Object.assign({key:'x'+i}, r)); })}
          </>
        )}
        {totalActions === 0 && (
          <div style={{padding:'16px',textAlign:'center',fontFamily:'DM Sans',fontSize:12,color:'#9AA2B1'}}>
            No specific actions recommended for this segment.
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Main Explorer Page ────────────────────────────────────────
function UserExplorer() {
  // draft = what user is editing; committed = what was submitted (applied to filter)
  const [draft, setDraft] = React.useState({ country:[], lang:[], minAcc:0, headcount:'' });
  const [committed, setCommitted] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());
  const [selectedUser, setSelectedUser] = React.useState(null);

  const applyFilter = () => {
    setCommitted({...draft});
    setSelected(new Set());
  };

  const filtered = React.useMemo(() => {
    if(!committed) return USERS;
    return USERS.filter(u => {
      if(committed.country?.length && !committed.country.includes(u.country)) return false;
      if(committed.lang?.length && !committed.lang.some(l=>u.lang.includes(l))) return false;
      if(committed.minAcc > 0 && u.acc < committed.minAcc) return false;
      return true;
    });
  }, [committed]);

  const approxCount = Math.round(filtered.length / USERS.length * 30600);

  return (
    <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>User Explorer</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            Segment builder · {committed ? filtered.length + ' users match applied filters' : 'Set filters and click Apply to segment'}
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 10px 6px 11px',background:'#fff',border:'1px solid #E1E4EC',borderRadius:7,width:220}}>
            <Icon name="search" size={13} color="#6F7482"/>
            <input placeholder="Search by ID, email..." style={{border:0,outline:'none',flex:1,fontFamily:'DM Sans',fontSize:12.5,background:'transparent'}}/>
          </div>
        </div>
      </div>

      {committed && (
        <div style={{padding:'9px 14px',background:'#F4F8FF',border:'1px solid #DBE9FF',borderRadius:8,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <Icon name="filter" size={13} color="#4285F4"/>
          <span style={{fontFamily:'DM Sans',fontSize:12,color:'#1E4FA8',fontWeight:600}}>Active filters:</span>
          {committed.country?.length>0 && <span style={{padding:'3px 9px',background:'#fff',border:'1px solid #DBE9FF',borderRadius:999,fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8'}}>Country: {committed.country.join(', ')}</span>}
          {committed.lang?.length>0 && <span style={{padding:'3px 9px',background:'#fff',border:'1px solid #DBE9FF',borderRadius:999,fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8'}}>Language: {committed.lang.join(', ')}</span>}
          {committed.minAcc>0 && <span style={{padding:'3px 9px',background:'#fff',border:'1px solid #DBE9FF',borderRadius:999,fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8'}}>Accuracy: ≥{committed.minAcc}%</span>}
          {committed.headcount && <span style={{padding:'3px 9px',background:'#fff',border:'1px solid #DBE9FF',borderRadius:999,fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8'}}>Headcount target: {committed.headcount}</span>}
          <span style={{fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8',fontWeight:600}}>{filtered.length} matched</span>
          <button onClick={()=>{setCommitted(null);setDraft({country:[],lang:[],minAcc:0,headcount:''});}} style={{marginLeft:'auto',background:'transparent',border:0,cursor:'pointer',color:'#1E4FA8',fontFamily:'DM Sans',fontSize:11.5,fontWeight:500}}>Clear all</button>
        </div>
      )}

      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <SegmentBuilder draft={draft} setDraft={setDraft} onSubmit={applyFilter} resultCount={committed ? approxCount : Math.round(USERS.length / USERS.length * 30600)}/>

        <div style={{flex:1,minWidth:0,background:'#fff',border:'1px solid #E9ECF3',borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'11px 16px',borderBottom:'1px solid #F2F3F8',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125'}}>
              {filtered.length} users <span style={{fontWeight:400,color:'#6F7482'}}>· preview sample</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {selected.size>0 && <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#4285F4',fontWeight:600}}>{selected.size} selected</span>}
              <button style={{padding:'5px 10px',border:'1px solid #E1E4EC',borderRadius:6,background:'#fff',fontFamily:'DM Sans',fontSize:11.5,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>
                <Icon name="download" size={12}/> Export CSV
              </button>
            </div>
          </div>
          <UserTable users={filtered} onOpen={setSelectedUser} selected={selected} setSelected={setSelected}/>
          <div style={{padding:'9px 16px',borderTop:'1px solid #F2F3F8',display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482'}}>
            <span>Showing 1–{filtered.length} of ~{approxCount.toLocaleString()}</span>
            <div style={{display:'flex',gap:4}}>
              {[1,2,3].map(p=><button key={p} style={{padding:'3px 9px',border:p===1?'1px solid #4285F4':'1px solid #E1E4EC',borderRadius:5,background:p===1?'#4285F4':'#fff',fontFamily:'DM Sans',fontSize:11.5,color:p===1?'#fff':'#2C2C2C',cursor:'pointer',fontWeight:p===1?600:400}}>{p}</button>)}
            </div>
          </div>
        </div>

        <AIRecommendations filters={committed} users={filtered} headcount={committed?.headcount||''}/>
      </div>
    </div>
  );
}

window.UserExplorer = UserExplorer;
