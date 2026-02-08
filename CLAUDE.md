# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Technology Stack:**
- Astro 5.17.1 (SSG with React partial hydration)
- React 19.2.4 (interactive components only)
- TypeScript (strict mode)
- UnoCSS 66.6.0 (utility-first CSS with Tailwind preset)
- GSAP 3.14.2 (animations)

**Package Manager:** pnpm only (enforced via preinstall hook)

**Common Commands:**
```bash
pnpm dev              # Start dev server (localhost:4321)
pnpm build            # Build to ./dist/
pnpm preview          # Preview built site
pnpm astro -- --help # Astro CLI help
```

## Architecture Overview

### Portfolio Structure

The portfolio is a **single-page application with 5 full-viewport sections** that transition via GSAP animations:

1. **Hero** - Animated gradient background, profile intro
2. **About (Terminal)** - Interactive React terminal component
3. **Projects** - Placeholder for project showcase
4. **Experience** - Placeholder for work history
5. **Contact** - Placeholder for contact form

**Navigation:**
- Right-side navigation dots (fixed position)
- Mouse wheel scroll (800ms cooldown between sections)
- Keyboard arrow keys (↑/↓)
- Direct dot clicking
- Smooth GSAP timeline transitions

### File Organization

```
src/
├── pages/index.astro          # Main page with 5 sections + GSAP animations
├── layouts/Layout.astro       # Base HTML structure
├── components/
│   ├── Terminal/              # Interactive "About" section (React island)
│   │   ├── InteractiveTerminal.tsx   # Main component
│   │   ├── useTerminal.tsx           # State hook
│   │   ├── TerminalHeader.tsx, Body, Input, History, WelcomeMessage.tsx
│   │   ├── commands/                 # Command handlers (each returns JSX)
│   │   │   ├── whoami.tsx, skills.tsx, experience.tsx, etc.
│   │   └── types.ts                  # Command type definitions
│   ├── common/, sections/, islands/, ui/  # Reserved for future use
├── content/                   # Content collections (reserved)
├── styles/global.css          # Global styles + font config
└── assets/images/             # Optimized images

Configuration files:
├── astro.config.mjs           # Astro + React + UnoCSS integration
├── uno.config.ts              # UnoCSS theme (custom colors, shortcuts)
├── tsconfig.json              # TypeScript strict mode
└── package.json               # Dependencies + preinstall pnpm check
```

### Key Architectural Patterns

#### 1. Terminal Component (Interactive "About" Section)

The terminal is a **React island** (`client:load` directive) with a command registry pattern:

```
InteractiveTerminal (main component)
├── useTerminal() hook (state management)
├── TerminalHeader (title bar)
├── TerminalBody (scrollable output)
│   ├── WelcomeMessage (intro + available commands)
│   └── CommandHistory (rendered command outputs)
└── TerminalInput ($ prompt + input field)

Commands:
├── commands/whoami.tsx      → user profile info
├── commands/skills.tsx      → technical skills
├── commands/experience.tsx  → work history
├── commands/hobbies.tsx     → personal interests
├── commands/contact.tsx     → contact info
├── commands/help.tsx        → available commands
└── Built-in: 'clear' command
```

**Command Pattern:**
- Each command is a function returning `JSX.Element | string`
- Registered in `commands/index.ts` as `{ [commandName]: commandFunction }`
- `useTerminal()` hook handles parsing, execution, error messages, and history

**Terminal Mechanics:**
- Auto-scroll to latest output (useRef + useEffect on history change)
- Auto-focus input on mount and container click
- `stopPropagation()` on wheel events prevents page navigation
- Case-insensitive command matching
- Spanish error messages ("comando no encontrado")

#### 2. Navigation & Animation System

All section transitions in `src/pages/index.astro`:
- Uses GSAP for smooth opacity/fade animations
- Fixed positioning with `absolute inset-0`
- Manages state via `scrollPosition` and `currentSection` in script
- Keyboard listener for arrow keys
- Scroll wheel listener with debounce (800ms)
- Prevents browser default scroll behavior during navigation

**Important:** Scroll events inside the Terminal are prevented from affecting page navigation via `handleWheel.stopPropagation()`.

#### 3. Styling Strategy

**UnoCSS Configuration (`uno.config.ts`):**
- Presets: Wind (Tailwind-like utilities) + Icons (CDN-based)
- Custom theme colors in `theme: { colors: {...} }`
- Shortcuts for common patterns: `btn-primary`, `section`, `container`
- Injects CSS reset via `@unocss/reset`

**Global Styles (`src/styles/global.css`):**
- Minimal CSS: font family, smooth scroll, body margin, main min-height
- No component-scoped styles; all styling via UnoCSS utilities
- System fonts: Inter or system-ui fallback

**Responsive Design:**
- Mobile-first Tailwind breakpoints (sm, md, lg)
- Terminal uses flexbox to fill viewport
- All sections are full-height (h-screen equivalent)

#### 4. Astro SSG + React Partial Hydration

- **Pages**: Static HTML pre-rendered at build time
- **React Components**: Only hydrated where interactivity is needed
- Terminal: `client:load` → always hydrated (interactive)
- Future components: Consider `client:visible` (lazy load) or `client:idle` (off-main-thread)

## Critical Development Notes

### 1. Enforce pnpm

```bash
# This is enforced in package.json via preinstall hook:
npm_execpath=$SHELL is pnpm or will FAIL
# Current: pnpm >=8.0.0, Node >=18.0.0
```

Do not use npm or yarn.

### 2. Adding New Components

**Component Patterns:**

All components should follow these principles:
- Use UnoCSS utility classes (no CSS files unless necessary)
- Prefer composition over props drilling (split into sub-components)
- React components use `.tsx` extension, Astro use `.astro`
- Use TypeScript interfaces for props
- Keep components in appropriate folders: `ui/`, `sections/`, `islands/` (for interactive)

**React Island (Interactive Component):**
1. Create component in `src/components/islands/MyComponent.tsx`
2. Add `client:load`, `client:visible`, or `client:idle` directive in parent Astro file
3. Import and use: `<MyComponent client:load />`
4. Example: Terminal is in `islands/` and uses `client:load`

**Astro Component (Static Section):**
1. Create component in `src/components/sections/MySection.astro`
2. Use slots for flexibility: `<slot />`
3. Import other components as needed
4. Add to main page sections

**Styling Components:**
- All colors use UnoCSS theme colors (e.g., `text-scarlet-fire`, `bg-indigo/20`)
- Typography defaults: `font-mono` for code-like content, inherit for text
- Sizing: Use flex properties (`flex-1` for expansion, `w-full h-full` for viewport fill)
- Avoid component-scoped CSS; use utility classes for everything

### 3. Section Navigation Gotchas

**Scroll Prevention:**
- Page wheel events are captured in index.astro script
- `e.preventDefault()` stops default browser scroll
- Terminal's `stopPropagation()` prevents bubbling to page nav

**Timing:**
- Navigation uses 800ms debounce to prevent rapid flickering
- GSAP animations should align with this timing for smooth experience

### 4. UnoCSS Theme Colors

Available custom colors (defined in `uno.config.ts`):
- `scarlet-fire: #FF220C`
- `scarlet-rush: #D33E43`
- `taupe: #9B7874`
- `grey: #666370`
- `indigo: #1C1F33` (primary background)

Use with UnoCSS syntax: `text-scarlet-fire`, `bg-indigo/40`, `border-white/10`

### 5. TypeScript & React 19

- Strict mode enabled in tsconfig.json
- React 19 context available (hooks, Server Components concepts)
- Terminal hook (`useTerminal`) demonstrates proper hook composition
- Use `.tsx` extension for components with JSX

### 6. Content Collections (Reserved)

Currently unused but configured:
- `src/content/projects/` - Future project markdown files
- `src/content/experience/` - Future experience data
- Not yet integrated into page rendering

## Common Development Tasks

### Modify Existing Sections
- File: `src/pages/index.astro`
- Each section: `<section class="section">` with unique content
- Hero uses GSAP animation timeline
- Update text, images, or styling via UnoCSS utilities

### Create a New Section
1. Create `src/components/sections/MySection.astro`
2. Use UnoCSS utility classes for styling
3. Import in `src/pages/index.astro`
4. Add as new section (may need to update navigation system for 6+ sections)

### Create an Interactive Component
1. If interactive, create `src/components/islands/MyComponent.tsx` (React)
2. If static, create `src/components/sections/MyComponent.astro`
3. Use UnoCSS utilities for all styling
4. Compose from smaller sub-components
5. Export TypeScript interfaces for props

### Adjust Navigation Timing
- File: `src/pages/index.astro`, script tag
- Find `const SCROLL_COOLDOWN = 800`
- GSAP timeline durations should align with this timing

### Change Color Theme
- File: `uno.config.ts`
- Update `theme.colors` object
- Changes apply globally to all UnoCSS color utilities

### Update Global Styles
- File: `src/styles/global.css`
- Minimal file; most styling via utilities
- Avoid CSS files; use UnoCSS classes instead

## Build & Deployment

**Development:**
```bash
pnpm dev
# Runs Astro dev server with hot reload
# Port: 4321
# Files: src/pages/*.astro auto-route to /
```

**Production:**
```bash
pnpm build
# Generates static site in ./dist/
# Pre-renders all pages at build time

pnpm preview
# Serves dist/ locally (test production build)
```

**Output:**
- Fully static HTML/CSS/JS
- React hydration only for Terminal component
- No server-side runtime needed

## Performance Considerations

1. **SSG Benefits:** All pages pre-rendered, zero server-side rendering overhead
2. **Partial Hydration:** React only loaded/hydrated for Terminal, not entire page
3. **GSAP:** Heavy animations are optimized (GPU-accelerated), but avoid adding many simultaneous animations
4. **Icons:** Loaded from CDN (esm.sh) - ensure internet access during development
5. **CSS:** UnoCSS generates only used utilities - no bloat

## Recent Decisions & Trade-offs

- **Terminal over static sections:** Interactive terminal provides engaging "About" experience
- **GSAP over CSS animations:** Allows complex coordinated section transitions
- **UnoCSS over Tailwind:** Lighter weight, faster builds, but less ecosystem
- **Astro SSG + React islands:** Minimal JavaScript shipped, best performance for static portfolio
- **Flexbox layout:** Terminal fills viewport dynamically without fixed heights

## Git Workflow

- Repository: https://github.com/KevinDM15/portfolio.git
- Main branch: `main` (protected, requires PR)
- Feature workflow: Create branch → implement → PR → merge
- Recent commits show pattern: `feat:`, `fix:` prefixes

## No Server-Side Code

This is a **static site** - no backend, database, or server-side logic. All interactivity (terminal, navigation) is client-side via JavaScript. For future features like contact forms, use third-party services (Formspree, Netlify Forms) or serverless functions.

---

## How to Use Skills and MCP Servers

**Important:** When working on tasks that involve Astro, React, UnoCSS, or other framework-specific features:

1. **Check if a skill applies first** - Use `/skill-name` or ask Claude to invoke it
   - Available: `/astro-framework`, `/react`, `/frontend-design`, `/tailwind` (for UnoCSS patterns)
   - These provide best practices and detailed guidance before making changes

2. **Use MCP servers for documentation** - Context7 for latest library docs
   - Before implementing: `claude mcp add context7` and search docs
   - Saves time vs. trial-and-error

3. **Only then make changes** - After gathering context and best practices, proceed with implementation

This ensures changes follow current best practices and avoid outdated patterns.

---

## Claude Code Automation Recommendations

### 🔌 Recommended MCP Servers

#### **context7** - Library Documentation Lookup
- Quickly search Astro, React, UnoCSS, GSAP documentation
- Install: `claude mcp add context7`
- Why: When building new components or features, quickly reference latest docs

### 🎯 Recommended Skills

#### **astro-framework** (Available Skill)
- Guidance on Astro components, islands, content collections, view transitions
- Invocation: Both Claude and user-invocable
- Use: `/astro-framework` when building Astro-specific features

#### **react** (Available Skill)
- React 19 performance optimization, hooks, concurrent rendering patterns
- Invocation: Claude-only
- Use: When optimizing React components or using hooks

#### **frontend-design** (Available Skill)
- Create distinctive, production-grade UI interfaces
- Plugin available: `frontend-design`
- Use: When building new visual sections or components

### ⚡ Recommended Hooks

#### **PostToolUse: Auto-format on Edit**
- Runs Prettier if configured
- Add to `.claude/settings.json` if you add linting setup
- Why: Keeps code style consistent across edits

#### **PreToolUse: Block lock file edits**
- Prevents accidental pnpm-lock.yaml modifications
- Add to `.claude/settings.json` to protect dependency versions
- Why: Lock files should only change via `pnpm add/update`

### 🤖 Optional Subagents

For larger portfolios with more sections/components, consider:

**ui-reviewer** - Accessibility and design consistency audit
- When: Before deploying portfolio sections
- Checks: WCAG compliance, color contrast, responsive behavior

**code-reviewer** - Parallel code review
- When: Large refactoring or component additions
- Checks: Patterns, performance, consistency with existing code

---

## Implementation Notes for Future Features

### Adding a Blog Section
- Use Astro Content Collections: `src/content/blog/`
- Create dynamic route: `src/pages/blog/[slug].astro`
- Reference: Astro framework skill for collection setup

### Adding a Contact Form
- Create React component: `src/components/islands/ContactForm.tsx`
- Use `client:visible` directive (lazy loads on scroll)
- Connect to service: Formspree, Netlify Forms, or custom endpoint
- Validate client-side with React Hook Form (if needed)

### Performance Monitoring
- SSG output is inherently fast
- Use browser DevTools to profile animations (GSAP)
- Consider: Lighthouse for PWA readiness, CLS for layout stability

### Deployment
- Static site → any host (Vercel, Netlify, GitHub Pages)
- No build server needed beyond `pnpm build`
- Example: `vercel deploy` or `netlify deploy --prod --dir=dist/`
