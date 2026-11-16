import { defineConfig } from 'unocss';

/*
 * UnoCSS stays only for the reset it injects (see astro.config.mjs). The landing and the chat are styled with their
 * own stylesheets, so no preset, shortcut or theme is needed here.
 */
export default defineConfig({
	presets: [],
});
