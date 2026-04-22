// Activation by Region — Registered vs Engaged (task labelling behaviour).
// Backed by spec's 8 canonical countries (§1 Context).

const REGIONS = [
  { country:'Philippines', flag:'🇵🇭', registered:8400, engaged:1200, avgDaily:3.4, accuracy:89,  status:'critical',
    note:'9.2k dormant — highest engagement gap' },
  { country:'Indonesia',   flag:'🇮🇩', registered:5200, engaged:1800, avgDaily:3.1, accuracy:82,  status:'warning',
    note:'Push-sensitive cohort · optimise send time' },
  { country:'Vietnam',     flag:'🇻🇳', registered:4100, engaged:2200, avgDaily:3.6, accuracy:85,  status:'healthy',
    note:'Best cost-per-engagement' },
  { country:'Thailand',    flag:'🇹🇭', registered:3800, engaged:1700, avgDaily:2.9, accuracy:83,  status:'healthy' },
  { country:'Egypt',       flag:'🇪🇬', registered:3200, engaged: 800, avgDaily:2.4, accuracy:78,  status:'warning',
    note:'Task participation rate below benchmark' },
  { country:'Mexico',      flag:'🇲🇽', registered:2400, engaged: 700, avgDaily:3.2, accuracy:81,  status:'warning' },
  { country:'Malaysia',    flag:'🇲🇾', registered:1600, engaged: 950, avgDaily:3.5, accuracy:86,  status:'healthy' },
  { country:'Singapore',   flag:'🇸🇬', registered: 900, engaged: 620, avgDaily:2.8, accuracy:88,  status:'healthy' },
];

function statusToColor(s) {
  return s==='critical' ? '#F44336' : s==='warning' ? '#F59E0B' : '#22C55E';
}

function RegionActivation() {
  const maxReg = Math.max(...REGIONS.map(r=>r.registered));
  const [sortBy, setSortBy] = React.useState('volume'); // volume | rate
  const sorted = [...REGIONS].sort((a,b)=>{
    if (sortBy === 'rate') return (a.engaged/a.registered) - (b.engaged/b.registered);
    return b.registered - a.registered;
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      {/* Header row */}
      <div style={{
        display:'grid', gridTemplateColumns:'170px 1fr 96px 90px 96px 30px',
        alignItems:'center', gap:12, padding:'0 8px 10px',
        borderBottom:'1px solid #F2F3F8',
        fontFamily:'DM Sans', fontSize:11, fontWeight:600, color:'#6F7482',
        textTransform:'uppercase', letterSpacing:'.04em'
      }}>
        <button onClick={()=>setSortBy('volume')} style={{
          background:'transparent',border:0,padding:0,cursor:'pointer',textAlign:'left',
          fontFamily:'inherit',fontSize:'inherit',fontWeight:'inherit',
          color: sortBy==='volume' ? '#4285F4' : 'inherit',
          letterSpacing:'inherit', textTransform:'inherit',
          display:'inline-flex', alignItems:'center', gap:4
        }}>Country {sortBy==='volume' && '↓'}</button>
        <span>Engagement split</span>
        <button onClick={()=>setSortBy('rate')} style={{
          background:'transparent',border:0,padding:0,cursor:'pointer',textAlign:'right',
          fontFamily:'inherit',fontSize:'inherit',fontWeight:'inherit',
          color: sortBy==='rate' ? '#4285F4' : 'inherit',
          letterSpacing:'inherit', textTransform:'inherit',
        }}>Eng. rate {sortBy==='rate' && '↓'}</button>
        <span style={{textAlign:'right'}}>Avg hrs</span>
        <span style={{textAlign:'right'}}>Accuracy</span>
        <span/>
      </div>

      {/* Rows */}
      {sorted.map(r => {
        const rate = r.engaged/r.registered*100;
        const engagedW = r.engaged/maxReg*100;
        const dormantW  = (r.registered-r.engaged)/maxReg*100;
        const dotColor = statusToColor(r.status);
        return (
          <div key={r.country} style={{
            display:'grid', gridTemplateColumns:'170px 1fr 96px 90px 96px 30px',
            alignItems:'center', gap:12, padding:'11px 8px',
            borderBottom:'1px solid #F7F8FB'
          }}>
            <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
              <span style={{fontSize:16,lineHeight:1}}>{r.flag}</span>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:'DM Sans',fontSize:12.5,fontWeight:600,color:'#111125'}}>{r.country}</div>
                <div style={{fontFamily:'DM Sans',fontSize:10.5,color:'#6F7482',fontVariantNumeric:'tabular-nums'}}>
                  {r.registered.toLocaleString()} registered
                </div>
              </div>
              <span style={{width:6,height:6,borderRadius:99,background:dotColor,flexShrink:0,marginLeft:'auto'}}/>
            </div>

            {/* stacked bar: engaged (solid) + dormant (hatched/light) */}
            <div title={r.note} style={{position:'relative',height:16,borderRadius:4,background:'#F7F8FB',overflow:'hidden',display:'flex'}}>
              <div style={{
                width:`${engagedW}%`,background:'#4285F4',height:'100%'
              }}/>
              <div style={{
                width:`${dormantW}%`,
                background:`repeating-linear-gradient(135deg, #CFD6E4 0 4px, #E1E6F0 4px 8px)`,
                height:'100%', opacity:.85
              }}/>
            </div>

            <div style={{textAlign:'right'}}>
              <span style={{
                display:'inline-flex', alignItems:'baseline', gap:4,
                fontFamily:'Jost',fontSize:13,fontWeight:600,
                color: rate >= 50 ? '#22C55E' : rate >= 30 ? '#F59E0B' : '#F44336',
                fontVariantNumeric:'tabular-nums'
              }}>
                {rate.toFixed(0)}%
              </span>
            </div>

            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:13,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums'}}>
              {r.avgDaily.toFixed(1)}h
            </div>

            <div style={{textAlign:'right',fontFamily:'Jost',fontSize:13,fontWeight:500,color:'#111125',fontVariantNumeric:'tabular-nums'}}>
              {r.accuracy}%
            </div>

            <button style={{
              width:24,height:24,borderRadius:5,border:'1px solid #E9ECF3',background:'#fff',
              cursor:'pointer',display:'grid',placeItems:'center'
            }}>
              <Icon name="arrow-right" size={11} color="#6F7482"/>
            </button>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{display:'flex',alignItems:'center',gap:16,marginTop:10,paddingTop:10,borderTop:'1px solid #F2F3F8',fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <span style={{width:10,height:10,background:'#4285F4',borderRadius:2}}/> Engaged (has completed tasks)
        </span>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <span style={{width:10,height:10,background:'repeating-linear-gradient(135deg, #CFD6E4 0 3px, #E1E6F0 3px 6px)',borderRadius:2}}/> Registered · not yet engaged
        </span>
        <span style={{marginLeft:'auto',color:'#6F7482'}}>
          Start.AI coverage · 8 countries · 30,600 labellers tracked
        </span>
      </div>
    </div>
  );
}

window.RegionActivation = RegionActivation;
