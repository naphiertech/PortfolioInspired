# Naphier Awalie — Personal Portfolio

A minimalist, high-craft developer portfolio and engineering showcase designed with an editorial, dark-first aesthetic, micro-animations, and live interactive data integrations.

**Live Deployment:** [https://naphiernode.vercel.app/](https://naphiernode.vercel.app/)  
**GitHub Profile:** [@naphiertech](https://github.com/naphiertech)

---

## ⚡ Highlights & Key Features

- **Editorial & CAD Design System**: 760px measured reading column, high-contrast typography, and tactile CAD project cards with corner reticles and grayscale-to-color hover states.
- **Interactive Avatar**: Multi-frame image sequence scrubbing with smooth frame caching.
- **Live GitHub Contributions Calendar**: Real-time server-side scraper and normalizer pulling live commit matrix data from [@naphiertech](https://github.com/naphiertech) with custom theme-aware heat levels.
- **AI Portfolio Assistant**: Integrated interactive chatbot powered by Google Gemini (`gemini-2.5-flash`) providing project details, tech stack info, and contact routing.
- **Seamless Theming**: 3-way theme provider supporting Dark, Light, and System modes with CSS custom property design tokens.
- **Floating Navigation Dock**: Glassmorphic bottom navigation dock with liquid active indicators and quick section jumping.
- **PWA & Offline Ready**: Service worker caching and offline fallback support.

---

## 🛠️ Tech Stack

- **Core & Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling & Tokens**: Vanilla Tailwind CSS, CSS Custom Properties Design Tokens
- **Motion & Interaction**: Framer Motion, GSAP
- **Icons & Visuals**: Simple Icons (`react-icons/si`), VS Code Icons (`react-icons/vsc`), Lucide React
- **AI Integration**: Google Gemini API (`@google/generative-ai` REST endpoint)
- **Tooling & Package Management**: pnpm, ESLint, PostCSS

---

## 🚀 Featured Projects

1. **[Naphix Resume](https://naphix-resume.netlify.app/)** (2026) — Privacy-first resume builder featuring a real-time split-screen workspace, 1:1 ISO 216 A4 live preview mirror, drag-and-drop customization with `@dnd-kit`, and native vector PDF and Word `.docx` exports.
2. **[AssetLink](https://assetlink-supabase-landing.vercel.app/)** (2026) — Decentralized school asset and repair tracking system utilizing QR code verification and role-based maintenance workflows.
3. **[MovieStream](https://movie-stream-pi.vercel.app/)** (2026) — High-fidelity cinematic movie discovery platform with live TMDB integration, fluid animations, and custom genre hubs.
4. **BudgetBuddy** (2025) — Smart personal finance companion app with intuitive category-based expense visualization built with Flutter & Dart.
5. **Quicknotes** (2025) — Blazing-fast, offline-first mobile note-taking application.
6. **Online Business Permit Management System** (2025) — Fullstack municipal portal streamlining government permits.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or 20+
- pnpm (or npm / yarn / bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/naphiertech/PortfolioInspired.git

# Navigate into the project
cd PortfolioInspired

# Install dependencies using pnpm
pnpm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm run build
pnpm start
```

---

## 📄 License

Created and maintained by [Naphier Awalie](https://github.com/naphiertech). All rights reserved.
