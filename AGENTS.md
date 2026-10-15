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
