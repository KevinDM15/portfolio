# Portfolio redesign (Cobalto, 1:1 with the Claude Design export)
Branch: feat/portfolio-redesign (from main). Delivery: ask-on-risk. Test runner: none in repo; checks = `pnpm build` + browser comparison against the zip render.
Source of truth: `Kevin Diaz Portfolio Rebuild.zip` (index.html + support.js runtime, extracted to scratch only).

## Specs
- S1: Replace the home page with the zip's design: header capsule, hero, marquee, sobre mí, proyectos, experiencia, contacto, footer, toast. Quote: "todo debe ser igual al zip que te pase".
- S2: Palette is Cobalto: dark {bg #0F0F11, surface #18181B, fg #EFEEE9, muted #9C9CA4, accent #5B6CFF}, light {bg #EFEEE9, surface #E4E3DC, fg #0F0F11, muted #5D5D66, accent #2A3BFF}. Default theme is light (`pal.base`). Quote: "usa Cobalto".
- S3: Markup, copy, inline styles, SVGs, fonts (Barlow Condensed, Instrument Serif, DM Mono, Reenie Beanie, local woff2) and assets are taken from the zip without visual changes.
- S4: All behaviors of the zip are kept: dot-portrait canvas repelled by cursor, line reveal, hand-drawn notes, marquee (pauses on hover), ring spin, hexagon pulses, clock + hands, scroll-scrubbed statement, project stage (hover/focus/click), experience bars, magnetic buttons, glass glow, copy-email + confetti + toast, theme toggle with View Transition, responsive layout by container width, prefers-reduced-motion.
- S5: pnpm only; conventional commits; no AI attribution in commits.
- Assumption A1 (superseded by L5): ChatBot restyled with the design tokens and mounted on the home page.
- Assumption A2: Old sections/components stay in the repo (other pages import them); only `src/pages/index.astro` changes.

## Tasks
- [x] T1 (S2,S3) Assets (fonts, retrato, grain, favicon) + `portfolio.css` (font-faces, base, hover classes). Route: inline. Commit: 8fbf352
- [x] T2 (S1,S3) `Portfolio.astro` markup generated from the zip, templates replaced by CSS vars / data hooks. Route: inline. Commit: 4a6bbb4
- [x] T3 (S4) `portfolio.ts` behavior port. Route: inline. Commit: 4a6bbb4
- [x] T4 (S1) Wire `index.astro`, head/meta, build. Route: inline. Commit: 4a6bbb4
- [x] T5 (S1-S4) Verify in browser vs zip (desktop + mobile, light + dark). Route: inline. Commit: n/a (browser check, see Log)

## Log
- L1 (2026-10-21): "/Users/kevindm14/Downloads/Kevin\ Diaz\ Portfolio\ Rebuild.zip ya esta completado, vamos a rediseñar este portfolio armemos el plan"
- L2: "commitea lo que ya tengo y abre otra rama para hacer esto desde main"
- L3: "usa Cobalto, todo debe ser igual al zip que te pase"
- L4: Verified: `pnpm build` ok; desktop 1440 hero matches zip render (nav width identical once DM Mono loads); full page renders all sections; dark toggle sets Cobalto dark tokens; 390px layout switches to mobile; 0 console errors. Not verified: copy/confetti click, project stage hover, reduced-motion.
- L5: "sí, vuelve a montar el ChatBot adaptado a este diseño" — A1 superseded: ChatBot restyled with design tokens (plain CSS `src/features/chatbot/chatbot.css`, no Uno/gsap), mounted in `Portfolio.astro` inside `[data-kd]` (outside the container-type wrap so `position:fixed` works). Verified light, dark and 390px sheet; 0 console errors. Not verified: live replies (needs the Groq key for /api/chat).
