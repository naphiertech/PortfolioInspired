# 07 Domain: Resources Drawer Feature

## 1. Scope & Subsystem Architecture
* **Location**: [`src/features/resources-drawer/`](../src/features/resources-drawer/)
* **Purpose**: Slides out a categorized inventory of software development tools, design frameworks, open-source utilities, and downloadable engineering artifacts.

---

## 2. Invariants & Rules
1. **Security on Outbound Links**:
   * All external resource links MUST include `target="_blank" rel="noopener noreferrer"` to prevent tab-nabbing vulnerabilities.
2. **Category Filtering**:
   * Resources are tagged with immutable category keys (`design`, `engineering`, `ai`, `devtools`).
   * Filter state is client-managed without triggering route changes or page reloads.
3. **Asset Download Safety**:
   * Downloadable assets (e.g. resume PDF, design tokens export) resolve from static assets with correct MIME headers.
