// Pool Health Overview page composition.
// Layout:
//  [ Header row: breadcrumb + actions ]
//  [ KPI strip — 6 cards ]
//  [ ROW: Coverage Radar (with list below)  |  Lifecycle Funnel + callout ]
//  [ ROW: Lifecycle Distribution donut       |  Gap Alerts (preview of 3) ]

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

function PageHeader({ onRefresh, range, setRange }) {
  const ranges = ['7d','30d','90d','QTD','YTD'];
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16, marginBottom:16}}>
      <div>
        <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>
          Pool Health Overview
        </div>
        <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>
          At-a-glance view of the entire labeller supply pool · updated 4 min ago
        </div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:2,background:'#F2F3F8',borderRadius:8,padding:3}}>
          {ranges.map(r=>(
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:'5px 10px', border:0, borderRadius:6, cursor:'pointer',
              background: r===range ? '#fff' : 'transparent',
              color: r===range ? '#111125' : '#6F7482',
              boxShadow: r===range ? '0 1px 2px rgba(32,32,58,.08)' : 'none',
              fontFamily:'DM Sans', fontSize:12, fontWeight:600,
            }}>{r}</button>
          ))}
        </div>
        <button style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 11px',border:'1px solid #E1E4EC',borderRadius:7,background:'#fff',cursor:'pointer',fontFamily:'DM Sans',fontSize:12.5,fontWeight:500,color:'#2C2C2C'}}>
          <Icon name="filter" size={13}/> Segment: All
        </button>
        <button onClick={onRefresh} style={{width:32,height:32,border:'1px solid #E1E4EC',borderRadius:7,background:'#fff',cursor:'pointer',display:'grid',placeItems:'center'}}>
          <Icon name="refresh" size={14}/>
        </button>
        <button style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',border:'1px solid #E1E4EC',borderRadius:7,background:'#fff',cursor:'pointer',fontFamily:'DM Sans',fontSize:12.5,fontWeight:500,color:'#2C2C2C'}}>
          <Icon name="download" size={13}/> Export
        </button>
        <button style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',border:0,borderRadius:7,background:'#4285F4',cursor:'pointer',fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,color:'#fff'}}>
          <Icon name="sparkle" size={13} color="#fff"/> Ask Assistant
        </button>
      </div>
    </div>
  );
}

function PoolHealthOverview({ onOpenDrill, range, setRange, onNavigate }) {
  const [viewMode, setViewMode] = React.useState('radar'); // 'radar' | 'list'

  return (
    <div style={{padding:24, display:'flex', flexDirection:'column', gap:16}}>
      <PageHeader onRefresh={()=>{}} range={range} setRange={setRange}/>

      <KpiStrip/>

      {/* Row 1: Coverage Radar + Lifecycle (funnel + distribution combined) */}
      <div style={{display:'grid', gridTemplateColumns:'1.05fr 1.2fr', gap:18}}>
        <SectionCard
          title="Coverage Radar"
          subtitle="Actual vs. ideal supply across 5 dimensions"
          right={
            <div style={{display:'flex',alignItems:'center',gap:4,background:'#F2F3F8',borderRadius:8,padding:3}}>
              {[['radar','Radar'],['list','List']].map(([k,l])=>(
                <button key={k} onClick={()=>setViewMode(k)} style={{
                  padding:'5px 10px',border:0,borderRadius:6,cursor:'pointer',
                  background: viewMode===k?'#fff':'transparent',
                  color: viewMode===k?'#111125':'#6F7482',
                  boxShadow: viewMode===k?'0 1px 2px rgba(32,32,58,.08)':'none',
                  fontFamily:'DM Sans',fontSize:12,fontWeight:600,
                }}>{l}</button>
              ))}
            </div>
          }
        >
          {viewMode==='radar'
            ? <>
                <CoverageRadar/>
                <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid #F2F3F8'}}>
                  <CoverageList onDrill={(c)=>onOpenDrill({kind:'coverage',data:c})}/>
                </div>
              </>
            : <CoverageList onDrill={(c)=>onOpenDrill({kind:'coverage',data:c})}/>
          }
        </SectionCard>

        <SectionCard
          title="Lifecycle"
          subtitle="Funnel, stage distribution & activation micro-funnel"
          right={
            <button style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 10px',border:'1px solid #E1E1E1',borderRadius:7,background:'#fff',cursor:'pointer',fontFamily:'DM Sans',fontSize:12,fontWeight:500,color:'#2C2C2C'}}>
              Compare cohort <Icon name="chevron-down" size={11} color="#6F7482"/>
            </button>
          }
        >
          <LifecycleModule onNavigate={onNavigate}/>
        </SectionCard>
      </div>

      {/* Row 2: Activation by Region + Gap Alerts preview */}
      <div style={{display:'grid', gridTemplateColumns:'1.25fr 1fr', gap:18}}>
        <SectionCard
          title="Activation by Region"
          subtitle="Registered vs activated across Start.AI's 8 coverage countries"
          right={
            <button onClick={()=>onNavigate && onNavigate('explorer')} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 10px',border:'1px solid #E1E1E1',borderRadius:7,background:'#fff',cursor:'pointer',fontFamily:'DM Sans',fontSize:12,fontWeight:500,color:'#2C2C2C'}}>
              View all regions <Icon name="arrow-right" size={11} color="#6F7482"/>
            </button>
          }
        >
          <RegionActivation/>
        </SectionCard>

        <SectionCard
          title="Gap Alerts"
          subtitle="Ranked by severity × impact — auto-generated from gap scoring logic"
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
      </div>
    </div>
  );
}

window.PoolHealthOverview = PoolHealthOverview;
window.SectionCard = SectionCard;
