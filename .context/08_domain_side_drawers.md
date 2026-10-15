# 08 Domain: Side Drawers Chassis

## 1. Scope & Subsystem Architecture
* **Location**: [`src/features/side-drawers/`](../src/features/side-drawers/)
* **Purpose**: Provides a unified, accessible slide-over container chassis used across all drawers (Music, Resources, Chat, Field Notes).

---

## 2. Invariants & Rules
1. **Focus Trapping & Accessibility**:
   * When an off-canvas drawer opens, focus is programmatically moved to the drawer's first interactive element or close button.
   * `aria-modal="true"` and `role="dialog"` are enforced on the drawer container.
2. **Backdrop & Gesture Dismissal**:
   * Clicking the backdrop overlay or pressing `Escape` triggers immediate dismissal.
   * On mobile, swiping horizontally toward the edge dismisses the active drawer with velocity-based thresholding.
3. **Scroll Lock Invariant**:
   * The underlying document body is locked (`document.body.style.overflow = 'hidden'`) while any drawer is open, preventing background scroll bleed.
