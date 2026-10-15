# 06 Domain: Presentation Modes Feature

## 1. Scope & Subsystem Architecture
* **Location**: [`src/features/presentation-modes/`](../src/features/presentation-modes/)
* **Purpose**: Converts technical case studies and editorial content into an interactive slide presentation format for client demos and recruiter pitch sessions.

---

## 2. Invariants & Rules
1. **Keyboard Navigation Matrix**:
   * `ArrowRight` / `Space` / `PageDown`: Next slide step.
   * `ArrowLeft` / `PageUp`: Previous slide step.
   * `Escape`: Exit presentation mode back to standard portfolio view.
2. **Aspect Ratio Enforcement**:
   * Presentation container scales to fit 16:9 aspect ratio across all display resolutions with letterboxing if necessary.
3. **Scroll Lock**:
   * Body scroll is locked (`overflow: hidden`) during active presentation mode to prevent background page scrolling.
