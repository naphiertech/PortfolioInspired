# PortfolioInspired Agent Operating Guidelines

## 1. System Context & Source of Truth
* All architectural invariants, design tokens, API response contracts, and feature domain rules are codified inside [`.context/00_system_architecture.md`](.context/00_system_architecture.md).
* Before writing code, consult:
  * [`.context/01_design_tokens.md`](.context/01_design_tokens.md): Technical editorial grid tokens, dark-first variables (`--bg-page: #0b0d0e`), tactile shadows, crosshairs.
  * [`.context/02_api_and_server_boundaries.md`](.context/02_api_and_server_boundaries.md): Edge route handlers, Ably token security, chat output guards.
  * [`.context/03_realtime_and_events.md`](.context/03_realtime_and_events.md): Ably pub/sub channels, presence tracking, live cursor broadcast.
  * [`.context/04_domain_creative_mode.md`](.context/04_domain_creative_mode.md): Sandbox canvas, widget positioning, drag bounds, persistent state.
  * [`.context/05_domain_music_drawer.md`](.context/05_domain_music_drawer.md): Ambient audio engine, track metadata, Web Audio synthesis.
  * [`.context/06_domain_presentation_modes.md`](.context/06_domain_presentation_modes.md): Slide viewport scaling, keyboard shortcuts, fullscreen overrides.
  * [`.context/07_domain_resources_drawer.md`](.context/07_domain_resources_drawer.md): Resource catalog models, category tags, link verification.
  * [`.context/08_domain_side_drawers.md`](.context/08_domain_side_drawers.md): Off-canvas animation states, focus trapping, backdrop blur.
  * [`.context/99_icm_execution_protocol.md`](.context/99_icm_execution_protocol.md): Verification pipeline, Next.js build validation, and surgical diff rules.

## 2. Knowledge Graph & AST Visualizer
* AST Graph & Community Clusters are generated in [`graphify-out/`](graphify-out/).
* View interactive visual tree: open [`graphify-out/GRAPH_TREE.html`](graphify-out/GRAPH_TREE.html).
* Open [`graphify-out/obsidian/`](graphify-out/obsidian/) as a vault in Obsidian to explore the visual code graph.

## 3. Cross-Layout Header & Design Consistency Rules
Before adding or editing any page, route, or presentation mode view, inspect sibling pages across **Standard (`default`)**, **Focus (`focus`)**, **Minimal (`minimal`)**, and **Artisan (`agent`)** modes and enforce these invariants:

* **Standard (`default`) Subpage Headers** (`/projects`, `/notes`, `/experience`, `/tech-stack`, `/certifications`, `/components`):
  * Always apply `pt-4 sm:pt-5` on the top header wrapper below `PageHeader` so `cd .. / home` never crowds the top blueprint crosshair line.
  * Subpage/index headers go straight from `← cd .. / home` into the `<h1>` (`font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight`) + subtitle block. **Do NOT place `<PAGE-NAME/>` syntax tags above `<h1>` on list/index subpages** — `<SECTION-TAG/>` headers (`SectionHeader`) are for Home (`/`) sections and internal body sub-sections only.
  * Detail pages (`/projects/[slug]`, `/components/[slug]`) use `← cd .. / <collection>` and may render `&lt;{slug}/&gt;` immediately above `<h1>` in Standard (`default`) mode only.
* **Focus (`focus`) Mode Headers**:
  * **Home (`/`) sections** use numbered bracket `<h2>` headers (`[ 00 // PROFILE ]` .. `[ 07 // CONTACT ]`) as section titles.
  * **Focus subpages (`Focus*Page.tsx` and Focus mode on shared routes)**: Start with `<FocusNavigation />`, followed directly by the `← cd .. / ...` breadcrumb and `<h1>` (`font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight`) + subtitle. **NEVER add `[ XX // PAGE ]` + `... OVERVIEW` / `ARCHIVE` / `ARTIFACTS` kicker bars or `<tag/>` eyebrows between `← cd .. / ...` and `<h1>` on any Focus subpage.**
* **Minimal & Artisan Mode Headers**:
  * **Minimal**: `<MinimalHeader />`, `pt-8 sm:pt-10`, plain `← Home` (or parent route) link, italic `font-serif` `<h1>` — no monospace syntax tags or numbered brackets.
  * **Artisan (`agent`)**: Monospace/serif editorial headers matching `AboutSection`, `ProjectsSection`, and `WorkspaceSidebar` — no `<SECTION/>` or `[ XX // ... ]` tags.
* **Monochrome Black & White UI Palette (Standard & Focus Layouts)**:
  * All UI chrome across **Standard (`default`)** and **Focus (`focus`)** pages (badges, `New` pills, status dots, switches, sliders, checkmarks, borders, blockquote rules, icons, hover highlights, thumbnails) MUST remain strictly monochrome black & white using semantic tokens (`ink`, `page`, `surface`, `muted-foreground`, `muted-subtle`, `border-hairline`). **Do NOT introduce `emerald-*`, `green-*`, or `teal-*` UI accents** on Standard or Focus pages.
