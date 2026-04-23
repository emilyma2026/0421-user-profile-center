// Pool Health Overview page composition.

// ─── Date Range Picker ────────────────────────────────────────────
function DateRangePicker({ start, end, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState('start');
  const [pendingStart, setPendingStart] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);
  const [leftMonth, setLeftMonth] = React.useState(() => {
    const d = start ? new Date(start) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const ref = React.useRef(null);

  React.useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false); setPhase('start'); setPendingStart(null); setHovered(null);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1);
  const today = new Date(); today.setHours(0,0,0,0);

  const fmtLabel = d => d ? d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '—';
  const monthLabel = m => {
    const y = m.getFullYear(), mo = String(m.getMonth()+1).padStart(2,'0');
    return y + '-' + mo;
  };

  const buildDays = monthStart => {
    const y = monthStart.getFullYear(), mo = monthStart.getMonth();
    const firstDow = monthStart.getDay();
    const dim = new Date(y, mo+1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDow; i++) days.push({date: new Date(y, mo, i-firstDow+1), outside:true});
    for (let d = 1; d <= dim; d++) days.push({date: new Date(y, mo, d), outside:false});
    const rem = 7 - (days.length % 7);
    if (rem < 7) for (let d=1; d<=rem; d++) days.push({date: new Date(y, mo+1, d), outside:true});
    return days;
  };

  const handleClick = date => {
    if (phase === 'start') { setPendingStart(date); setPhase('end'); }
    else {
      let s = pendingStart, e = date;
      if (e < s) { const t=s; s=e; e=t; }
      onChange(s, e);
      setOpen(false); setPhase('start'); setPendingStart(null); setHovered(null);
    }
  };

  const rangeStart = pendingStart || start;
  const rangeEnd   = phase === 'end' && hovered ? hovered : end;

  const inRange = date => {
    if (!rangeStart || !rangeEnd) return false;
    const lo = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const hi = rangeStart < rangeEnd ? rangeEnd   : rangeStart;
    return date > lo && date < hi;
  };
  const isStart = date => rangeStart && date.getTime() === rangeStart.getTime();
  const isEnd   = date => rangeEnd   && date.getTime() === rangeEnd.getTime();
  const isToday = date => date.getTime() === today.getTime();

  const renderMonth = monthStart => {
    const days  = buildDays(monthStart);
    const weeks = [];
    for (let i=0; i<days.length; i+=7) weeks.push(days.slice(i,i+7));
    return (
      <div style={{minWidth:234}}>
        <div style={{textAlign:'center',fontFamily:'Jost',fontSize:14,fontWeight:600,color:'#111125',marginBottom:10}}>
          {monthLabel(monthStart)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,32px)',gap:'2px 0',marginBottom:4}}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} style={{textAlign:'center',fontFamily:'DM Sans',fontSize:10,fontWeight:600,color:'#9AA2B1',padding:'3px 0'}}>{d}</div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:1}}>
          {weeks.map((week,wi)=>(
            <div key={wi} style={{display:'grid',gridTemplateColumns:'repeat(7,32px)'}}>
              {week.map((day,di)=>{
                const sel_s = isStart(day.date);
                const sel_e = isEnd(day.date);
                const sel   = sel_s || sel_e;
                const rng   = inRange(day.date);
                const tod   = isToday(day.date);
                const isFirstOfRow = di === 0;
                const isLastOfRow  = di === 6;
                let bandRadius = '0';
                if (sel_s) bandRadius = '50% 0 0 50%';
                else if (sel_e) bandRadius = '0 50% 50% 0';
                else if (rng && isFirstOfRow) bandRadius = '4px 0 0 4px';
                else if (rng && isLastOfRow)  bandRadius = '0 4px 4px 0';
                return (
                  <div key={di}
                    onClick={() => !day.outside && handleClick(day.date)}
                    onMouseEnter={() => phase==='end' && !day.outside && setHovered(day.date)}
                    style={{
                      position:'relative', height:32,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background:(rng||sel) ? '#EAF1FE' : 'transparent',
                      borderRadius:bandRadius,
                      cursor:day.outside ? 'default' : 'pointer',
                    }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background:sel ? '#4285F4' : 'transparent',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'DM Sans', fontSize:12.5,
                      fontWeight:sel ? 700 : 400,
                      color:sel ? '#fff' : day.outside ? '#D6D9E1' : '#111125',
                    }}>
                      {day.date.getDate()}
                    </div>
                    {tod && !sel && (
                      <div style={{position:'absolute',bottom:3,left:'50%',transform:'translateX(-50%)',width:4,height:4,borderRadius:'50%',background:'#4285F4'}}/>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{
        display:'inline-flex',alignItems:'center',gap:8,
        padding:'6px 12px',border:'1px solid #E1E4EC',borderRadius:8,
        background:'#fff',cursor:'pointer',
        fontFamily:'DM Sans',fontSize:12.5,color:'#2C2C2C',
        boxShadow:open ? '0 0 0 2px #4285F420' : 'none',
      }}>
        <Icon name="calendar" size={13} color="#6F7482"/>
        <span>{fmtLabel(start)}</span>
        <span style={{color:'#9AA2B1',fontSize:11,margin:'0 2px'}}>—</span>
        <span>{fmtLabel(end)}</span>
      </button>
      {open && (
        <div style={{
          position:'absolute',top:'calc(100% + 6px)',right:0,zIndex:300,
          background:'#fff',border:'1px solid #E1E4EC',borderRadius:12,
          boxShadow:'0 12px 32px rgba(11,13,18,.14)',
          padding:'16px 20px',userSelect:'none',
        }}>
          {/* Nav header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{display:'flex',gap:1}}>
              {[
                {label:'«', fn:()=>setLeftMonth(m=>new Date(m.getFullYear()-1,m.getMonth(),1))},
                {label:'‹', fn:()=>setLeftMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))},
              ].map(b=>(
                <button key={b.label} onClick={b.fn} style={{background:'none',border:0,cursor:'pointer',color:'#6F7482',fontSize:15,padding:'2px 6px',borderRadius:4,lineHeight:1}}>{b.label}</button>
              ))}
            </div>
            <div style={{flex:1}}/>
            <div style={{display:'flex',gap:1}}>
              {[
                {label:'›', fn:()=>setLeftMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))},
                {label:'»', fn:()=>setLeftMonth(m=>new Date(m.getFullYear()+1,m.getMonth(),1))},
              ].map(b=>(
                <button key={b.label} onClick={b.fn} style={{background:'none',border:0,cursor:'pointer',color:'#6F7482',fontSize:15,padding:'2px 6px',borderRadius:4,lineHeight:1}}>{b.label}</button>
              ))}
            </div>
          </div>
          {/* Two calendars */}
          <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
            {renderMonth(leftMonth)}
            <div style={{width:1,background:'#F2F3F8',alignSelf:'stretch'}}/>
            {renderMonth(rightMonth)}
          </div>
          {phase === 'end' && (
            <div style={{marginTop:10,textAlign:'center',fontFamily:'DM Sans',fontSize:11,color:'#9AA2B1'}}>
              Click to select end date
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────
function SectionCard({ title, subtitle, right, children, padding=20 }) {
  return (
    <section style={{
      background:'#fff', border:'1px solid #E9ECF3', borderRadius:12,
      display:'flex', flexDirection:'column', overflow:'hidden'
    }}>
      <div style={{display:'flex',alignItems:'center',gap:12, padding:`14px ${padding}px`, borderBottom:'1px solid #F2F3F8'}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'DM Sans',fontSize:15,fontWeight:700,color:'#111125'}}>{title}</div>
          {subtitle && <div style={{fontFamily:'DM Sans',fontSize:12,color:'#6F7482',marginTop:2}}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{padding:`${padding}px`, flex:1}}>{children}</div>
    </section>
  );
}

// ─── Region Dropdown ──────────────────────────────────────────────
const REGION_OPTIONS = [
  { value:'all',          label:'All regions' },
  { value:'Philippines',  label:'🇵🇭 Philippines' },
  { value:'Indonesia',    label:'🇮🇩 Indonesia' },
  { value:'Vietnam',      label:'🇻🇳 Vietnam' },
  { value:'Thailand',     label:'🇹🇭 Thailand' },
  { value:'Egypt',        label:'🇪🇬 Egypt' },
  { value:'Mexico',       label:'🇲🇽 Mexico' },
  { value:'Malaysia',     label:'🇲🇾 Malaysia' },
  { value:'Singapore',    label:'🇸🇬 Singapore' },
];
function RegionDropdown({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = REGION_OPTIONS.find(o => o.value === value) || REGION_OPTIONS[0];
  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{
        display:'inline-flex',alignItems:'center',gap:8,
        padding:'6px 10px',border:'1px solid #E1E4EC',borderRadius:8,
        background:'#fff',cursor:'pointer',minWidth:148,
        fontFamily:'DM Sans',fontSize:12.5,color:'#2C2C2C',
        boxShadow:open ? '0 0 0 2px #4285F420' : 'none',
      }}>
        <Icon name="globe" size={13} color="#6F7482"/>
        <span style={{flex:1,textAlign:'left'}}>{selected.label}</span>
        <Icon name="chevron-down" size={11} color="#9AA2B1"/>
      </button>
      {open && (
        <div style={{
          position:'absolute',top:'calc(100% + 4px)',left:0,zIndex:300,
          background:'#fff',border:'1px solid #E1E4EC',borderRadius:8,
          boxShadow:'0 8px 24px rgba(11,13,18,.12)',
          minWidth:170,overflow:'hidden',
        }}>
          {REGION_OPTIONS.map(o=>(
            <button key={o.value} onClick={()=>{onChange(o.value);setOpen(false);}} style={{
              display:'flex',alignItems:'center',gap:8,width:'100%',
              padding:'8px 12px',border:0,background: o.value===value ? '#F4F8FF' : 'transparent',
              cursor:'pointer',textAlign:'left',
              fontFamily:'DM Sans',fontSize:12.5,
              color: o.value===value ? '#1E4FA8' : '#2C2C2C',
              fontWeight: o.value===value ? 600 : 400,
            }}
              onMouseEnter={e=>{ if(o.value!==value) e.currentTarget.style.background='#FAFBFC'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background = o.value===value ? '#F4F8FF' : 'transparent'; }}
            >
              {o.label}
              {o.value===value && <span style={{marginLeft:'auto',color:'#4285F4',fontSize:13}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Overview ────────────────────────────────────────────────
function PoolHealthOverview({ onOpenDrill, onNavigate }) {
  const makeDefault = () => {
    const end = new Date(); end.setHours(0,0,0,0);
    const start = new Date(end); start.setDate(start.getDate() - 30);
    return { start, end };
  };
  const [dateRange, setDateRange] = React.useState(makeDefault);
  const [region, setRegion] = React.useState('all');

  return (
    <div style={{padding:24, display:'flex', flexDirection:'column', gap:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:0}}>
        <div>
          <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>Pool Health Overview</div>
          <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
            At-a-glance view of the entire labeller supply pool · updated 4 min ago
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <RegionDropdown value={region} onChange={setRegion}/>
          <DateRangePicker
            start={dateRange.start}
            end={dateRange.end}
            onChange={(s,e)=>setDateRange({start:s,end:e})}
          />
          <button style={{width:34,height:34,border:'1px solid #E1E4EC',borderRadius:7,background:'#fff',cursor:'pointer',display:'grid',placeItems:'center'}}>
            <Icon name="refresh" size={14}/>
          </button>
        </div>
      </div>

      {/* 1. Alerts — full-width banner */}
      <SectionCard
        title="Alerts"
        subtitle="Monitor pool metrics across key dimensions · alert on significant drops or threshold breaches"
        right={
          <span style={{
            display:'inline-flex',alignItems:'center',gap:6,padding:'4px 9px',
            background:'#FEECEB',border:'1px solid #F9C4C0',borderRadius:999,
            fontFamily:'DM Sans',fontSize:11,fontWeight:600,color:'#B42318'
          }}>
            <span style={{width:6,height:6,background:'#F44336',borderRadius:99}}/>
            2 critical · 2 warning
          </span>
        }
      >
        <GapAlertPanel onOpen={(g)=>onOpenDrill({kind:'gap',data:g})} onViewAll={()=>onNavigate && onNavigate('gaps')}/>
      </SectionCard>

      {/* 2. Trends — 4 KPI cards */}
      <TrendsStrip/>

      {/* 3. Lifecycle — full width */}
      <SectionCard
        title="Lifecycle"
        subtitle="6-stage lifecycle funnel"
      >
        <LifecycleModule onNavigate={onNavigate}/>
      </SectionCard>

      {/* 4. Stated Preference & Motivation surveys */}
      <SectionCard
        title="User Stated Preference & Motivation"
        subtitle="Post-registration survey result"
      >
        <SurveyModule/>
      </SectionCard>

    </div>
  );
}

window.PoolHealthOverview = PoolHealthOverview;
window.SectionCard = SectionCard;
