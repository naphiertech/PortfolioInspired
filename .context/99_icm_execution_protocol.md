# 99 ICM Execution & Verification Protocol

## 1. Zero Regression & Surgical Execution Invariants
* **Surgical Scope**: Touch only the exact component or style rule requested. Never refactor surrounding design tokens or alter global layout variables in `globals.css`.
* **Zero CSS Drift**: Always use established CSS variables (`--bg-page`, `--text-ink`, `--shadow-tactile`, etc.) rather than introducing arbitrary hardcoded hex codes.
* **Component Encapsulation**: Keep CSS modules (`*.module.css`) scoped to their respective components.

---

## 2. Multi-Stage Verification Pipeline

Before marking any task as complete in `PortfolioInspired`, execute:

### Step 1: Next.js Lint Check
```powershell
npm run lint
```

### Step 2: TypeScript Type Check
```powershell
npx tsc --noEmit
```

### Step 3: Production Build Dry-Run
```powershell
npm run build
```

### Step 4: AST Knowledge Graph Refresh
```powershell
python -m graphify extract . --code-only
python -m graphify export obsidian
```
