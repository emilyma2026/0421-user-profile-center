// §6.2.2 User Explorer — segment builder + user list + profile card drill-down.
// Left rail: filter stack (5 facets from spec).
// Center: results table with inline actions.
// Right panel: Individual User Profile Card.

// ─── Mock dataset ────────────────────────────────────────────────
const ARCHETYPES = [
  { key:'evergreen',  label:'Evergreen',         color:'#22C55E' },
  { key:'push',       label:'Push Sensitive',    color:'#4285F4' },
  { key:'incentive',  label:'Incentive Sensitive',color:'#F59E0B' },
  { key:'potential',  label:'High Potential',    color:'#8B5CF6' },
  { key:'unresponsive',label:'Non-Responsive',   color:'#94A3B8' },
];
const ARCH_BY = Object.fromEntries(ARCHETYPES.map(a=>[a.key,a]));

const USERS = [
  { id:'U-84219', country:'Philippines', flag:'🇵🇭', lang:'English, Tagalog', stage:'Engaged',   archetype:'evergreen',    reg:'2024-03-12', vol:'L3', acc:92, churn:8,  trajectory:'up',   lastActive:'2h ago',  volTier:'L3', accTier:'L3', consistency:'L2' },
  { id:'U-84186', country:'Vietnam',     flag:'🇻🇳', lang:'Vietnamese',      stage:'Engaged',   archetype:'push',         reg:'2024-06-02', vol:'L2', acc:88, churn:12, trajectory:'up',   lastActive:'5h ago',  volTier:'L2', accTier:'L3', consistency:'L2' },
  { id:'U-84991', country:'Indonesia',   flag:'🇮🇩', lang:'Bahasa Indonesia',stage:'Activated', archetype:'incentive',    reg:'2024-09-20', vol:'L1', acc:81, churn:38, trajectory:'flat', lastActive:'3d ago',  volTier:'L1', accTier:'L2', consistency:'L1' },
  { id:'U-85440', country:'Thailand',    flag:'🇹🇭', lang:'Thai',            stage:'Engaged',   archetype:'potential',    reg:'2025-01-14', vol:'L2', acc:84, churn:18, trajectory:'up',   lastActive:'4h ago',  volTier:'L2', accTier:'L2', consistency:'L2' },
  { id:'U-85091', country:'Philippines', flag:'🇵🇭', lang:'English',          stage:'Churned',   archetype:'unresponsive', reg:'2023-11-04', vol:'—',  acc:68, churn:94, trajectory:'down', lastActive:'92d ago', volTier:'L0', accTier:'L1', consistency:'L0' },
  { id:'U-85612', country:'Egypt',       flag:'🇪🇬', lang:'Arabic',           stage:'Onboarded', archetype:'potential',    reg:'2025-08-19', vol:'L1', acc:77, churn:42, trajectory:'up',   lastActive:'1d ago',  volTier:'L1', accTier:'L1', consistency:'L1' },
  { id:'U-85714', country:'Singapore',   flag:'🇸🇬', lang:'English, Malay',   stage:'Engaged',   archetype:'evergreen',    reg:'2024-05-30', vol:'L3', acc:91, churn:6,  trajectory:'up',   lastActive:'30m ago', volTier:'L3', accTier:'L3', consistency:'L3' },
  { id:'U-84077', country:'Mexico',      flag:'🇲🇽', lang:'Spanish',          stage:'Activated', archetype:'incentive',    reg:'2025-02-22', vol:'L1', acc:79, churn:32, trajectory:'flat', lastActive:'8h ago',  volTier:'L1', accTier:'L2', consistency:'L1' },
  { id:'U-85803', country:'Malaysia',    flag:'🇲🇾', lang:'Malay, English',   stage:'Engaged',   archetype:'push',         reg:'2024-10-11', vol:'L2', acc:86, churn:14, trajectory:'up',   lastActive:'6h ago',  volTier:'L2', accTier:'L2', consistency:'L2' },
  { id:'U-85990', country:'Philippines', flag:'🇵🇭', lang:'English, Tagalog', stage:'Registered',archetype:'potential',    reg:'2026-03-08', vol:'—',  acc:0,  churn:60, trajectory:'flat', lastActive:'41d ago', volTier:'L0', accTier:'L0', consistency:'L0' },
];

// ─── Segment Builder (left filter rail) ──────────────────────────
function FilterGroup({ title, children, defaultOpen=true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{borderBottom:'1px solid #F2F3F8'}}>
      <button onClick={()=>setOpen(!open)} style={{
        width:'100%', padding:'12px 14px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'transparent', border:0, cursor:'pointer',
        fontFamily:'DM Sans', fontSize:11.5, fontWeight:700, letterSpacing:'.06em',
        textTransform:'uppercase', color:'#6F7482'
      }}>
        {title}
        <Icon name={open?'chevron-down':'chevron-right'} size={12} color="#6F7482"/>
      </button>
      {open && <div style={{padding:'0 14px 14px', display:'flex', flexDirection:'column', gap:8}}>{children}</div>}
    </div>
  );
}

function Chip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding:'5px 10px', borderRadius:999, cursor:'pointer',
      border:`1px solid ${active ? (color||'#4285F4') : '#E1E4EC'}`,
      background: active ? (color?`${color}15`:'#EAF1FE') : '#fff',
      color: active ? (color||'#1E4FA8') : '#2C2C2C',
      fontFamily:'DM Sans', fontSize:11.5, fontWeight: active ? 600 : 500,
      display:'inline-flex', alignItems:'center', gap:5
    }}>
      {active && color && <span style={{width:6,height:6,borderRadius:99,background:color}}/>}
      {label}
    </button>
  );
}

function Slider({ label, value, min, max, suffix='', onChange }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'DM Sans',fontSize:11.5}}>
        <span style={{color:'#2C2C2C'}}>{label}</span>
        <span style={{fontFamily:'Jost',fontWeight:600,color:'#111125',fontVariantNumeric:'tabular-nums'}}>≤ {value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e=>onChange(+e.target.value)} style={{
        width:'100%', accentColor:'#4285F4'
      }}/>
    </div>
  );
}

function SegmentBuilder({ filters, setFilters, resultCount }) {
  const toggle = (key, val) => {
    const cur = filters[key] || [];
    setFilters({...filters, [key]: cur.includes(val) ? cur.filter(v=>v!==val) : [...cur, val]});
  };
  const has = (key, val) => (filters[key]||[]).includes(val);

  return (
    <aside style={{
      width:260, flexShrink:0, background:'#fff', border:'1px solid #E9ECF3',
      borderRadius:12, display:'flex', flexDirection:'column', overflow:'hidden',
      alignSelf:'flex-start', maxHeight:'calc(100vh - 200px)'
    }}>
      <div style={{padding:'14px 14px 12px', borderBottom:'1px solid #F2F3F8', display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontFamily:'DM Sans',fontSize:14,fontWeight:700,color:'#111125',lineHeight:1.2}}>Segment builder</div>
          <div style={{fontFamily:'DM Sans',fontSize:11,color:'#6F7482',marginTop:3}}>{resultCount.toLocaleString()} users match</div>
        </div>
        <button onClick={()=>setFilters({})} style={{
          background:'transparent',border:0,cursor:'pointer',fontFamily:'DM Sans',fontSize:11,color:'#4285F4',fontWeight:500,padding:'2px 0',flexShrink:0
        }}>Reset</button>
      </div>

      <div style={{overflow:'auto', flex:1}}>
        <FilterGroup title="Inherent traits">
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:2}}>Country</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {['Philippines','Indonesia','Vietnam','Thailand','Egypt','Mexico','Malaysia','Singapore'].map(c=>(
              <Chip key={c} label={c} active={has('country',c)} onClick={()=>toggle('country',c)}/>
            ))}
          </div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:8}}>Language</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {['English','Spanish','Arabic','Vietnamese','Thai','Bahasa','Malay','Tagalog'].map(l=>(
              <Chip key={l} label={l} active={has('lang',l)} onClick={()=>toggle('lang',l)}/>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Lifecycle stage">
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {['Registered','Onboarded','Activated','Engaged','Churned'].map(s=>(
              <Chip key={s} label={s} active={has('stage',s)} onClick={()=>toggle('stage',s)}/>
            ))}
          </div>
          <Slider label="Days since last active" value={filters.daysInactive||90} min={0} max={180} suffix="d" onChange={v=>setFilters({...filters,daysInactive:v})}/>
        </FilterGroup>

        <FilterGroup title="Performance">
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482'}}>Volume tier</div>
          <div style={{display:'flex',gap:5}}>
            {['L1','L2','L3'].map(t=><Chip key={t} label={t} active={has('volTier',t)} onClick={()=>toggle('volTier',t)}/>)}
          </div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:8}}>Accuracy tier</div>
          <div style={{display:'flex',gap:5}}>
            {['L1','L2','L3'].map(t=><Chip key={t} label={t} active={has('accTier',t)} onClick={()=>toggle('accTier',t)}/>)}
          </div>
          <Slider label="Min accuracy" value={filters.minAcc||0} min={0} max={100} suffix="%" onChange={v=>setFilters({...filters,minAcc:v})}/>
        </FilterGroup>

        <FilterGroup title="Behavioural — archetype">
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {ARCHETYPES.map(a=>(
              <Chip key={a.key} label={a.label} active={has('archetype',a.key)} onClick={()=>toggle('archetype',a.key)} color={a.color}/>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Predictive">
          <Slider label="Max churn risk" value={filters.maxChurn||100} min={0} max={100} suffix="%" onChange={v=>setFilters({...filters,maxChurn:v})}/>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',marginTop:8}}>Quality trajectory</div>
          <div style={{display:'flex',gap:5}}>
            {['up','flat','down'].map(t=><Chip key={t} label={t} active={has('trajectory',t)} onClick={()=>toggle('trajectory',t)}/>)}
          </div>
        </FilterGroup>
      </div>

      <div style={{padding:12, borderTop:'1px solid #F2F3F8', display:'flex', gap:8}}>
        <button style={{
          flex:1, padding:'9px 12px', background:'#4285F4', color:'#fff', border:0, borderRadius:7,
          fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,cursor:'pointer',
          display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6
        }}>
          <Icon name="download" size={13} color="#fff"/> Export to campaign
        </button>
        <button title="Save segment" style={{
          width:36, height:34, border:'1px solid #E1E4EC', background:'#fff', borderRadius:7,
          cursor:'pointer', display:'grid', placeItems:'center'
        }}>
          <Icon name="tag" size={14} color="#2C2C2C"/>
        </button>
      </div>
    </aside>
  );
}

// ─── User Table ────────────────────────────────────────────────
function TierPill({ tier }) {
  const map = { L0:'#94A3B8', L1:'#CBD5E1', L2:'#7CA9FC', L3:'#4285F4', '—':'#CBD5E1' };
  const filled = tier==='L3' ? '#4285F4' : tier==='L2' ? '#7CA9FC' : tier==='L1' ? '#9DC6FF' : '#E1E6F0';
  const fg = tier==='L3'||tier==='L2' ? '#fff' : '#2C2C2C';
  return <span style={{
    display:'inline-block', padding:'2px 7px', borderRadius:4, fontFamily:'Jost', fontSize:11, fontWeight:600,
    background:filled, color:fg, minWidth:28, textAlign:'center'
  }}>{tier}</span>;
}

function ArchetypeBadge({ kind }) {
  const a = ARCH_BY[kind];
  if(!a) return null;
  return <span style={{
    display:'inline-flex', alignItems:'center', gap:5, padding:'2px 7px', borderRadius:999,
    background:`${a.color}15`, border:`1px solid ${a.color}40`, color:a.color,
    fontFamily:'DM Sans', fontSize:10.5, fontWeight:600, whiteSpace:'nowrap'
  }}>
    <span style={{width:5,height:5,borderRadius:99,background:a.color}}/>
    {a.label}
  </span>;
}

function TrajectoryArrow({ t }) {
  if(t==='up') return <Icon name="trending-up" size={13} color="#22C55E"/>;
  if(t==='down') return <Icon name="trending-down" size={13} color="#F44336"/>;
  return <span style={{width:13,height:1,background:'#CBD5E1',display:'inline-block'}}/>;
}

function UserRow({ user, onOpen, selected, onToggleSelect }) {
  return (
    <tr style={{borderTop:'1px solid #F2F3F8', background: selected ? '#F8FBFF' : '#fff'}}>
      <td style={{padding:'10px 12px'}}>
        <input type="checkbox" checked={selected} onChange={onToggleSelect} style={{accentColor:'#4285F4'}}/>
      </td>
      <td style={{padding:'10px 4px', fontFamily:'Jost', fontSize:12.5, color:'#111125', fontWeight:500}}>
        <button onClick={onOpen} style={{background:'transparent',border:0,padding:0,color:'#111125',fontFamily:'inherit',fontSize:'inherit',fontWeight:'inherit',cursor:'pointer',textDecoration:'underline',textDecorationColor:'transparent',textUnderlineOffset:2}} onMouseEnter={e=>e.currentTarget.style.textDecorationColor='#4285F4'} onMouseLeave={e=>e.currentTarget.style.textDecorationColor='transparent'}>
          {user.id}
        </button>
      </td>
      <td style={{padding:'10px 4px', fontFamily:'DM Sans',fontSize:12,color:'#2C2C2C'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:14}}>{user.flag}</span>{user.country}
        </span>
      </td>
      <td style={{padding:'10px 4px', fontFamily:'DM Sans',fontSize:12,color:'#6F7482'}}>{user.lang}</td>
      <td style={{padding:'10px 4px'}}>
        <span style={{
          display:'inline-block',padding:'2px 8px',borderRadius:999,
          background: user.stage==='Churned'?'#FEECEB':user.stage==='Engaged'?'#E8F6EC':'#EAF1FE',
          color:    user.stage==='Churned'?'#B42318':user.stage==='Engaged'?'#15803D':'#1E4FA8',
          fontFamily:'DM Sans',fontSize:10.5,fontWeight:600
        }}>{user.stage}</span>
      </td>
      <td style={{padding:'10px 4px'}}><ArchetypeBadge kind={user.archetype}/></td>
      <td style={{padding:'10px 4px',textAlign:'center'}}><TierPill tier={user.volTier}/></td>
      <td style={{padding:'10px 4px',textAlign:'right',fontFamily:'Jost',fontSize:12.5,fontWeight:500,fontVariantNumeric:'tabular-nums'}}>
        {user.acc}%
      </td>
      <td style={{padding:'10px 4px',textAlign:'center'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'Jost',fontSize:12,fontVariantNumeric:'tabular-nums',color: user.churn>60?'#F44336':user.churn>30?'#F59E0B':'#22C55E',fontWeight:600}}>
          {user.churn}%
          <TrajectoryArrow t={user.trajectory}/>
        </span>
      </td>
      <td style={{padding:'10px 4px', fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482'}}>{user.lastActive}</td>
      <td style={{padding:'10px 12px', textAlign:'right'}}>
        <button onClick={onOpen} style={{
          padding:'5px 9px', background:'#fff', border:'1px solid #E1E4EC', borderRadius:6,
          fontFamily:'DM Sans',fontSize:11,fontWeight:500,cursor:'pointer',color:'#2C2C2C',
          display:'inline-flex',alignItems:'center',gap:4
        }}>View <Icon name="arrow-right" size={10} color="#6F7482"/></button>
      </td>
    </tr>
  );
}

function UserTable({ users, onOpen, selected, setSelected }) {
  const allSelected = users.length>0 && users.every(u=>selected.has(u.id));
  const toggleAll = () => {
    if(allSelected) setSelected(new Set());
    else setSelected(new Set(users.map(u=>u.id)));
  };
  return (
    <div style={{overflow:'auto'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'DM Sans', minWidth:900}}>
        <thead>
          <tr style={{background:'#FAFBFD'}}>
            <th style={{padding:'10px 12px',textAlign:'left',width:30}}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{accentColor:'#4285F4'}}/>
            </th>
            {[
              {label:'User', align:'left'},
              {label:'Country', align:'left'},
              {label:'Language', align:'left'},
              {label:'Stage', align:'left'},
              {label:'Archetype', align:'left'},
              {label:'Vol tier', align:'center'},
              {label:'Accuracy', align:'right'},
              {label:'Churn risk', align:'center'},
              {label:'Last active', align:'left'},
              {label:'', align:'right'},
            ].map((h,i)=>(
              <th key={i} style={{padding:'10px 4px',textAlign:h.align,fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,color:'#6F7482',textTransform:'uppercase',letterSpacing:'.05em'}}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <UserRow key={u.id} user={u} onOpen={()=>onOpen(u)}
              selected={selected.has(u.id)}
              onToggleSelect={()=>{
                const next = new Set(selected);
                if(next.has(u.id)) next.delete(u.id); else next.add(u.id);
                setSelected(next);
              }}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Individual User Profile Card ─────────────────────────────
function Sparkline({ points, color='#4285F4', width=160, height=30 }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = Math.max(max-min, 1);
  const d = points.map((p,i)=>`${i===0?'M':'L'}${(i/(points.length-1))*width},${height - ((p-min)/range)*height}`).join(' ');
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`${color}20`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}

function ProfileCard({ user, onClose }) {
  if(!user) return null;
  const a = ARCH_BY[user.archetype] || {};
  const volSeries = [3,5,4,6,7,5,8,9,7,10,12,11];
  const accSeries = [85,86,88,87,89,90,91,90,92,91,92,92].map(v=>v - (90 - user.acc));

  return (
    <aside style={{
      width:340, flexShrink:0, background:'#fff', border:'1px solid #E9ECF3',
      borderRadius:12, overflow:'hidden', alignSelf:'flex-start',
      maxHeight:'calc(100vh - 200px)', display:'flex', flexDirection:'column',
      position:'sticky', top:0
    }}>
      {/* Header */}
      <div style={{padding:'14px 16px', borderBottom:'1px solid #F2F3F8', display:'flex',alignItems:'flex-start',gap:10}}>
        <div style={{width:38,height:38,borderRadius:10,background:'#EAF1FE',display:'grid',placeItems:'center',color:'#4285F4',fontFamily:'Jost',fontWeight:600}}>
          {user.id.slice(-3)}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'Jost',fontSize:14,fontWeight:600,color:'#111125'}}>{user.id}</div>
          <div style={{fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482',marginTop:2}}>
            {user.flag} {user.country} · {user.lang}
          </div>
          <div style={{display:'flex',gap:5,marginTop:6,flexWrap:'wrap'}}>
            <span style={{padding:'2px 7px',borderRadius:999,background:'#EAF1FE',color:'#1E4FA8',fontFamily:'DM Sans',fontSize:10.5,fontWeight:600}}>{user.stage}</span>
            <ArchetypeBadge kind={user.archetype}/>
          </div>
        </div>
        <button onClick={onClose} style={{width:26,height:26,border:0,background:'transparent',cursor:'pointer',display:'grid',placeItems:'center'}}>
          <Icon name="x" size={14} color="#6F7482"/>
        </button>
      </div>

      <div style={{overflow:'auto',flex:1,padding:16,display:'flex',flexDirection:'column',gap:16}}>
        {/* Snapshot */}
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Snapshot</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[
              {label:'Volume', value:user.volTier, accent:'#4285F4'},
              {label:'Accuracy', value:user.accTier, accent:'#22C55E'},
              {label:'Consistency', value:user.consistency, accent:'#8B5CF6'},
            ].map(m=>(
              <div key={m.label} style={{padding:10,background:'#F7F8FB',borderRadius:8}}>
                <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482'}}>{m.label}</div>
                <div style={{marginTop:4,display:'flex',alignItems:'center',gap:6}}>
                  <TierPill tier={m.value}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trends */}
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>12-week trend</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{padding:10,background:'#F7F8FB',borderRadius:8}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>Weekly volume</span>
                <span style={{fontFamily:'Jost',fontSize:12,fontWeight:600,color:'#111125'}}>{volSeries[volSeries.length-1]*10} tasks/wk</span>
              </div>
              <Sparkline points={volSeries} color="#4285F4" width={300} height={40}/>
            </div>
            <div style={{padding:10,background:'#F7F8FB',borderRadius:8}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>Accuracy</span>
                <span style={{fontFamily:'Jost',fontSize:12,fontWeight:600,color:'#111125'}}>{user.acc}%</span>
              </div>
              <Sparkline points={accSeries} color="#22C55E" width={300} height={40}/>
            </div>
          </div>
        </div>

        {/* Predictive */}
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Predictive</div>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            <PredictiveRow label="Churn risk"
              value={`${user.churn}%`}
              color={user.churn>60?'#F44336':user.churn>30?'#F59E0B':'#22C55E'}
              bar={user.churn}/>
            <PredictiveRow label="Quality trajectory"
              value={user.trajectory} trailing={<TrajectoryArrow t={user.trajectory}/>}
              color={user.trajectory==='up'?'#22C55E':user.trajectory==='down'?'#F44336':'#6F7482'}/>
            <PredictiveRow label="Next-wk availability"
              value={user.trajectory==='down' ? '8h est.' : '22h est.'}
              color="#4285F4" bar={user.trajectory==='down' ? 25 : 78}/>
          </div>
        </div>

        {/* Tag History */}
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'#6F7482',marginBottom:8}}>Tag history</div>
          <ol style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10,position:'relative'}}>
            <div style={{position:'absolute',left:5,top:6,bottom:6,width:1,background:'#E1E6F0'}}/>
            {[
              { date:'2026-02-14', tag:`Archetype: ${a.label}`,  color:a.color||'#4285F4', cur:true },
              { date:'2025-11-02', tag:'Skill tier: L2 → L3',  color:'#4285F4' },
              { date:'2025-08-19', tag:'Archetype: High Potential', color:'#8B5CF6' },
              { date:'2024-03-12', tag:`Registered · ${user.country}`, color:'#94A3B8' },
            ].map((e,i)=>(
              <li key={i} style={{display:'grid',gridTemplateColumns:'12px 1fr auto',alignItems:'center',gap:10,position:'relative'}}>
                <span style={{width:11,height:11,borderRadius:99,background: e.cur? e.color : '#fff', border:`2px solid ${e.color}`,marginLeft:0,zIndex:1}}/>
                <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>{e.tag}</span>
                <span style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',fontVariantNumeric:'tabular-nums'}}>{e.date}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div style={{padding:12, borderTop:'1px solid #F2F3F8', display:'flex', gap:8}}>
        <button style={{
          flex:1, padding:'8px 10px', background:'#4285F4', color:'#fff', border:0, borderRadius:7,
          fontFamily:'DM Sans',fontSize:12,fontWeight:600,cursor:'pointer'
        }}>Add to campaign</button>
        <button style={{
          flex:1, padding:'8px 10px', background:'#fff', color:'#2C2C2C', border:'1px solid #E1E4EC', borderRadius:7,
          fontFamily:'DM Sans',fontSize:12,fontWeight:500,cursor:'pointer'
        }}>Nudge</button>
      </div>
    </aside>
  );
}

function PredictiveRow({ label, value, bar, color='#4285F4', trailing }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr auto',alignItems:'center',gap:8}}>
      <div style={{minWidth:0}}>
        <div style={{fontFamily:'DM Sans',fontSize:11.5,color:'#2C2C2C'}}>{label}</div>
        {bar != null && (
          <div style={{marginTop:4,height:5,background:'#F2F3F8',borderRadius:999,overflow:'hidden'}}>
            <div style={{width:`${bar}%`,height:'100%',background:color,borderRadius:999}}/>
          </div>
        )}
      </div>
      <div style={{display:'inline-flex',alignItems:'center',gap:5,fontFamily:'Jost',fontSize:12.5,fontWeight:600,color,fontVariantNumeric:'tabular-nums'}}>
        {value}{trailing}
      </div>
    </div>
  );
}

// ─── Main Explorer Page ────────────────────────────────────────
function UserExplorer() {
  const [filters, setFilters] = React.useState({});
  const [selectedUser, setSelectedUser] = React.useState(USERS[0]);
  const [selected, setSelected] = React.useState(new Set());

  const filtered = USERS.filter(u => {
    if(filters.country?.length && !filters.country.includes(u.country)) return false;
    if(filters.stage?.length && !filters.stage.includes(u.stage)) return false;
    if(filters.archetype?.length && !filters.archetype.includes(u.archetype)) return false;
    if(filters.volTier?.length && !filters.volTier.includes(u.volTier)) return false;
    if(filters.accTier?.length && !filters.accTier.includes(u.accTier)) return false;
    if(filters.trajectory?.length && !filters.trajectory.includes(u.trajectory)) return false;
    if(filters.minAcc && u.acc < filters.minAcc) return false;
    if(filters.maxChurn != null && u.churn > filters.maxChurn) return false;
    return true;
  });

  // pretend the full dataset is 30,600 users; scale
  const approxCount = Math.round(filtered.length / USERS.length * 30600);

  return (
    <div style={{padding:24, display:'flex', flexDirection:'column', gap:16}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>User Explorer</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            Segment builder & individual drill-down · {approxCount.toLocaleString()} labellers match current filters
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 10px 6px 11px',background:'#fff',border:'1px solid #E1E4EC',borderRadius:7,width:240}}>
            <Icon name="search" size={13} color="#6F7482"/>
            <input placeholder="Search by ID, email…" style={{border:0,outline:'none',flex:1,fontFamily:'DM Sans',fontSize:12.5,background:'transparent'}}/>
          </div>
          <button style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',border:0,borderRadius:7,background:'#4285F4',cursor:'pointer',fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,color:'#fff'}}>
            <Icon name="plus" size={13} color="#fff"/> Save segment
          </button>
        </div>
      </div>

      {/* Active filter summary bar */}
      {Object.keys(filters).length > 0 && (
        <div style={{padding:'10px 14px',background:'#F4F8FF',border:'1px solid #DBE9FF',borderRadius:8,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <Icon name="filter" size={13} color="#4285F4"/>
          <span style={{fontFamily:'DM Sans',fontSize:12,color:'#1E4FA8',fontWeight:600}}>Active segment:</span>
          {Object.entries(filters).map(([k,v])=>{
            const vs = Array.isArray(v) ? v : [v];
            if(vs.length===0) return null;
            return vs.map((val,i)=>(
              <span key={`${k}-${i}`} style={{padding:'3px 9px',background:'#fff',border:'1px solid #DBE9FF',borderRadius:999,fontFamily:'DM Sans',fontSize:11,color:'#1E4FA8',display:'inline-flex',alignItems:'center',gap:6}}>
                <b style={{fontWeight:600,color:'#6F7482',fontWeight:500}}>{k}:</b> {String(val)}
                <button onClick={()=>{
                  const next = {...filters};
                  if(Array.isArray(next[k])) next[k] = next[k].filter(x=>x!==val);
                  else delete next[k];
                  if(Array.isArray(next[k]) && next[k].length===0) delete next[k];
                  setFilters(next);
                }} style={{background:'transparent',border:0,padding:0,cursor:'pointer',display:'inline-flex'}}>
                  <Icon name="x" size={10} color="#1E4FA8"/>
                </button>
              </span>
            ));
          })}
          <button onClick={()=>setFilters({})} style={{marginLeft:'auto',background:'transparent',border:0,cursor:'pointer',color:'#1E4FA8',fontFamily:'DM Sans',fontSize:11.5,fontWeight:500}}>Clear all</button>
        </div>
      )}

      {/* Main layout: filters | table | profile */}
      <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
        <SegmentBuilder filters={filters} setFilters={setFilters} resultCount={approxCount}/>

        <div style={{flex:1,minWidth:0,background:'#fff',border:'1px solid #E9ECF3',borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #F2F3F8',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontFamily:'DM Sans',fontSize:13,fontWeight:600,color:'#111125'}}>
              {filtered.length} of {USERS.length} shown <span style={{fontWeight:400,color:'#6F7482'}}>· preview sample</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {selected.size > 0 && (
                <span style={{fontFamily:'DM Sans',fontSize:11.5,color:'#4285F4',fontWeight:600}}>{selected.size} selected</span>
              )}
              <button style={{padding:'5px 10px',border:'1px solid #E1E4EC',borderRadius:6,background:'#fff',fontFamily:'DM Sans',fontSize:11.5,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>
                <Icon name="sliders" size={12}/> Columns
              </button>
              <button style={{padding:'5px 10px',border:'1px solid #E1E4EC',borderRadius:6,background:'#fff',fontFamily:'DM Sans',fontSize:11.5,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>
                <Icon name="download" size={12}/> Export CSV
              </button>
            </div>
          </div>
          <UserTable users={filtered} onOpen={setSelectedUser} selected={selected} setSelected={setSelected}/>
          <div style={{padding:'10px 16px',borderTop:'1px solid #F2F3F8',display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'DM Sans',fontSize:11.5,color:'#6F7482'}}>
            <span>Showing 1–{filtered.length} of {approxCount.toLocaleString()}</span>
            <div style={{display:'flex',gap:4}}>
              <button style={{padding:'4px 10px',border:'1px solid #E1E4EC',borderRadius:5,background:'#fff',fontFamily:'inherit',fontSize:'inherit',color:'#6F7482',cursor:'pointer'}}>Prev</button>
              <button style={{padding:'4px 10px',border:'1px solid #4285F4',borderRadius:5,background:'#4285F4',fontFamily:'inherit',fontSize:'inherit',color:'#fff',cursor:'pointer',fontWeight:600}}>1</button>
              <button style={{padding:'4px 10px',border:'1px solid #E1E4EC',borderRadius:5,background:'#fff',fontFamily:'inherit',fontSize:'inherit',color:'#2C2C2C',cursor:'pointer'}}>2</button>
              <button style={{padding:'4px 10px',border:'1px solid #E1E4EC',borderRadius:5,background:'#fff',fontFamily:'inherit',fontSize:'inherit',color:'#2C2C2C',cursor:'pointer'}}>3</button>
              <button style={{padding:'4px 10px',border:'1px solid #E1E4EC',borderRadius:5,background:'#fff',fontFamily:'inherit',fontSize:'inherit',color:'#6F7482',cursor:'pointer'}}>Next</button>
            </div>
          </div>
        </div>

        <ProfileCard user={selectedUser} onClose={()=>setSelectedUser(null)}/>
      </div>
    </div>
  );
}

window.UserExplorer = UserExplorer;
