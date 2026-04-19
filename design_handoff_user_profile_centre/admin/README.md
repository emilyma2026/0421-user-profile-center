# Admin Portal — UI Kit

Hi-fi recreation of the **Management Portal** for Start.ai supply operators,
built against the spec in `uploads/[WIP] Start.ai User Profile Centre.pdf`
(§6 Product Design — Management Portal).

## What's built

### `6.2.1 Pool Health Overview` — complete ✅
The dashboard home. At-a-glance view of the entire labeller pool.

- **KPI strip** — 6 cards with sparklines: Total, Active 7d, Activation rate,
  30d retention, Avg accuracy, Avg daily hours
- **Coverage Radar** — 5-axis SVG (Language / Geography / Skill Tier /
  Availability / Engagement) with green/yellow/red severity coding per spec.
  Toggle between radar + ranked-list views
- **Lifecycle Funnel** — horizontal bars: Registered → Onboarded → Activated
  → Engaged → Churned, with inter-stage conversion rates + drop-off callout
- **Lifecycle Distribution** — donut showing current stage mix
- **Gap Alerts preview** — top 3 ranked alerts with severity dots and
  AI-recommended action buttons (full module in §6.2.3)
- **Drill-down modal** — opens on any coverage axis or gap alert, shows
  breakdown + auto-generated campaign brief

### Other tabs — stubs (by design)
User Explorer, Gap Alerts (full), Analytics, Campaigns are placeholders
until Pool Health is locked. See §6.2.2 – §6.2.4 in the PDF.

## Files
- `index.html` — entry point
- `Shell.jsx` — sidebar nav + top bar (search, date range, segment, notifications)
- `ModuleTabs.jsx` — five-tab switcher matching the reference sketch
- `KpiStrip.jsx` — KPI card cluster with sparklines
- `CoverageRadar.jsx` — radar + companion list component
- `LifecycleFunnel.jsx` — funnel + drop-off callout
- `Panels.jsx` — Lifecycle donut, Gap alert rows, availability breakdown
- `DrillDownModal.jsx` — axis / gap drill-down
- `PoolHealthOverview.jsx` — page composition
- `OtherModules.jsx` — stubs

## Interactions
- Tab switching (persists in localStorage)
- Radar ↔ List view toggle on Coverage
- Date range pills (7d / 30d / 90d / QTD / YTD)
- Click any coverage axis **or** gap alert → drill-down modal with
  recommended campaign
