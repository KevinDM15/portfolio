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
