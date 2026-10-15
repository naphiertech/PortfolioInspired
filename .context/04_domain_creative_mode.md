# 04 Domain: Creative Mode Feature

## 1. Scope & Subsystem Architecture
* **Location**: [`src/features/creative-mode/`](../src/features/creative-mode/)
* **Purpose**: Transforms the static portfolio into a dynamic sandbox canvas where visitors can manipulate floating widgets, inspect technical circuit nodes, and toggle experimental rendering modes.

---

## 2. Invariants & Rules
1. **Viewport Boundaries**:
   * Draggable widgets (`CircuitPlatform`, interactive modules) must clamp their bounding coordinates strictly within the visible canvas to prevent components from escaping outside the viewport.
2. **State Persistence**:
   * Creative mode toggles and component spatial layouts persist across browser sessions in `localStorage` under a prefixed key (`creative_mode_layout_v1`).
3. **Performance Throttling**:
   * Drag calculations utilize `requestAnimationFrame` to avoid UI thrashing.
   * On mobile devices (`< 768px`), freeform drag is disabled in favor of structured vertical touch-scrolling.
