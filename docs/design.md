# Site design document

Living spec for [danielmendoza.io](https://danielmendoza.io). One visual system, two layouts: a spacious public site and a denser dashboard HUD.

**Audience:** engineering managers, recruiters, other developers.

**References:** Cyberpunk 2077 HUD and UI — clipped panels, tracked labels, readout numbers, chrome frames. Mood: technical, minimal, efficient. Not noisy, not maximalist neon.

---

## 1. Overall design and theme

### Principles

- One look across the site. Dashboard uses the same tokens, type, and chrome, with a tighter layout.
- Prefer structure and restraint over decoration. HUD details (notches, tracking, uppercase labels) do the world-building.
- Public pages breathe. Dashboard packs information into a grid.
- Every route and tab has an enter animation and an exit animation. Some pages add extra motion on top of that.

### Color

Keep the current palette for now.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#fafafa` | `#0a0a0a` | Page ground |
| `--fg` | `#171717` | `#fafafa` | Primary text |
| `--muted` | `#737373` | `#a3a3a3` | Labels, secondary copy |
| `--border` | `#e5e5e5` | `#262626` | Frames, rules |
| `--accent` | `#2563eb` | `#3b82f6` | Active, CTA, chart, focus |
| `--accent-fg` | `#ffffff` | `#ffffff` | Text on accent |
| `--card` | `#ffffff` | `#171717` | Panel fill |

Dark is the canonical HUD look. Light follows the same rulesets when `prefers-color-scheme: light`.

Focus ring: 2px accent, 2px offset. Selection: accent at 25% over `--fg`.

### Breakpoints

Named viewports used in this spec. Map to Tailwind as listed.

| Name | Width | Tailwind | Typical use |
| --- | --- | --- | --- |
| **XSM** | `< 640px` | default | Stacked layout, icon-first chrome |
| **SM** | `≥ 640px` | `sm` | Two-column starts where density allows |
| **MD** | `≥ 768px` | `md` | Header switches from compact to full nav; content max-width `md:max-w-4xl` |
| **L** | `≥ 1024px` | `lg` | Full HUD grid; public content max-width `lg:max-w-7xl` |

Header compact/nav switch already uses MD (`max-width: 767px`).

### Typography rulesets

Four families stay in play. Apply them through named rulesets, not ad-hoc font classes.

| Family | Utility | Character |
| --- | --- | --- |
| BBH Bartle | `bartle` | Identity / display |
| Orbitron | `orbitron` | HUD titles and numeric readouts |
| Rajdhani | `rajdhani` | HUD labels, tabs, controls |
| Varela | `varela` / `--font-sans` | Body, bullets, prose |

#### Rulesets

Use these names in UI copy and implementation. Do not invent parallel styles.

| Ruleset | Font | Size / tracking / weight | Transform | Use on |
| --- | --- | --- | --- | --- |
| **Identity** | Bartle | Large display, tight leading | none | Home name, logo wordmark |
| **HudTitle** | Orbitron | `text-lg`–`text-3xl`, bold, tight tracking | none | Chart titles, stat values, dashboard page title |
| **HudLabel** | Rajdhani | `text-xs`, weight 600, `tracking-[0.2em]`–`[0.28em]` | uppercase | Stat labels, range buttons, HUD chrome, tab chrome |
| **HudMeta** | Rajdhani | `text-xs`–`text-sm`, muted | none or uppercase | Subtitles, last-updated, empty/error overlay copy |
| **SectionTitle** | Orbitron or Bartle (page-dependent) | `text-lg`–`text-xl`, semibold | none | About section headers if needed |
| **Body** | Varela | `text-sm`–`text-base`, relaxed leading | none | About summary, experience bullets |
| **BodySmall** | Varela | `text-xs`–`text-sm`, muted | none | Periods, locations, helper text |
| **Control** | Rajdhani | `text-xs`–`text-sm`, semibold, wide tracking | uppercase | Buttons, HUD nav, download CTA |

Numeric values always use **HudTitle**. Frame labels always use **HudLabel**. Narrative copy always uses **Body**.

### Chrome

Shared HUD language:

- Notched / clipped panels (`card-shape`, `CyberBox`).
- Thin stroke frames; accent fill and corner indicators on hover, focus, and active.
- Glass fill (`bg-glass`) on panels.
- Uppercase tracked labels on chrome, not on body copy.

Public site: fewer panels, more open field. Dashboard: almost everything lives in a framed module.

### Motion

Required on every page and every tab:

1. **Enter** — content comes in when the route or tab is shown.
2. **Exit** — content plays out before the route or tab is left.

Existing timings to reuse: header `500ms`, home fade `600ms`, stagger `80ms`, card indicator `280ms`. Ease: cubic (`outCubic` in, `inCubic` out).

Page-specific extras (do not replace enter/exit):

- **Home:** logo morph, staggered nav/social fade.
- **About:** `AnimatedWords` on the summary; tab scene enter/exit.
- **Dashboard:** HUD modules enter as a grid (staggered), not one block fade.

Honor `prefers-reduced-motion`: keep opacity changes, drop travel and morph.

### Density

| Area | Density | Layout |
| --- | --- | --- |
| Public site | Spacious | Wide margins, one primary column, generous vertical rhythm |
| Dashboard | Structured / dense | Full-width HUD grid, tight module padding, more information per viewport |

---

## 2. Personal website content

### Job of the site

Show who Daniel Mendoza is, quickly, then make the resume easy to take away. The dashboard is a separate showcase of a data UI, not part of the hiring narrative.

Copy voice: **third person**, mixed with HUD chrome. Example: human summary in Body; labels, tabs, and CTAs in HudLabel/Control.

### Sitemap (v1)

| Route | Status | Notes |
| --- | --- | --- |
| `/` | Live | Name is enough. Existing socials stay. |
| `/about` | Live | Keep current structure. Resume download more prevalent. |
| `/dashboard` | Live | See section 3. |
| `/works` | Hidden | Do not ship empty. |
| `/blog` | Hidden | Do not ship empty. |

Nav matches this: Home, About, Dashboard (as today). Works and blog stay commented out.

### Home

- Primary content: **name** (Identity ruleset). No tagline required.
- Keep GitHub and LinkedIn.
- Keep existing home motion.
- Resume download should be easy to find from here as well as from chrome (see CTA).

### About

Keep as a living page, not a full resume scroll.

1. Third-person summary (`resume.summary`) with `AnimatedWords`.
2. Tabs: **Experience** (default), **Proficiency**.
3. Experience: short bullets, current data shape (company, role, period, location, bullets).
4. Proficiency: existing tier list.
5. Education, skills, and languages stay available through the current about/resume data — do not hide them if they already surface in proficiency or the PDF. Do not add a long single-page resume layout.

### Resume CTA

PDF download (`/resume.pdf`) must be more prevalent than a quiet header icon.

- Keep the existing header control.
- Treat it as a primary Control on About (and Home if it is not already obvious).
- Dashboard may keep the current HUD download control; it is not the hiring CTA.

### Contact

No new channels. Keep GitHub, LinkedIn, and resume download. No email requirement for v1.

### Out of scope (content)

- Blog index and posts in nav.
- Selected work / projects page.
- Expanding experience into long case studies.
- First-person rewrite of the summary.

---

## 3. Dashboard data

The dashboard is mostly a **showcase of a data HUD**, public, with real numbers. Same theme as the rest of the site; layout is denser and more instrument-like.

### Metrics (keep)

Always on the first screen:

| Module | Meaning |
| --- | --- |
| Lifetime unique visitors | Cloudflare unique visitors, all time |
| Unique visitors | Uniques for the selected range of that module |
| Page visits | Page views for the selected range of that module |
| Unique visitors chart | Bar series |
| Page visits chart | Line series, **separate module** |
| Last updated | `fetchedAt` from ingest, visible for transparency |

### Additional dimensions (v1)

| Module | Meaning |
| --- | --- |
| Top pages | Paths ranked by views |
| Countries | Requests or visits by country |
| Devices | Breakdown by device class (desktop / mobile / other as available) |

Each of the two timeseries charts keeps **its own** range control. Ranges stay **week / month / year / all**. Breakdown modules may share a range control or follow the same set; they must not be locked to a single global range if the charts are independent.

### Page frame

Dashboard is a full-viewport HUD, not the public content column (`md:max-w-4xl` / `lg:max-w-7xl` do not apply here).

| Constraint | Value | Notes |
| --- | --- | --- |
| Min width | `320px` | XSM floor. Horizontal scroll is not allowed. |
| Max width | `1440px` | Centered. Wider screens keep side gutter on `--bg`. |
| Min height | `100dvh` | Fills the viewport; extra grid rows may scroll below. |
| Target fit | `1440 × 900` | On **L**, default modules should fit without scrolling. |
| Page padding | `16px` | One grid unit on every breakpoint. |
| Module radius | none (clipped notches) | `CyberBox` chrome only. |

Header stays **outside** the grid: home (left), dashboard title (center), resume (right). Last updated is the first cell in the grid.

### Grid system

The canvas is a **12-column** CSS Grid. Rows are **not fixed** — the grid grows as modules are added (`grid-auto-rows`). Every row is **16px**.

```css
.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));
	grid-auto-rows: 16px;
	grid-auto-flow: row;
	column-gap: 16px;
	row-gap: 0;
}
```

| Token | Value | Meaning |
| --- | --- | --- |
| Columns | `12` | Equal `minmax(0, 1fr)` tracks |
| Row height | `16px` | `grid-auto-rows: 16px` |
| Row count | dynamic | Auto-placed; adding a module appends rows |
| Column gap | `16px` | One unit between columns |
| Row gap | `0` | So `span R` equals `R × 16px` exactly |
| Band gutter | `1` row | Full-width spacer (`col-span 12`, `row-span 1`) between bands |

Modules size by integer spans only. No sub-16px heights. A module’s used height is always `R × 16px`.

Do not use CSS `row-gap` for vertical rhythm — spanning rows includes gutters and would break the 16px math. Put a **1-row spacer** (`16px`) between bands instead.

```
L  (max 1440, 16px rows)
┌──────────────────────────────────────────────────────────────┐
│  [ HOME ]               DASHBOARD               [ RESUME ]   │  header (outside grid)
├──────────────────────────────────────────────────────────────┤
│  LAST UPDATED  2026-08-18 06:00 UTC                          │  12×2
│  (spacer)                                                    │  12×1
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │  4×6 each
│  │ lifetime │  │ uniques  │  │ visits   │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│  (spacer)                                                    │  12×1
│  ┌──────────────────────┐  ┌──────────────────────┐          │  6×22 each
│  │ unique visitors      │  │ page visits          │          │
│  │ [week month year all]│  │ [week month year all]│          │
│  │ bars                 │  │ line                 │          │
│  └──────────────────────┘  └──────────────────────┘          │
│  (spacer)                                                    │  12×1
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │  4×14 each
│  │ top pages│  │ countries│  │ devices  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
└──────────────────────────────────────────────────────────────┘
```

Default L stack = `2 + 1 + 6 + 1 + 22 + 1 + 14` = **47 rows** = `752px` of grid, plus header and `16px` page padding.

### Placement by breakpoint

`grid-column: span C` and `grid-row: span R`. Same row spans at every breakpoint; only column spans change. Do not hide modules behind tabs on L or MD.

| Region | L (≥1024) | MD (≥768) | SM (≥640) | XSM (<640) | Row span | Height |
| --- | --- | --- | --- | --- | --- | --- |
| Last updated | 12 | 12 | 12 | 12 | **2** | `32px` |
| Band spacer | 12 | 12 | 12 | 12 | **1** | `16px` |
| Each stat | 4 | 4 | 4 | 12 | **6** | `96px` |
| Band spacer | 12 | 12 | 12 | 12 | **1** | `16px` |
| Unique visitors chart | 6 | 6 | 12 | 12 | **22** | `352px` |
| Page visits chart | 6 | 6 | 12 | 12 | **22** | `352px` |
| Band spacer | 12 | 12 | 12 | 12 | **1** | `16px` |
| Top pages | 4 | 6 | 12 | 12 | **14** | `224px` |
| Countries | 4 | 6 | 12 | 12 | **14** | `224px` |
| Devices | 4 | 12 | 12 | 12 | **14** | `224px` |

On XSM, stats stack (12 cols each), so three stat bands with **no extra spacer between them** (they already sit on consecutive auto-rows). After the last stat, one spacer, then charts stacked at 12×22, then breakdowns stacked at 12×14.

On XSM, range buttons wrap 2×2: chart **row span becomes 25** (`400px`) — header 3 + range 6 + plot 16. Plot span stays 16.

Order when stacked: stats (lifetime → uniques → visits) → unique chart → visits chart → top pages → countries → devices.

### Module anatomy (inside the span)

Every module is a `CyberBox` that **fills its grid area** (`height: 100%`). Inner padding: `16px` (1 unit) on all sides.

| Module | Row span | Inner header | Inner range | Inner plot / body |
| --- | --- | --- | --- | --- |
| Stat | 6 (`96px`) | HudLabel + HudTitle fill the box | — | — |
| Unique visitors chart | 22 (`352px`) | 3 rows (`48px`) | 3 rows (`48px`) | 16 rows (`256px`) |
| Page visits chart | 22 (`352px`) | 3 rows (`48px`) | 3 rows (`48px`) | 16 rows (`256px`) |
| Top pages | 14 (`224px`) | 3 rows (`48px`) | — | 11 rows (`176px`), max 8 list rows |
| Countries | 14 (`224px`) | 3 rows (`48px`) | — | 11 rows (`176px`) |
| Devices | 14 (`224px`) | 3 rows (`48px`) | — | 11 rows (`176px`) |

Timeseries plots use `maintainAspectRatio: false` inside the 16-row plot box. Chart.js must not set page height.

Stat value: HudTitle `text-2xl` (XSM) / `text-3xl` (SM+). Label: HudLabel. Do **not** repeat the big number inside the unique-visitors chart header; the three stats are the readouts.

Range controls: four equal **Control** buttons, 3 rows tall (`48px`). On XSM they wrap 2×2 (6 rows) and the chart span grows to 25 as above.

### Dashboard color map

Same CSS variables as the site. Dashboard assigns them strictly as follows (dark values are canonical).

| Surface | Token | Dark | Light | Use |
| --- | --- | --- | --- | --- |
| Page | `--bg` | `#0a0a0a` | `#fafafa` | Canvas behind the HUD |
| Module fill | `--card` at 50% + `bg-glass` | `#171717` / 60% | `#ffffff` / 60% | Panel interior |
| Frame idle | `--border` | `#262626` | `#e5e5e5` | `CyberBox` stroke |
| Frame hover / active | `--accent` | `#3b82f6` | `#2563eb` | Notch indicators, focused module |
| Stroke width | `--svg-shape-stroke-width` | `3` | `3` | Keep current HUD weight |
| Primary text | `--fg` | `#fafafa` | `#171717` | Stat values, chart titles |
| Labels / axes | `--muted` | `#a3a3a3` | `#737373` | HudLabel, ticks, last updated |
| CTA / active control | `--accent` + `--accent-fg` | blue / `#fff` | blue / `#fff` | Selected range, resume, retry |
| Overlay scrim | `--bg` at 80% | `#0a0a0a` | `#fafafa` | Error overlay on the same module |

Header rule under the dashboard nav: `border-white` on dark (current). Idle HUD controls: `border-border`, `bg-card/50`, `text-muted`. Hover: `border-accent`, `text-accent`. Active: `border-accent`, `bg-accent/15`, `text-accent`.

### Chart color map

One series color: accent. No rainbow palettes.

| Element | Color | Notes |
| --- | --- | --- |
| Bar fill (uniques) | `--accent` | `maxBarThickness: 28`, radius `3` |
| Line stroke (visits) | `--accent` | width `2`, tension `0.35` |
| Line fill | accent at **15%** | `colorWithAlpha(accent, 0.15)` |
| Point | `--accent` | radius `2`, hover `4` |
| Country bars | accent fill at **70%**, accent stroke `1px` | Horizontal, top 8 |
| Device — desktop | `--accent` | |
| Device — mobile | `color-mix(in srgb, var(--accent) 55%, var(--fg))` | Lighter mix, still blue family |
| Device — other | `--muted` | |
| Top-pages meter | accent at 40% track, accent fill | Row list, not a third timeseries |
| Y grid | muted at **12%** | Horizontal only |
| X grid | off (bars/line); muted 12% if needed | |
| Axis ticks | `--muted`, Rajdhani `11px` | Y ticks **hidden** on both timeseries (tooltip carries the number) |
| Hover column | muted at **12%** | Bar chart only |
| Tooltip fill | `--card` | |
| Tooltip title | `--fg`, Rajdhani 13 bold | |
| Tooltip body | `--muted`, Rajdhani 13 | |
| Tooltip border | muted at **25%**, 1px | |

### Charts

- Unique visitors: **bar**, own week / month / year / all control.
- Page visits: **line**, own week / month / year / all control.
- Keep them separate. Do not combine into a dual-axis chart.
- Countries: horizontal bar, top 8, no legend.
- Devices: three-category breakdown (desktop / mobile / other), not a pie.
- Top pages: ranked list (path + count + share meter), max 8 rows. Truncate path with `…` in the middle if needed.

### States

Apply per module. Sibling modules stay interactive.

| State | Treatment |
| --- | --- |
| Loading | Chrome stays; plot/values at `opacity: 0.6`. Missing values render as `0`. |
| Empty | Series is `0` (flat axis / empty meters). Stats show `0`. No “no data” blank. |
| Error | Same chart (last data or zeros) plus an overlay: HudMeta message + Control retry. Overlay is `absolute inset-0`, scrim `--bg` 80%, centered copy. Do not swap the layout. |

Last updated stays visible when `fetchedAt` exists, including error. If there is no timestamp yet, omit the line rather than showing a placeholder.

### Data notes (for implementation)

Current ingest stores daily uniques and page visits plus rollups. Top pages can use owned `page_view_counts` / `page_view_daily`. Countries and devices need Cloudflare (or equivalent) dimensions added to ingest; reuse `CountriesChart` and restyle it to this color/size map.

---

## 4. Decisions log

| Decision | Choice |
| --- | --- |
| Visual system | One system; dashboard is a layout variant |
| Inspiration | Cyberpunk 2077 HUD/UI |
| Mood | Technical, minimal, efficient |
| Color | Current blue accent, keep for now |
| Type | Named rulesets, four families |
| Motion | Enter + exit everywhere; extras per page |
| Public density | Spacious |
| Dashboard density | Structured grid |
| Home | Name is enough |
| About | Keep tabs; resume download more prevalent |
| Works / blog | Hidden until there is content |
| Voice | Third person + HUD chrome |
| Experience | Short bullets |
| CTAs | GitHub, LinkedIn, resume PDF |
| Dashboard purpose | Show off a data HUD |
| Dashboard page | min `320px` wide, max `1440px`, min `100dvh`, target fit `1440×900` |
| Dashboard grid | 12 cols, dynamic rows, `grid-auto-rows: 16px`, column-gap `16px`, row-gap `0` |
| Dashboard spans | stats `4×6`; charts `6×22`; breakdowns `4×14`; 1-row spacers between bands |
| Chart plot height | 16 rows (`256px`); XSM chart span 25 when ranges wrap |
| Chart color | Accent only; muted grids; Y ticks hidden |
| Chart ranges | Independent per chart |
| Empty data | `0` |
| Chart errors | Overlay on the same chart |
