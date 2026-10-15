# 01 Design Tokens & Technical Editorial Grid

## 1. Design System Architecture
* **Source**: [`src/app/globals.css`](../src/app/globals.css) & Tailwind CSS v3 configuration.
* **Paradigm**: Dark-first technical editorial grid inspired by Dieter Rams, industrial instrumentation, and precision blueprints.

---

## 2. Core Color & Surface Tokens

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--bg-page` | `#0b0d0e` | Deep obsidian canvas background |
| `--bg-surface` | `#1a1b1c` | Bento card and widget surface background |
| `--bg-surface-hover` | `#222426` | Card hover elevation state |
| `--bg-dock` | `rgba(26, 27, 28, 0.75)` | Translucent floating navigation dock |
| `--bg-muted` | `#27272a` | Secondary action buttons, badge backdrops |
| `--text-ink` | `#fafafa` | Primary headline typography |
| `--text-body` | `#d4d4d8` | Body copy and descriptive paragraphs |
| `--text-muted` | `#9ca3af` | Metadata, timestamps, captions |
| `--text-faint` | `#80808a` | Micro-labels, version hashes, subtle indicators |
| `--border-hairline` | `rgba(255, 255, 255, 0.08)` | Subtly etched container borders |
| `--border-dashed` | `rgba(255, 255, 255, 0.12)` | Technical blueprint layout division lines |
| `--border-reticle` | `rgba(255, 255, 255, 0.9)` | Precision target crosshairs on interactive nodes |

---

## 3. Structural Grid Dimensions

* `--grid-width-default`: `760px` (standard article & narrative reading column).
* `--grid-width-focus`: `1020px` (expanded showcase bento grid).
* Guide Tokens: `--grid-guide` (`rgba(255, 255, 255, 0.085)`), `--grid-crosshair` (`rgba(255, 255, 255, 0.12)`).

---

## 4. Multi-Layer Tactile Shadow
* `--shadow-tactile`: 9-layer composite shadow combining ambient dispersion, bottom occlusion, hairline outline, and inner top highlight (`inset 0px 1px 0px 0px rgba(255, 255, 255, 0.2)`).
* Invariant: Never replace `--shadow-tactile` with standard Tailwind `shadow-lg` or `shadow-xl`. Precision surface depth must be preserved.
