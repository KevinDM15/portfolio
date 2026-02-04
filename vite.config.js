import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		allowedHosts: [
			'localhost',
			'127.0.0.1',
			'*.ngrok-free.dev',
			'*.ngrok.io',
			'pyrolytic-duely-braden.ngrok-free.dev',
		],
	},
});
