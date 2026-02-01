import { defineConfig, presetWind, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetWind(),
		presetIcons({
			scale: 1.2,
			cdn: 'https://esm.sh/',
		}),
	],
	shortcuts: {
		'btn': 'px-4 py-2 rounded transition-colors',
		'btn-primary': 'btn bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
		'btn-secondary': 'btn bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
		'container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
		'section': 'py-16 md:py-24',
	},
	theme: {
		colors: {
			primary: '#3b82f6',
			secondary: '#8b5cf6',
		},
	},
});
