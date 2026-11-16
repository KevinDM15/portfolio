#!/usr/bin/env node
/*
 * Dead-code audit, run after every commit and before any push (pnpm check:dead).
 * Lists source files under src/ that nothing imports, public assets that nothing references, and dependencies
 * that no source file imports. Exits with 1 when it finds something, so it can gate a push.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';

const root = process.cwd();
const SOURCE = /\.(astro|ts|tsx|mjs|css)$/;
const ENTRY = /^src\/pages\//;

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const sources = walk(join(root, 'src')).filter((f) => SOURCE.test(f));
const configs = ['astro.config.mjs', 'uno.config.ts'].map((f) => join(root, f));
const texts = new Map([...sources, ...configs].map((f) => [f, readFileSync(f, 'utf8')]));
const rel = (f) => relative(root, f);

/* a file is alive when some other file names it in an import or a path (by basename, extension optional) */
function referenced(file) {
	const stem = basename(file, extname(file));
	// an index file is reached through its folder name
	const name = stem === 'index' ? basename(join(file, '..')) : stem;
	const pattern = new RegExp(`[/'"\`]${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.(astro|ts|tsx|css|js|mjs))?['"\`]`);
	for (const [other, text] of texts) if (other !== file && pattern.test(text)) return true;
	return false;
}

const orphanSources = sources.filter((f) => !ENTRY.test(rel(f)) && !referenced(f));

/* public assets that no source file mentions by path */
const skipAssets = /^\/(fonts\/geist-|svg\/tech\/|favicon\.|CV_)/;
const assets = walk(join(root, 'public')).map((f) => '/' + relative(join(root, 'public'), f)).filter((p) => !skipAssets.test(p));
const allText = [...texts.values()].join('\n');
const orphanAssets = assets.filter((p) => !allText.includes(p));

/* dependencies that no source file imports */
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
/* packages the toolchain loads without an import in src: the framework, its integrations, type packages */
const implicit = new Set(['astro', '@astrojs/vercel', '@astrojs/react', '@unocss/astro', '@unocss/reset', 'unocss', 'react-dom', 'only-allow', '@types/react', '@types/react-dom', '@types/node', 'typescript']);
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((d) => !implicit.has(d));
const orphanDeps = deps.filter((d) => !new RegExp(`from ['"]${d}(/|['"])|import\\(['"]${d}(/|['"])`).test(allText));

const report = (title, items) => { if (items.length) console.log(`\n${title}\n${items.map((i) => `  ${i}`).join('\n')}`); };
report('Source files nothing imports:', orphanSources.map(rel));
report('Public assets nothing references:', orphanAssets);
report('Dependencies nothing imports:', orphanDeps);

const total = orphanSources.length + orphanAssets.length + orphanDeps.length;
console.log(total ? `\n${total} item(s) to delete or justify.` : 'No dead code found.');
process.exit(total ? 1 : 0);
