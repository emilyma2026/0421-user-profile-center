// Admin portal shell — light theme, matches the existing Start.ai admin UI
// (white sidebar, blue active state, lavender-gray page background).

const NAV_SECTIONS = [
  { label:null, items:[
    { key:'budget',   label:'Budget Management',  icon:'wallet' },
    { key:'project',  label:'Project Management', icon:'folder', chev:true },
  ]},
  { label:null, items:[
    { key:'userprofile', label:'User Profile Centre', icon:'users', expanded:true, children:[
      { key:'overview',  label:'Pool Health',        isLeaf:true },
      { key:'explorer',  label:'User Explorer',      isLeaf:true },
      { key:'gaps',      label:'Gap Alerts',         isLeaf:true, badge:4 },
    ]},
  ]},
  { label:null, items:[
    { key:'dataset',  label:'Dataset Management', icon:'database' },
    { key:'queue',    label:'Queue Management',   icon:'layers',   chev:true },
  ]},
];

const Icon = ({name, size=18, color='currentColor'}) => {
  const common = {width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:color,strokeWidth:1.6,strokeLinecap:'round',strokeLinejoin:'round'};
  switch(name){
    case 'wallet':   return <svg {...common}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/></svg>;
    case 'users':    return <svg {...common}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.8-3.2 3-5 6-5s5.2 1.8 6 5"/><circle cx="17" cy="7" r="2.5"/><path d="M15 14.5c2.5 0 4.5 1.2 5 4"/></svg>;
    case 'folder':   return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>;
    case 'database': return <svg {...common}><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>;
    case 'layers':   return <svg {...common}><path d="M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 18l9 5 9-5"/></svg>;
    case 'bell':     return <svg {...common}><path d="M6 15V10a6 6 0 0 1 12 0v5l1.5 2h-15L6 15z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
    case 'chevron-down': return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case 'chevron-right':return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case 'download': return <svg {...common}><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>;
    case 'filter':   return <svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>;
    case 'refresh':  return <svg {...common}><path d="M4 12a8 8 0 0 1 13.6-5.7L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.6 5.7L4 15M4 20v-5h5"/></svg>;
    case 'info':     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>;
    case 'arrow-right': return <svg {...common}><path d="M5 12h14m-5-5 5 5-5 5"/></svg>;
    case 'sparkle':  return <svg {...common}><path d="M12 3l1.8 4.7L18 9l-4.2 1.3L12 15l-1.8-4.7L6 9l4.2-1.3L12 3z"/></svg>;
    case 'alert':    return <svg {...common}><path d="M12 3l10 17H2L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="17.5" r=".6" fill={color}/></svg>;
    case 'help':     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4"/><circle cx="12" cy="17" r=".8" fill={color}/></svg>;
    case 'mail':     return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'globe':    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>;
    case 'tag':      return <svg {...common}><path d="M3 12V3h9l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5" fill={color}/></svg>;
    case 'search':   return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'plus':     return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'x':        return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'check':    return <svg {...common}><path d="m4 12 5 5 11-12"/></svg>;
    case 'play':     return <svg {...common}><path d="M6 4l14 8-14 8V4z"/></svg>;
    case 'pause':    return <svg {...common}><path d="M7 4v16M17 4v16"/></svg>;
    case 'sliders':  return <svg {...common}><path d="M4 6h10M20 6h0M4 12h4M14 12h6M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="11" cy="12" r="2"/><circle cx="18" cy="18" r="2" fill="none"/></svg>;
    case 'trending-up':return <svg {...common}><path d="m3 17 6-6 4 4 8-8M15 7h6v6"/></svg>;
    case 'trending-down':return <svg {...common}><path d="m3 7 6 6 4-4 8 8M15 17h6v-6"/></svg>;
    case 'target':   return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill={color}/></svg>;
    case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'beaker':   return <svg {...common}><path d="M9 3h6M10 3v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3M7 14h10"/></svg>;
    case 'trash':    return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>;
    case 'copy':     return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>;
    default: return null;
  }
};

function Sidebar({ active, onNavigate }) {
  const isLeafActive = (k) => k === active;

  return (
    <aside style={{
      width:224, flexShrink:0, background:'#FFFFFF', color:'#2C2C2C',
      display:'flex', flexDirection:'column', borderRight:'1px solid #E9ECF3',
    }}>
      <div style={{padding:'16px 18px 14px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #F2F3F8'}}>
        <img src="./assets/logo-full.png" alt="start.ai" style={{height:22, width:'auto'}}/>
      </div>

      <nav style={{padding:'10px 10px', display:'flex', flexDirection:'column', gap:2, overflow:'auto', flex:1}}>
        {NAV_SECTIONS.map((sec, si) => (
          <React.Fragment key={si}>
            {sec.items.map(item => {
              if (item.children) {
                const hasActiveChild = item.children.some(c => c.key === active);
                return (
                  <div key={item.key}>
                    <button style={{
                      width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                      background: hasActiveChild ? '#EAF1FE' : 'transparent',
                      color: hasActiveChild ? '#4285F4' : '#4A5160',
                      border:0, borderRadius:8, textAlign:'left', cursor:'pointer',
                      fontFamily:'DM Sans', fontSize:13.5, fontWeight: hasActiveChild ? 600 : 500,
                    }}>
                      <Icon name={item.icon} size={16} color={hasActiveChild?'#4285F4':'#6F7482'}/>
                      <span style={{flex:1}}>{item.label}</span>
                      <Icon name="chevron-down" size={13} color={hasActiveChild?'#4285F4':'#9AA2B1'}/>
                    </button>
                    <div style={{display:'flex', flexDirection:'column', padding:'4px 0 4px 18px'}}>
                      {item.children.map(c => {
                        const on = isLeafActive(c.key);
                        return (
                          <button key={c.key} onClick={()=>onNavigate(c.key)} style={{
                            position:'relative',
                            display:'flex', alignItems:'center', gap:10, padding:'7px 12px 7px 14px',
                            background:'transparent', color: on ? '#4285F4' : '#6F7482',
                            border:0, borderRadius:6, textAlign:'left', cursor:'pointer',
                            fontFamily:'DM Sans', fontSize:13, fontWeight: on ? 600 : 500,
                          }}>
                            {on && <span style={{position:'absolute',left:0,top:4,bottom:4,width:2,background:'#4285F4',borderRadius:2}}/>}
                            <span style={{flex:1}}>{c.label}</span>
                            {c.badge && (
                              <span style={{
                                fontFamily:'DM Sans', fontSize:10, fontWeight:600, color:'#fff',
                                background:'#F44336', borderRadius:999, padding:'1px 6px', minWidth:16, textAlign:'center'
                              }}>{c.badge}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <button key={item.key} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                  background:'transparent', color:'#4A5160',
                  border:0, borderRadius:8, textAlign:'left', cursor:'pointer',
                  fontFamily:'DM Sans', fontSize:13.5, fontWeight:500,
                }}>
                  <Icon name={item.icon} size={16} color="#6F7482"/>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.chev && <Icon name="chevron-down" size={13} color="#9AA2B1"/>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}

function TopBar() {
  return (
    <header style={{
      height:54, padding:'0 24px', background:'#FFFFFF', borderBottom:'1px solid #E9ECF3',
      display:'flex', alignItems:'center', gap:12, flexShrink:0
    }}>
      <div style={{flex:1}}/>

      <TopBarDropdown icon={<span style={{width:7,height:7,borderRadius:99,background:'#4285F4'}}/>} label="Moderating" />
      <TopBarDropdown label="DCC" />
      <TopBarDropdown icon={<Icon name="globe" size={14} color="#6F7482"/>} label="UTC +8" />

      <div style={{width:1,height:20,background:'#E9ECF3',margin:'0 4px'}}/>

      <IconBtn><Icon name="help" size={18} color="#4A5160"/></IconBtn>
      <IconBtn><Icon name="mail" size={18} color="#4A5160"/></IconBtn>

      <div style={{width:32,height:32,borderRadius:99,background:'linear-gradient(180deg,#71D9D9,#3160B7)',display:'grid',placeItems:'center',fontFamily:'Jost',fontSize:12,fontWeight:600,color:'#fff'}}>LC</div>
    </header>
  );
}
function TopBarDropdown({ icon, label }) {
  return (
    <button style={{
      display:'inline-flex', alignItems:'center', gap:8, padding:'6px 10px 6px 10px',
      border:'1px solid #E1E4EC', borderRadius:8, background:'#fff', cursor:'pointer',
      fontFamily:'DM Sans', fontSize:13, fontWeight:500, color:'#2C2C2C', minWidth:120
    }}>
      {icon}
      <span style={{flex:1, textAlign:'left'}}>{label}</span>
      <Icon name="chevron-down" size={13} color="#9AA2B1"/>
    </button>
  );
}
function IconBtn({ children }) {
  return (
    <button style={{
      width:34,height:34,borderRadius:8,border:0,background:'transparent',cursor:'pointer',
      display:'grid',placeItems:'center'
    }}>{children}</button>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
window.Icon = Icon;
