# Reference ideas: sections improved with patterns from well-known developer portfolios

Objective: apply the ideas Kevin picked from docs/referencias-portafolios.md to the landing. Branch feat/reference-ideas. Delivery: single-pr. Checks: pnpm build, Playwright at 1440 and 390.

## Specs

- S1 Inicio: technical annotations around the portrait plate in mono at low opacity (commit rev from `VERCEL_GIT_COMMIT_SHA` or git at build, deploy date, live Barranquilla time, live viewport) and a secondary action "Ver CV" next to "Escríbeme" opening `public/CV_KEVIN_ES.pdf`.
- S2 Sobre mí: fact rows with company tiles ("Ahora con" CUC and El Sol; "Antes en" Rocket Code, Wawandco, Koombea; "Stack" with the existing tech icons), a short/long bio toggle (short = current statement line; long = the two paragraphs from docs/contexto-rediseno.md), and a hand-maintained "Ahora" line with its update date.
- S3 Proyectos: replace the "próximamente" plate with a "Construyendo" list: name + one line + repository link (this portfolio, KevDots, the Homebrew tap) and a pending row for the first case study.
- S4 Experiencia: company names linked to their sites with an external-link icon tile (no arrow glued to the text), descriptions clamped to two lines with "ver más" / "ver menos", formación and idiomas with dotted leaders between name and detail (no numerals).
- S5 Pie: build readout "kevindev.co v3 · rev <sha> · desplegado <fecha>" with the rev linking to the commit on GitHub.
- Rules kept: no numbering, no left borders, no emojis, neutral Spanish UI copy, no AI attribution in commits.

## Tasks

- T1 (S1) inline: hero HUD and Ver CV. Status: done (commit below).
- T2 (S2) inline: about facts, bio toggle, Ahora line. Status: done (commit below).
- T3 (S3) inline: Construyendo list. Status: done (commit below).
- T4 (S4) inline: experience links, clamp, dotted leaders. Status: done (commit below).
- T5 (S5) inline: footer readout. Status: done (commit below).
- T6 verify: pnpm build, Playwright 1440/390. Status: done (commit below).

## Log

- L1 (2026-11-15) Kevin: "toma un recopilatorio con playwright, screenshots y busca portafolios buenos famosos y copia ideas para replicarlas en lo que tenemos para mejorar secciones". Research captured in docs/referencias-portafolios.md; Kevin selected all four idea groups (Inicio, Sobre mí, Proyectos, Experiencia y pie).
- L2 Company logos: sites only expose PNG/WebP wordmarks of mixed styles (Koombea none), so company tiles use initials in the chamfered style instead of fetched logos. CV found at public/CV_KEVIN_ES.pdf.
- L3 Implemented inline (T1–T5) in Portfolio.astro, portfolio.css, portfolio.ts. Verified in Playwright at 1440 and 390: HUD shows rev/deploy/viewport/live time, Ver CV opens the PDF, bio toggle swaps short/long, fact rows wrap on phones, Construyendo grid collapses to one column, company links with icon tile, clamp hides "ver más" when the text fits (Koombea) and toggles ver más/ver menos, dotted leaders hold at both widths (institution under the title, years on the right), footer readout links the commit. pnpm build ok; rev and date present in the built HTML. No horizontal overflow at 390.
- L4 (2026-11-15) Kevin: "esos colores azules no son muy genericos de diseño con ia? probemos otros colores, primero commitea todo para probar como quedaria con distintos paletas de colores" and then "a mi me gusta mucho el amarillo, el purpura, el ngro podriamos hacer una combinacion de todo esto para que tome un estilo antiguo ochentero pero que se vea como una web de desarrollador o programador sin agregar muchas cosas innecesarias". Every hard-coded colour in portfolio.css and chatbot.css moved to tokens on :root (color-mix for alphas); the Pixi scene and the dot portrait read the tokens. Palettes behind `?paleta=`: grafito, pizarra, ciruela, hielo, ochenta (black with purple cast, purple signal, yellow actions, yellow closing block with black mail button). Also fixed: `.kd-btn` text colour lost to `[data-kd] a`, and the chat launcher now takes the paper action colours over the light block. Default palette unchanged until Kevin picks one.
- L5 (2026-11-16) Kevin: "me gusta la paleta de negro gris con amarillo o azul, http://localhost:4321/?paleta=hielo deja esto por defecto y elimina las demas rutas con su respectivo codigo de esas paletas". hielo is now the :root default; the data-palette blocks (noche, grafito, pizarra, ciruela, ochenta) and the ?paleta= switch in portfolio.ts are gone; theme-color is #101214.
- L6 (2026-11-16) Kevin (with a screenshot of formación): "eso se ve feo y hace falta mejorar la parte de contacto". Formación and idiomas moved into one plate under the jobs: credentials as rows with a chamfered icon tile (cap / award), languages with a five-diamond meter (data-on). Contact: the lede became three rows "Qué quieres construir / En qué punto está / Para cuándo lo necesitas" with icon tiles above the mail button, and the channels plus the clock sit in a dark card (`.kd-card`, tokens remapped back through --night-* aliases on :root) standing on the paper. The spotlight beam overflowed 10vw: main now clips horizontal overflow. Verified at 1440 and 390, no overflow, pnpm build ok.
