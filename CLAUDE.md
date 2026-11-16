# CLAUDE.md

Guidance for Claude Code when working in this repository. Keep it current: when the structure changes, change this file in the same commit.

## What this is

Kevin Díaz's portfolio: one static landing (Astro, SSG, Vercel adapter) that reads as a living network map, plus a chat assistant (React island) that answers questions about Kevin with his CV as context. Production: https://kevindev.co. UI copy is neutral Spanish.

## Stack

- Astro 6 (SSG, `@astrojs/vercel`), TypeScript strict, pnpm only (enforced by the preinstall hook).
- React 19 only for the chat island.
- PixiJS 8 for the WebGL map behind the page (loaded on demand).
- UnoCSS is installed only for its reset; the landing and the chat are styled with their own CSS.
- Fonts self-hosted in `public/fonts/` (Geist and Geist Mono, latin, woff2).
- Chat endpoint `src/pages/api/chat.ts` against Groq; the key lives in `.env` / `.env.local`, never in the repo.

```bash
pnpm dev       # localhost:4321 (Kevin's server; Claude uses --port 4325)
pnpm build     # static output for Vercel
pnpm preview
```

## Where things live

```
src/
├── pages/
│   ├── index.astro                 # mounts the landing
│   └── api/chat.ts                 # Groq endpoint for the chat
├── components/
│   ├── icons/                      # one Astro component per icon, all built on Icon.astro
│   ├── islands/ChatBot.tsx         # the React island
│   └── portfolio/
│       ├── Portfolio.astro         # composes styles, sections and behaviours; no content of its own
│       ├── data.ts                 # everything the landing says: sections, companies, stack, jobs, credentials, contact
│       ├── build.ts                # commit sha and build date (build time only)
│       ├── sections/               # one Astro component per section (Header, Hero, TechBand, About, Orbit, Projects,
│       │                           #   Experience, Timeline, Credentials, Waves, Contact, Clock, Footer)
│       ├── behaviours/             # one module per client concern (clock, copy-email, contact-form, hud, clamp, orbit,
│       │                           #   reveal, portrait, header, network); index.ts starts them against [data-kd]
│       └── styles/                 # one stylesheet per section, imported in cascade order from Portfolio.astro
└── features/
    ├── chatbot/                    # components, hooks, api client, types, chatbot.css
    ├── network/scene.ts            # the PixiJS map: ambient layers, the star, waypoints, spotlight callback
    └── portrait/dots.ts            # the dot portrait on the hero plate
```

Markup talks to behaviours only through hooks: `data-k="…"` for elements a behaviour needs, `data-node` for the star's waypoints, `data-nav` for the route links, `data-reveal` for plates that settle into view. Colour tokens live on `:root` in `styles/tokens.css`; the WebGL scene and the portrait read them from there.

## Coding rules (Kevin's standing rules, apply to every change)

- No inline SVG scattered through markup. Icons are reusable components in `src/components/icons/`; figures that belong to one section (orbit, waves, clock) are components next to that section.
- Everything lives in the folder of its responsibility: content in `data.ts`, markup in `sections/`, client code in `behaviours/`, styles in `styles/`, shared features under `src/features/`.
- Single responsibility per file. When a component or module grows a second job, split it.
- Reuse over copy. Before adding an icon, a helper or a style, look for the existing one.
- Readable code only: clear names, short functions, one declaration per line in CSS, a comment only where the why is not obvious. No dead code, no commented-out code, no unused files or dependencies.
- UI copy in neutral Spanish, no emojis, no numbering in the interface, no left accent borders.
- Verify with `pnpm build` and Playwright at 1440 and 390 before calling a change done.

## Design rules already decided

- Dark base, palette "hielo": near-black grey, ice-white signal (the star, the anchors, the map), yellow actions, a light grey block that closes the page. Tokens in `styles/tokens.css`.
- Geist for everything, Geist Mono for readouts. Big type scale, always with `clamp()`.
- Chamfered plates (`--oct`), diamonds as markers, nothing rounded by default.
- Respect `prefers-reduced-motion`: the map, the portrait, the orbit and the reveals all check it.
- Phones: one finger, no hover-only affordances; the header route becomes a full-screen menu behind the burger.

## Git

- `main` is protected; work on branches, enter through pull requests.
- Never push, create a PR or merge unless Kevin asks for that exact action.
- Conventional Commits, no AI attribution lines.
- Feature work is tracked in `odd/tasks/<feature>.md`.
