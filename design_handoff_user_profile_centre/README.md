# Handoff: Start.ai — User Profile Centre (Admin Portal)

## Overview
The **User Profile Centre** is a 5-module admin console for Start.ai's internal ops team (§6 of the PRD). It replaces the current "fly-blind" labeller management with a data-driven system for understanding, segmenting, and actioning the 30,000+ labeller supply pool across 8 countries.

The five modules:
1. **Pool Health Overview** (§6.2.1) — at-a-glance KPIs, coverage radar, lifecycle funnel, gap alerts, regional activation
2. **User Explorer** (§6.2.2) — segment builder + faceted filters + individual profile drill-downs
3. **Gap Alerts** (§6.2.3) — ranked supply-vs-demand mismatches with transparent scoring and auto-generated campaign briefs
4. **Analytics & Insights** (§6.2.4) — cohort retention, funnel analysis, segment comparison, X→Y correlation explorer, zombie analysis
5. **Campaign Management** (§6.2.5) — recommended / active / history tabs with A/B test tracking

## About the Design Files
The files in this bundle are **design references created in HTML + inline React (Babel standalone)**. They are prototypes showing intended look, layout, data shapes, and interactions — **not production code to copy directly**.

The task is to **recreate these designs in Start.ai's existing codebase** (whatever framework — React, Vue, etc.) using the team's established component library, data-fetching patterns, and design system. All the React in these files uses inline styles and dummy data so it's inspectable without a build step; real code should use the app's CSS methodology (CSS Modules / Tailwind / styled-components / etc.) and hook into real APIs.

If no frontend exists yet for this portal, React + TypeScript + a component library (shadcn/ui, Mantine, or MUI) would be a reasonable starting point — the designs are built in React patterns that translate directly.

## Fidelity
**High-fidelity.** All tokens (colors, typography, spacing) match Start.ai's existing design system (`colors_and_type.css`). Layouts, component anatomy, and hover/active states are final. Data is dummy but shaped to match real API responses described in the PRD (e.g. `users`, `gaps`, `campaigns` with the exact fields the spec calls for).

Developer should recreate these UIs **pixel-close** using the codebase's existing primitives. Small polish tweaks (icon weights, exact border-radius, etc.) are fine to inherit from the app's component library.

---

## Screens / Views

### 1. Shell (persistent chrome)
**Left sidebar** (width 240px, background `#FFFFFF`, border-right `1px solid #E9ECF3`)
- Start.ai logo top (28px height, 16px horizontal padding)
- Navigation groups: Project Management, User Profile Centre (expanded), Budget, Settings
- Active leaf: background `#EAF1FE`, text `#1E4FA8`, 3px blue left rail (`#4285F4`)
- Inactive: text `#2C2C2C`, hover bg `#F7F8FB`
- Sub-item indent 36px, font 13px DM Sans, 500 weight when active, 400 otherwise
- Icons 16px, stroke 1.6, color matches text

**Top bar** (height 56px, white bg, border-bottom `1px solid #E9ECF3`)
- Search bar left (width 320px, bg `#F5F6FA`, radius 8px)
- Right: notification bell, avatar, admin name

**Module tabs** (height 44px, white bg, 24px horizontal padding)
- Horizontal pill tabs with active pill `#EAF1FE` bg, `#1E4FA8` text, weight 600
- Inactive text `#6F7482`, weight 500
- Gap Alerts tab shows badge count (`4`) as red dot with number

Page content area: `#EEF1F8` bg (lavender-gray), scrollable.

### 2. Pool Health Overview (`PoolHealthOverview.jsx`)

**Layout:** vertical stack with 16px gap
1. Page header (title + date-range picker 7d/30d/90d/QTD/YTD + "Ask Assistant" primary button)
2. KPI strip — 6 cards in a 6-column grid
3. Row: Coverage Radar (1.05fr) | Lifecycle (1.2fr)
4. Row: Activation by Region (1.25fr) | Gap Alerts preview (1fr)

**KPI cards** (`KpiStrip.jsx`): each card is white bg, `1px solid #E9ECF3`, radius 12px, padding 16px. Contains:
- Label (DM Sans 11px uppercase, `#6F7482`, weight 600, letterspacing 0.04em)
- Value (Jost 24px, 500 weight, `#111125`, tabular-nums)
- Delta badge (green `#E8F6EC`/`#15803D` for positive, red `#FEECEB`/`#B42318` for negative, 10.5px DM Sans)
- Inline sparkline SVG (48×20px, stroke 1.5, color `#4285F4`)

KPIs tracked:
- Total labellers: 12,400
- Active 7d: 7,200 (+4.2%)
- Activation rate: 41% (-1.1pp)
- 30d retention: 32% (-2.4pp)
- Accuracy avg: 87.3%
- Avg time to first task: 4.2h

**Coverage Radar** (`CoverageRadar.jsx`):
- 5-axis radar SVG (280×280): Geography, Language, Expertise, Availability, Quality
- Ideal shape: `#CFE0FE` filled polygon
- Actual shape: `#4285F4` stroke, `rgba(66,133,244,0.25)` fill
- Grid rings at 20/40/60/80/100%
- Axis labels (Jost 12px, `#111125`)
- List view toggle top-right (Radar / List switch)
- Below radar: horizontal scroll list of dimension cards, click → opens DrillDownModal

**Lifecycle** (`LifecycleFunnel.jsx`) — combined card with 2 rows:
- Top row: Funnel bars (5 stages: Registered 12.4k → Onboarded 8.2k → Activated 5.1k → Engaged 3.8k → Churned 1.9k) with step conversion % | Stage Distribution donut (150px radius, blue-family palette + red for churned)
- Bottom row: Activation micro-funnel (6 bars: Registration → First login → Onboarding done → Exam pass → First task → Repeat task) | Zombie callout (9,200 dormant users, 74% PH, avg 47d) with "Recall campaign" + "Analyse" buttons

**Activation by Region** (`RegionActivation.jsx`):
- Table with 8 rows: Philippines, Thailand, Vietnam, Egypt, Indonesia, Mexico, Singapore, Malaysia
- Columns: flag + country, registered, activated, activation rate (with bar), avg hours/week, accuracy %
- Rows sorted by activation rate descending

**Gap Alerts preview** (`Panels.jsx`, `GapAlertPanel`):
- 3 stacked alert cards (critical / warning)
- Each: severity pill, type + dimension, title (Jost 14px), stat line, action button (primary blue)
- "View all 4 gap alerts" link at bottom → navigates to `gaps` tab

### 3. User Explorer (`UserExplorer.jsx`)

3-pane layout:
- **Left rail** (280px): Segment builder with 5 faceted filter groups (Inherent, Lifecycle, Performance, Behavioural, Predictive)
- **Center**: results table (name, archetype badge, country, activation date, accuracy, status) with checkbox column
- **Right drawer** (340px, shown when user selected): profile card with tier snapshot, 12-week sparkline trend, recent activity timeline, recommended nudges

Archetype badges (7 types from PRD §4.3): Ghost, Zombie, Tourist, Steady Earner, Power User, Drifter, Burnout. Each has unique color.

### 4. Gap Alerts full (`GapAlertsModule.jsx`)
- Ranked list of all gaps (4 in mock data)
- Each row expands to show: scoring transparency (severity × impact × feasibility breakdown), affected projects, recommended campaign brief, "Launch campaign" → campaigns tab

### 5. Analytics (`AnalyticsModule.jsx`)
Sub-tabs: Cohort Retention · Funnel · Segment Compare · X→Y Explorer · Zombie Analysis
- Cohort: line chart with retention curves for 4 cohorts
- Funnel: stage-by-stage conversion table + waterfall
- Segment Compare: 2-column comparison with diff indicators
- X→Y: feature importance bars + scatter plot
- Zombie: density histogram by days-since-registration

### 6. Campaigns (`CampaignsModule.jsx`)
Sub-tabs: Recommended · Active · History
- Recommended: 4 cards with priority badges, confidence meter, approve/edit/dismiss
- Active: expandable rows with A/B test panel (variant A vs B with acquired/CPA/CTR stats)
- History: table of past campaigns with outperformed/on-target/under-performed badges

---

## Interactions & Behavior
- **Tab persistence**: active module saved to `localStorage['startai-admin-tab']`
- **Navigation wiring** (from overview):
  - "View all 4 gap alerts" → gaps tab
  - "View all regions" → explorer tab
  - "Recall campaign" (zombie callout) → campaigns tab
  - "Analyse" (zombie callout) → analytics tab
- **Drill-down modal**: opened by clicking coverage radar dimensions or gap alert rows; slides in from right (480px wide), click-outside to dismiss
- **Hover states**: table rows get `#F7F8FB` bg; cards get `0 2px 8px rgba(32,32,58,0.06)` shadow
- **Bar transitions**: funnel/micro-funnel bars animate width from 0 to final over 600ms cubic-bezier(.2,0,0,1) on mount
- **Toast**: campaign approval shows dark pill toast bottom-right for 2.2s

## State Management
- `tab: 'overview' | 'explorer' | 'gaps' | 'analytics' | 'campaigns'` — root selected module
- `range: '7d' | '30d' | '90d' | 'QTD' | 'YTD'` — date range for overview metrics
- `drill: { kind: 'coverage' | 'gap', data: object } | null` — drill-down modal
- Per-module local state (filters, selected user, sub-tab, etc.)

Real implementation needs:
- `GET /admin/pool-health?range={range}` — KPIs, coverage, lifecycle, regions
- `GET /admin/users?filters={...}&cursor={...}` — paginated explorer list
- `GET /admin/users/:id` — profile card
- `GET /admin/gaps` — ranked gap alerts
- `GET /admin/analytics/cohort?type=retention` (+ funnel, compare, xy, zombie variants)
- `GET /admin/campaigns?status={recommended|active|history}`
- `POST /admin/campaigns` — launch campaign from recommendation
- `POST /admin/campaigns/:id/promote-variant` — winner promotion

## Design Tokens

### Colors
Primary palette:
- `--blue-500 #4285F4` — brand primary
- `--blue-700 #1E4FA8` — active text
- `--blue-50  #EAF1FE` — active bg, secondary fills
- `--blue-100 #DBE9FF` — borders on blue surfaces
- `--blue-200 #CFE0FE` — lighter fills, radar ideal shape

Neutrals:
- `--bg-page      #EEF1F8`
- `--bg-surface   #FFFFFF`
- `--bg-muted     #F7F8FB`
- `--bg-subtle    #FAFBFD`
- `--border       #E9ECF3`
- `--border-soft  #F2F3F8`
- `--border-strong #E1E4EC`
- `--text-primary #111125`
- `--text-body    #2C2C2C`
- `--text-muted   #6F7482`

Semantic:
- Success: `#22C55E` (fill) · `#E8F6EC` (bg) · `#15803D` (text) · `#BBE7C6` (border)
- Warning: `#F59E0B` (fill) · `#FFF8E6` (bg) · `#6B4F11` (text) · `#F7E1A7` (border)
- Danger:  `#F44336` (fill) · `#FEECEB` (bg) · `#B42318` (text) · `#F9C4C0` (border)

### Typography
- **Display / Numeric / Labels**: Jost (400, 500, 700)
- **Body / UI**: DM Sans (400, 500, 600, 700)
- Scale: 10.5 / 11 / 11.5 / 12 / 12.5 / 13 / 14 / 15 / 17 / 20 / 24px
- Always use `fontVariantNumeric: 'tabular-nums'` for numeric KPI values

### Spacing
4px base. Common: 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 24 px. Card padding 16/20px. Page padding 24px.

### Border Radius
- 6px (small controls)
- 7px (buttons, inputs)
- 8px (chips, input groups)
- 10px (rows, small cards)
- 12px (cards, sections)
- 99/999px (pills, bars, dots)

### Shadow
- `0 1px 2px rgba(32,32,58,0.08)` — active pill
- `0 2px 8px rgba(32,32,58,0.06)` — card hover
- `0 12px 32px rgba(0,0,0,0.2)` — toast

## Assets
- Start.ai logo (`/assets/logo-full.png`) — light mode, 588×230 master art
- No custom icons — all icons rendered inline as SVG in `Shell.jsx::Icon` component (passes through a switch on name → 24×24 stroke paths). Icon names used: `search`, `bell`, `filter`, `download`, `sparkle`, `refresh`, `chevron-right`, `chevron-down`, `arrow-right`, `alert`, `plus`, `x`, `check`, `users`, `activity`, `layers`, `target`, `graduation`, `archive`, `play`, `pause`, `sliders`

Real implementation should swap the inline Icon switch for a proper icon library (Lucide, Phosphor, Heroicons) using the same names — the names chosen match Lucide.

## Files Included

### Root tokens
- `colors_and_type.css` — design token CSS variables

### Module source (`admin/`)
- `index.html` — entry point (React + Babel standalone + script loads)
- `Shell.jsx` — Sidebar + TopBar + Icon set
- `ModuleTabs.jsx` — top-level tab bar
- `KpiStrip.jsx` — KPI card row
- `CoverageRadar.jsx` — radar chart + dimension list
- `LifecycleFunnel.jsx` — funnel bars + donut + micro-funnel + zombie callout
- `RegionActivation.jsx` — 8-country activation table
- `Panels.jsx` — Gap alert preview rows + availability breakdown
- `DrillDownModal.jsx` — right-side drill drawer
- `PoolHealthOverview.jsx` — overview page composition
- `UserExplorer.jsx` — §6.2.2 module
- `GapAlertsModule.jsx` — §6.2.3 module
- `AnalyticsModule.jsx` — §6.2.4 module
- `CampaignsModule.jsx` — §6.2.5 module
- `OtherModules.jsx` — stubs (unused; kept for reference)

### Standalone reference
- `Pool-Health-Admin.standalone.html` — single-file bundle (all JSX inlined) — open in any browser to see the full prototype running

## How to preview the prototype locally
1. Open `Pool-Health-Admin.standalone.html` in any modern browser — that's the fastest path.
2. Or serve the `admin/` folder with a simple HTTP server (`python -m http.server` etc.) and open `index.html`. You cannot open `index.html` directly via `file://` because Babel standalone won't load JSX files cross-origin.
