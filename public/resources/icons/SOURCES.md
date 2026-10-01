# Resources icon sources

The drawer loads these files locally. Product marks and portraits keep their real colors; the surrounding interface remains monochrome. Official light/dark alternates are used where available.

| Resource | Local file | Official or creator source |
| --- | --- | --- |
| Claude Code | `claude-code.svg` | https://github.com/anthropics/claude-code |
| Codex / OpenAI | `openai.svg` | https://openai.com/codex/ |
| OpenCode | `opencode-mark.svg`, `opencode-mark-dark.svg` | https://github.com/anomalyco/opencode/tree/dev/packages/console/app/src/asset/brand — official light/dark logo variants |
| Antigravity | `antigravity-color.png` | https://antigravity.google/press — full-color icon: `/assets/image/brand/antigravity-icon__full-color.png` |
| Impeccable | `impeccable.svg` | https://impeccable.style/favicon.svg |
| HyperFrames | `hyperframes.svg` | https://www.hyperframes.dev/favicon-light.svg |
| Rulesync | `rulessync.jpg` | https://rulesync.dyoshikawa.com/logo.jpg |
| MCP | `mcp.svg` | https://modelcontextprotocol.io |
| GitHub | `github.svg` | https://github.com/logos |
| Vercel | `vercel.svg` | https://vercel.com/geist/brands |
| Supabase | `supabase.svg` | https://supabase.com/brand-assets |
| Chrome DevTools | `chrome.svg` | https://developer.chrome.com/docs/devtools |
| Matt Pocock | `mattpocock.png` | https://github.com/mattpocock/skills |
| Andrej Karpathy | `karpathy.png` | https://github.com/karpathy |
| GStack / Garry Tan | `garrytan.png` | https://github.com/garrytan/gstack |
| skills.sh | `skills-sh.ico` | https://www.skills.sh/favicon.ico?favicon.3fpu2ql9ns1a0.ico — actual icon link inspected in Chrome DevTools |
| Playwright Skill / Playwright | `playwright.svg` | https://playwright.dev/img/playwright-logo.svg — official browser automation runtime mark |
| Codebase Memory | `codebase-memory.svg` | https://deusdata.github.io/codebase-memory-mcp/ — inline SVG favicon copied from the official site |
| Superpowers | `superpowers.svg` | https://github.com/obra/superpowers/blob/main/assets/superpowers-small.svg |

For skills without a verified product mark, the drawer displays restrained initials rather than presenting generic graphics as logos.

Source inspection: 2026-10-01. Existing legitimate local assets were retained; incorrect Antigravity, Rulesync, Impeccable, and HyperFrames treatments were replaced in the drawer.

## Added resource evidence

These entries were checked against installed files on 2026-10-01. They are a curated selection, not an inventory of every available skill.

| Resource | Installation / workflow evidence | Verified destination |
| --- | --- | --- |
| skills.sh | Requested directory; inspected its actual title, positioning, and favicon in Chrome with the DevTools protocol | https://www.skills.sh |
| Brag | `.agents/skills/brag/SKILL.md` and `skills-lock.json`, source `latent-spaces/brag` | https://github.com/latent-spaces/brag |
| Playwright Skill | `C:/Users/NaphierNODE/.agents/skills/playwright-skill/package.json`; used for the portfolio's browser verification | https://github.com/lackeyjb/playwright-skill |
| Codebase Memory | `C:/Users/NaphierNODE/.codex/skills/codebase-memory/SKILL.md`; active graph tools and project rules | https://github.com/DeusData/codebase-memory-mcp |
| Superpowers | Installed plugin `superpowers/6.4.2/skills/verification-before-completion/SKILL.md` | https://github.com/obra/superpowers |
| Surgical Patch | `C:/Users/NaphierNODE/.agents/skills/surgical-patch/SKILL.md`; local focused-fix playbook | Local expansion; no invented external destination |

Brag and Surgical Patch use restrained initials because a dedicated verified mark was not found in the inspected sources. Product icons are stored locally; none are hotlinked by the drawer.
