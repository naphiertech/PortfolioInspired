---
target: Default presentation mode
total_score: 22
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 2
timestamp: 2026-09-17T04-13-37Z
slug: default-presentation-mode
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Live availability pulse, real-time clock, active build indicators |
| 2 | Match System / Real World | 4 | Natural developer taxonomy, clear technical terminology |
| 3 | User Control and Freedom | 3 | Mode switching and dock navigation are flexible; some card clicks lack discrete hover cues |
| 4 | Consistency and Standards | 3 | High token consistency, but over-standardized: cards all share identical padding and borders |
| 5 | Error Prevention | 4 | Solid links, safe fallbacks for missing GitHub or audio data |
| 6 | Recognition Rather Than Recall | 3 | Excessive pill badges create visual noise that obscures primary technologies |
| 7 | Flexibility and Efficiency | 3 | Fast navigation dock and direct links, but dense mobile stacking |
| 8 | Aesthetic and Minimalist Design | 2 | Heavy card-in-card containment, identical 3-card focus block, chip badge fatigue |
| 9 | Error Recovery | n/a | Portfolio showcase surface |
| 10 | Help and Documentation | n/a | Portfolio showcase surface |
| **Total** | | **22/32** | **Good (68.8%)** |

#### Design Specificity Verdict

**LLM assessment**: The Default presentation mode has an authentic, strong blueprint/technical identity (reference lines, crosshairs, coordinate marks, mono syntax). However, several secondary areas have accumulated classic generative-UI traits: (1) repetitive card boxing where simple editorial rows would feel far more human; (2) identical structure across the three Current Focus cards; (3) badge-stacking fatigue where every technology is rendered inside a bordered pill; and (4) microscopic metadata typography (9px-10px) with weak contrast.

**Deterministic scan**: `detect.mjs` returned 0 automated AST syntax flags (no generic gradient slop or buzzwords). The critique identifies genuine structural and typographic repetition that must be refined.

#### Overall Impression
A sophisticated technical portfolio whose personality is partially veiled by repetitive card containers and chip badges. By dismantling the cookie-cutter card pattern in Current Focus and Experience, uncluttering badge walls in Projects and Tech, and lifting microscopic metadata to legible sizes, the Default mode will feel crafted by a senior engineer rather than an AI template.

#### What's Working
1. **Architectural Blueprint System**: Technical reference lines, crosshairs, section syntax (`<NOW/>`, `<SELECTED-PROJECTS/>`), and restrained monochrome palette establish a distinct point of view.
2. **Interactive Affordances & Easter Eggs**: Subtle theme avatar animation, live GitHub contribution heatmaps, and audio feedback feel deliberate and personal.
3. **Restrained Semantic Accents**: Mint/emerald accents are reserved for real state (live build, available status).

#### Priority Issues
- **[P1] Repetitive Feature Card Enclosure in Current Focus**: `<CURRENT-FOCUS/>`, `<WHAT-I-BUILD/>`, and `<HOW-I-WORK/>` use identical rounded card boxes and repetitive footer metadata. Fix: Differentiate each column into editorial, capability, and principle structures within a cohesive architectural frame.
- **[P1] Pill Badge & Chip Stacking Overload**: Projects and Tech Stack display dozens of tiny rounded pill buttons with dark borders. Fix: Reserve pill shapes strictly for semantic status (`LIVE`, `BUILDING`, `WIP`); format technologies as clean, compact monospace tokens or editorial inline metadata.
- **[P2] Microscopic Functional Typography & Weak Contrast**: Hero details (location, local time, education), project dates, and timeline metadata dip below 11px with faint opacity. Fix: Boost sizing to readable thresholds (12px/13px) and calibrate contrast for WCAG AA compliance.
- **[P2] Nested Card Enclosure in Experience Timeline**: Each timeline item is trapped in a rounded rectangle with an icon box, current pill, year badge, and external arrow. Fix: Convert to clean, editorial timeline milestones with subtle horizontal dividers.
- **[P2] Heavy Monochrome Image Wash**: Project screenshots have a flat 100% grayscale wash that reduces contrast and obscures screenshot details. Fix: Calibrate resting image filter with subtle contrast boost and balanced brightness.

#### Persona Red Flags
- **Alex (Power User)**: Tech stack badges all look like buttons but act like filter links without clear affordance; too many visual containers slow down rapid scanning of core competencies.
- **Jordan (First-Timer)**: Microscopic metadata (9px-10px) in the hero and timeline requires squinting; the 3 identical cards in Current Focus make it unclear which one is most important.
- **Sam (Accessibility)**: Faint gray text on dark surfaces (`text-muted-foreground/60`) falls below 4.5:1 contrast; tiny touch targets for gallery and external links.

#### Minor Observations
- The footer metadata text at the bottom is slightly low contrast against the dark background.
- `<NOW/>` section cards use rounded-xl with inner borders, feeling slightly disconnected from the blueprint aesthetic.
