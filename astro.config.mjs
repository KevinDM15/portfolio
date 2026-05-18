// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import unocss from '@unocss/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	adapter: vercel(),
	integrations: [
		react(),
		unocss({
			injectReset: true,
		}),
	],
	vite: {
		server: {
			allowedHosts: [
				'pyrolytic-duely-braden.ngrok-free.dev',
				'*.ngrok-free.dev',
				'*.ngrok.io',
			],
		},
	},
});
