// Coverage Radar — 5-axis radar from §6.2.1:
// Language / Geography / Skill Tier / Availability / Engagement
// Actual supply / Ideal supply ratio per dimension. Colour rules:
// Green >80%, Yellow 50–80%, Red <50%.

const COVERAGE = [
  { axis:'Language',    actual:82, ideal:100, tooltip:'21 of 24 target languages ≥ threshold coverage' },
  { axis:'Geography',   actual:61, ideal:100, tooltip:'APAC strong; LATAM & SSA under-indexed' },
  { axis:'Skill Tier',  actual:78, ideal:100, tooltip:'L2 healthy; L3 shortage in Legal QA project' },
  { axis:'Availability',actual:34, ideal:100, tooltip:'Weekend + APAC evening windows thin' },
  { axis:'Engagement',  actual:55, ideal:100, tooltip:'30d active rate below Q2 target (70%)' },
];

function colorFor(v) {
  if (v >= 80) return '#22C55E';
  if (v >= 50) return '#F59E0B';
  return '#F44336';
}

function CoverageRadar() {
  const size = 360;
  const cx = size/2, cy = size/2;
  const R = 125;
  const N = COVERAGE.length;
  const ring = (r) => {
    // regular polygon path
    return Array.from({length:N}).map((_,i)=>{
      const a = (-Math.PI/2) + i*(2*Math.PI/N);
      return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
    });
  };
  const toPath = (pts) => pts.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+' Z';
  const rings = [0.25,0.5,0.75,1].map(f=>ring(R*f));
  const actualPts = ring(R).map((p,i)=>{
    const f = COVERAGE[i].actual/100;
    const a = (-Math.PI/2) + i*(2*Math.PI/N);
    return [cx + R*f*Math.cos(a), cy + R*f*Math.sin(a)];
  });
  const labelPts = ring(R+30);

  return (
    <div>
      <svg width={size} height={size} style={{display:'block',margin:'0 auto'}}>
        <defs>
          <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4285F4" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#4285F4" stopOpacity="0.08"/>
          </linearGradient>
          <linearGradient id="radar-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3160B7"/>
          </linearGradient>
        </defs>

        {/* concentric rings */}
        {rings.map((pts,i)=>(
          <path key={i} d={toPath(pts)} fill={i===rings.length-1?'#F8F9FC':'none'} stroke="#E1E1E1" strokeWidth="1"/>
        ))}
        {/* axes */}
        {ring(R).map((p,i)=>(
          <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#E9E9E9" strokeWidth="1"/>
        ))}
        {/* ring % labels on the top axis */}
        {[0.25,0.5,0.75,1].map((f,i)=>(
          <text key={i} x={cx+4} y={cy - R*f + 3} fontFamily="Jost" fontSize="9" fill="#BEC5D0">{f*100}%</text>
        ))}

        {/* actual polygon */}
        <path d={toPath(actualPts)} fill="url(#radar-fill)" stroke="url(#radar-stroke)" strokeWidth="2" strokeLinejoin="round"/>
        {/* vertex dots */}
        {actualPts.map((p,i)=>(
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="5" fill="#fff" stroke={colorFor(COVERAGE[i].actual)} strokeWidth="2"/>
          </g>
        ))}

        {/* labels */}
        {labelPts.map((p,i)=>{
          const c = COVERAGE[i];
          const anchor = p[0] < cx - 4 ? 'end' : p[0] > cx + 4 ? 'start' : 'middle';
          return (
            <g key={i}>
              <text x={p[0]} y={p[1]-4} textAnchor={anchor} fontFamily="Jost" fontSize="12" fontWeight="500" fill="#111125">{c.axis}</text>
              <text x={p[0]} y={p[1]+10} textAnchor={anchor} fontFamily="DM Sans" fontSize="12" fontWeight="600" fill={colorFor(c.actual)}>{c.actual}%</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// List form (matches the low-fi reference sketch) — useful as a companion breakdown.
function CoverageList({ onDrill }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {COVERAGE.map((c)=>{
        const color = colorFor(c.actual);
        return (
          <button key={c.axis} onClick={()=>onDrill && onDrill(c)} style={{
            display:'grid', gridTemplateColumns:'110px 1fr 48px', alignItems:'center', gap:12,
            background:'transparent', border:0, padding:0, textAlign:'left', cursor:'pointer'
          }}>
            <div style={{fontFamily:'DM Sans',fontSize:13,color:'#2C2C2C',fontWeight:500}}>{c.axis}</div>
            <div style={{position:'relative',height:10,borderRadius:999,background:'#F2F3F8',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,width:`${c.actual}%`,background:color,borderRadius:999,transition:'width .6s cubic-bezier(.2,0,0,1)'}}/>
              <div style={{position:'absolute',top:0,bottom:0,left:'80%',width:1,background:'rgba(17,17,37,.12)'}}/>
            </div>
            <div style={{fontFamily:'Jost',fontSize:13,fontWeight:500,color:color,textAlign:'right'}}>{c.actual}%</div>
          </button>
        );
      })}
      <div style={{display:'flex',alignItems:'center',gap:14,marginTop:6,fontFamily:'DM Sans',fontSize:11,color:'#6F7482'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}><span style={{width:9,height:9,background:'#22C55E',borderRadius:2}}/>Healthy (&gt;80%)</span>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}><span style={{width:9,height:9,background:'#F59E0B',borderRadius:2}}/>Warning (50–80%)</span>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}><span style={{width:9,height:9,background:'#F44336',borderRadius:2}}/>Critical (&lt;50%)</span>
      </div>
    </div>
  );
}

window.CoverageRadar = CoverageRadar;
window.CoverageList = CoverageList;
window.COVERAGE_DATA = COVERAGE;
