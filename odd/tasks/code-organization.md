# Code organization: the landing split by responsibility

Objective: apply Kevin's coding rules to the landing code without changing what the page renders. Branch feat/reference-ideas. Delivery: single-pr. Checks: pnpm build, Playwright at 1440 and 390 before/after comparison.

## Specs

- S1 No inline SVG in section markup: every icon and figure becomes a reusable component under `src/components/icons/` (icons) or next to its section (orbit, waves, clock), imported where used.
- S2 Everything in the folder of its responsibility: data in `src/components/portfolio/data.ts`, build facts in `src/components/portfolio/build.ts`, one Astro component per section under `src/components/portfolio/sections/`, one behaviour module per concern under `src/components/portfolio/behaviours/`, styles split by section under `src/components/portfolio/styles/`.
- S3 Single responsibility per file, reuse over copy (one external-link tile, one chamfer tile, one icon per shape), readable names, no leftover code.
- S4 The rendered page stays the same: same markup hooks (`data-k`, `data-node`, classes), same CSS cascade order, same behaviour. Verified by build and screenshots.
- S5 The rules are written down: project CLAUDE.md "Coding Rules" (done in 007a55d) and memory.

## Tasks

- T1 (S1, S2) inline: icons and figure components. Status: pending.
- T2 (S2) inline: data.ts, build.ts, section components, Portfolio.astro as composer. Status: pending.
- T3 (S2, S3) inline: behaviours split from portfolio.ts. Status: pending.
- T4 (S2) inline: styles split by section, imported in cascade order. Status: pending.
- T5 (S4) verify: build, Playwright 1440/390. Status: pending.

## Log

- L1 (2026-11-16) Kevin: "luego miremos en todo el proyecto para organizar el codigo y hacer buenas practicas, he visto que tienes SVG en todo el codigo sin organizar, eso no deberia ser nunca asi y anotalo en las reglas de codificacion, todo debe estar organizado en sus carpetas, simple responsabilidad, reutilizacion, 0 codigo malo no legible, buenas practicas".
