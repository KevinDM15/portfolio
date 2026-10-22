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
- L6: "en vez de colocar lenguajes podriamos hablar de como trabajo con agentes de ia, que flujo utilizamos para resolver cosa (no menciones tecnologias sino como resolvemos las cosas y hacia donde las orientamos)" — Marquee words now the workflow (Entender, Especificar, Delegar, Verificar, Entregar, Aprender); "Go · TS" card replaced by "Yo + IA"; new section `#flujo` "Cómo trabajo con agentes" (5 steps + principles); footer index link added. Copy is first person, no tool or language names. Built; viewed section at 1440px.
- L7: "no, en el slider deja las tecnologias, pero esto de los agentes en otro lado puede ir mejor" — Marquee restored to technologies (without Vue.js / Ruby on Rails); the agents card and `#flujo` section stay.
- L8: "en sobre mi, ahi se podria hablar de eso con varios parrafos y en el grafico podria hacerse en vez de hablar de aquitectura hexagonal" — Agents workflow moved into "Sobre mí" (new statement + 4 paragraphs); hexagon diagram replaced by an agent-flow diagram (YO at center, Entender/Delegar/Verificar/Entregar); standalone `#flujo` section and footer link removed. Viewed at 1440px.
- L9: "en los proyectos coloca "proximamente y dejalo desactivado en codigo para cuando tengamos el primer proyecto subirlo" — Projects shows "Próximamente"; the example list + stage are kept behind `const showProjects = false` in `Portfolio.astro` (set to true to restore; build verified both ways). Before publishing a real project, replace the example content and links.
- L10: "ok me gusta, ahora actualicemos la informacion con esta nueva hoja de vida: /Users/kevindm14/Downloads/CV_KEVIN_ES.pdf" — Updated experience (adds CUC and El Sol freelance roles, Rocket Code ends Jul 2026), education and languages, hero tagline, stat card, marquee, contact services, chatbot prompt, and replaced `public/CV_KEVIN_ES.pdf`. Vue.js and Ruby on Rails stay out per the earlier instruction even though the CV still lists them under Koombea. Legacy `src/content/*` (used by the old /about, /experience pages) not updated.
- L11: "con respecto a los colores de la app ese cobalto es muy tipico de IA, podriamos buscar otro color distinto?" -> "hagamos el terracoca para ver como se ve" -> "y si hacemos una mezcla de colores? ... que no solo tenga un solo color" -> "me gusta, aunque el verde me gustaria mas claro y no tan oscuro como ese pino". Cobalto replaced by a terracotta / mustard / green palette (light: #D4470E #B97A00 #2F9E68; dark: #F2602B #F2B134 #5DD39E). Each section owns an accent via CSS overrides; portrait dots, marquee diamonds, timeline bars and confetti mix the three. S2 (palette) superseded.
