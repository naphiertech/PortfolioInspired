# 00 System Architecture & Manifest

## 1. Project Profile
* **Archetype**: FULL-STACK APPLICATION (Technical Editorial Next.js 15 App Router + Edge API Routes)
* **Lifecycle Phase**: MATURE / BROWNFIELD (Established Production System)
* **Active Source Files**: 594 source files
* **Framework**: Next.js 15.5.23 (React 19.2.8, TypeScript 5.x)
* **Styling**: Tailwind CSS v3.4.1 + Technical Editorial Grid CSS Variables
* **State & Realtime**: React Context (`SoundContext`, `SnapContext`) + Ably Realtime Pub/Sub

---

## 2. Directory Layout & Subsystem Mapping

* `/src/app`: Next.js 15 App Router pages & route handlers:
  * `/src/app/page.tsx`: Technical editorial portfolio canvas with interactive widgets & bento grids.
  * `/src/app/work`: Case study index and detailed interactive project breakdowns.
  * `/src/app/notes`: Field notes, technical essays, and markdown logs.
  * `/src/app/artisan`: Interactive design engineering artifacts & experimental components.
  * `/src/app/certifications`: Professional credentials & verified skills ledger.
  * `/src/app/api`: Edge route handlers:
    * `/api/ably/token`: Ephemeral token issuance for realtime client connections.
    * `/api/chat`: AI portfolio assistant with deterministic response fallback and output guard.
    * `/api/github-activity` & `/api/github-contributions`: Live commit stream & contribution heatmaps.
    * `/api/recommendations`: Testimonial records and endorsements.
* `/src/components`: 68 specialized design-engineered components:
  * `CircuitPlatform`, `ContributionTruck`, `ExperienceTower`, `DevCard`, `ChatModal`, `AppOverlays`.
* `/src/context`: Global reactive contexts:
  * `SoundContext.tsx`: Web Audio API sound synthesis, SFX triggers, and volume persistence.
  * `SnapContext.tsx`: Grid alignment, snapping boundaries, and magnetic cursor state.
* `/src/features`: Domain-specific modular feature slices:
  * `creative-mode`: Interactive drag-and-drop sandbox and canvas widgets.
  * `music-drawer`: Ambient lo-fi / synth audio player with spectrum visualizer.
  * `presentation-modes`: Slide deck projection mode for investor / hiring presentations.
  * `resources-drawer`: Curated engineering tool stack and bookmark library.
  * `side-drawers`: Sliding overlay chassis with gesture dismiss & focus locks.
* `/src/lib`: Core infrastructural helpers:
  * `ablyClient.ts`: Token-authenticated Ably realtime pub/sub client.
  * `chatIntentGate.ts` & `chatOutputGuard.ts`: Prompt injection defenses and response validation.
  * `deterministicResponder.ts`: Zero-hallucination heuristic fallback engine for visitor inquiries.
  * `dateUtils.ts`, `cursorConfig.ts`, `avatarGenerator.ts`, `buildInfo.ts`.

---

## 3. Dynamic Contract Index

* [`01_design_tokens.md`](01_design_tokens.md): Technical editorial grid tokens, dark-first palette, tactile shadows, crosshairs.
* [`02_api_and_server_boundaries.md`](02_api_and_server_boundaries.md): Edge route handlers, Ably token security, chat output guards.
* [`03_realtime_and_events.md`](03_realtime_and_events.md): Ably pub/sub channels, presence tracking, live cursor broadcast.
* [`04_domain_creative_mode.md`](04_domain_creative_mode.md): Sandbox canvas, widget positioning, drag bounds, persistent state.
* [`05_domain_music_drawer.md`](05_domain_music_drawer.md): Ambient audio engine, track metadata, Web Audio synthesis.
* [`06_domain_presentation_modes.md`](06_domain_presentation_modes.md): Slide viewport scaling, keyboard shortcuts, fullscreen overrides.
* [`07_domain_resources_drawer.md`](07_domain_resources_drawer.md): Resource catalog models, category tags, link verification.
* [`08_domain_side_drawers.md`](08_domain_side_drawers.md): Off-canvas animation states, focus trapping, backdrop blur.
* [`99_icm_execution_protocol.md`](99_icm_execution_protocol.md): Verification pipeline, Next.js build validation, and surgical diff rules.
