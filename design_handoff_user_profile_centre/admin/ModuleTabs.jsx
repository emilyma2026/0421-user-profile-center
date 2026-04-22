// Five-tab module switcher — matches the rounded-capsule "Project Overview"
// tab row in the ref. Simpler: underlined blue for active, gray for inactive.
function ModuleTabs({ active, onChange }) {
  const tabs = [
    { key:'overview',  label:'Pool Health Overview' },
    { key:'explorer',  label:'User Explorer' },
    { key:'gaps',      label:'Alerts',           badge:4 },
  ];
  return (
    <div style={{
      display:'flex', gap:0, padding:'0 24px', background:'#fff',
      borderBottom:'1px solid #E9ECF3', flexShrink:0
    }}>
      {tabs.map(t=>{
        const isActive = t.key === active;
        return (
          <button key={t.key} onClick={()=>onChange(t.key)} style={{
            position:'relative', padding:'13px 2px', marginRight:26, border:0, background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', gap:8,
            fontFamily:'DM Sans', fontSize:13.5, fontWeight: isActive ? 600 : 500,
            color: isActive ? '#4285F4' : '#6F7482',
          }}>
            {t.label}
            {t.badge && (
              <span style={{
                background: isActive ? '#F44336' : '#F2F3F8',
                color: isActive ? '#fff' : '#6F7482',
                fontFamily:'DM Sans', fontSize:10, fontWeight:600,
                borderRadius:999, padding:'1px 6px'
              }}>{t.badge}</span>
            )}
            {isActive && <span style={{position:'absolute',left:0,right:0,bottom:-1,height:2,background:'#4285F4',borderRadius:2}}/>}
          </button>
        );
      })}
    </div>
  );
}
window.ModuleTabs = ModuleTabs;
