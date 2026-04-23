// Trends strip — 4 cards: Total Labellers, Retention, Activation Rate, Avg Daily Hours

const TRENDS_DATA = [
  { label:'Total Labellers',  value:'12,400', delta:'+3.2%',  deltaDir:'up',   sub:'vs prior 30d' },
  { label:'Total Task Count',  value:'284,610', delta:'+5.8%',  deltaDir:'up',   sub:'vs prior 30d' },
  { label:'Activation Rate',  value:'41.1%',  delta:'+1.4pp', deltaDir:'up',   sub:'Onboarded → Activated' },
  { label:'Avg Daily Hours',  value:'3.2h',   delta:'+0.1h',  deltaDir:'up',   sub:'Active labellers' },
];

function Sparkline({ points, color='#4285F4', height=26, width=70 }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = Math.max(max - min, 0.0001);
  const step = width / (points.length - 1);
  const path = points.map((p,i)=>{
    const x = i*step;
    const y = height - ((p-min)/range)*(height-4) - 2;
    return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = path + ` L${width},${height} L0,${height} Z`;
  const gid = `sg-${color.replace('#','')}-${Math.random().toString(36).slice(2,6)}`;
  return (
    <svg width={width} height={height} style={{overflow:'visible'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function KpiCard({ label, value, delta, deltaDir, sub, sparkPoints, sparkColor }) {
  const deltaColor = deltaDir === 'up' ? '#22C55E' : '#F44336';
  return (
    <div style={{
      flex:1, background:'#fff', border:'1px solid #E9ECF3', borderRadius:10,
      padding:'16px 18px', display:'flex', flexDirection:'column', gap:8, minWidth:0,
    }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <span style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',fontWeight:500}}>{label}</span>
        <Icon name="info" size={13} color="#BEC5D0"/>
      </div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:8}}>
        <span style={{fontFamily:'Jost',fontSize:28,fontWeight:500,color:'#111125',letterSpacing:'-.01em',lineHeight:1}}>{value}</span>
        <Sparkline points={sparkPoints} color={sparkColor}/>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,fontFamily:'DM Sans',fontSize:11.5}}>
        <span style={{color:deltaColor,fontWeight:600,display:'inline-flex',alignItems:'center',gap:2}}>
          {deltaDir==='up'?'▲':'▼'} {delta}
        </span>
        <span style={{color:'#9AA2B1'}}>{sub}</span>
      </div>
    </div>
  );
}

function TrendsStrip() {
  const sparks = [
    [3,4,3,5,6,5,7,8,9,8,10,11],
    [210,218,224,230,238,242,250,255,261,268,275,284],
    [30,32,34,33,36,38,37,39,40,41,40,41],
    [2.8,2.9,3.0,3.1,3.0,3.1,3.2,3.1,3.2,3.2,3.3,3.2],
  ];
  return (
    <div style={{display:'flex',gap:12}}>
      {TRENDS_DATA.map((k,i)=>(
        <KpiCard key={k.label} {...k} sparkPoints={sparks[i]} sparkColor="#4285F4"/>
      ))}
    </div>
  );
}

// Keep KpiStrip alias for backward compatibility
window.KpiStrip = TrendsStrip;
window.TrendsStrip = TrendsStrip;
window.Sparkline = Sparkline;
