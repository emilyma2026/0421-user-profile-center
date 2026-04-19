// Minimal stubs for the other four sub-modules under User Profile Centre.
// Full designs live in separate files once Pool Health is locked.

function Stub({ title, summary, children }) {
  return (
    <div style={{padding:24}}>
      <div style={{fontFamily:'DM Sans',fontSize:17,fontWeight:700,color:'#111125'}}>{title}</div>
      <div style={{fontFamily:'DM Sans',fontSize:12.5,color:'#6F7482',marginTop:2}}>{summary}</div>
      <div style={{marginTop:18, padding:'44px 24px', background:'#fff', border:'1px dashed #D6D9E1', borderRadius:12, textAlign:'center'}}>
        <div style={{width:44,height:44,borderRadius:10,background:'#EAF1FE',display:'inline-grid',placeItems:'center',marginBottom:10}}>
          <Icon name="sparkle" size={20} color="#4285F4"/>
        </div>
        <div style={{fontFamily:'DM Sans',fontSize:15,fontWeight:600,color:'#111125'}}>In design</div>
        <div style={{fontFamily:'DM Sans',fontSize:13,color:'#6F7482',marginTop:4,maxWidth:520,marginInline:'auto'}}>{children}</div>
      </div>
    </div>
  );
}

window.ExplorerStub  = () => <Stub title="User Explorer" summary="Segment builder, filter stack, and individual profile drill-downs.">Advanced filter + segment builder with inherent / lifecycle / performance / behavioural / predictive facets (§6.2.2). Next up.</Stub>;
window.GapsStub      = () => <Stub title="Gap Alerts" summary="All ranked supply–demand mismatches with recommended actions.">Expanded from the overview preview — gap scoring logic, affected projects, campaign recommendations (§6.2.3).</Stub>;
window.AnalyticsStub = () => <Stub title="Analytics & Insights" summary="Cohort retention, funnel analysis, segment comparison, X→Y explorer.">Cohort curves, funnel conversion rates, and feature-importance / SHAP visualisations (§6.2.4).</Stub>;
window.CampaignsStub = () => <Stub title="Campaign Management" summary="Recommended campaigns, performance tracking, A/B test configuration.">Auto-generated briefs feed directly from gap detection output.</Stub>;
