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
		/* Typography */
		'font-display': 'font-sans',
		'font-code': 'font-mono',

		/* Buttons */
		'btn': 'px-8 py-4 transition-all duration-300 font-semibold',
		'btn-primary': 'btn bg-accent text-white hover:bg-accent-light shadow-accent-glow',
		'btn-secondary': 'btn border-2 border-neutral-light text-neutral-lighter hover:bg-neutral-darker hover:border-accent',

		/* Typography - Big & Bold */
		'heading-massive': 'text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none tracking-tighter',
		'heading-1': 'text-6xl md:text-7xl lg:text-8xl font-black tracking-tight',
		'heading-2': 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
		'heading-3': 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
		'body-large': 'text-xl md:text-2xl text-neutral-lighter leading-relaxed',
		'body-text': 'text-base md:text-lg text-neutral-lighter leading-relaxed',

		/* Cards & Borders */
		'card': 'p-6 bg-dark-lighter transition-all',
		'card-highlight': 'border-l-4 border-accent p-6 bg-dark-lighter/50 hover:bg-dark-lighter transition-all',

		/* Layout */
		'container': 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12',
		'section': 'h-screen flex items-center',
	},
	theme: {
		colors: {
			/* Professional Warm Palette */
			accent: {
				DEFAULT: '#E07A5F', // Warm terracotta
				light: '#F4A59D',
				dark: '#C4624A',
			},
			secondary: {
				DEFAULT: '#F2CC8F', // Warm beige
				light: '#F5D9A8',
				dark: '#E0B878',
			},
			/* Neutral grays with warmth */
			neutral: {
				lightest: '#F8F9FA',
				lighter: '#E8E9EA',
				light: '#C1C3C5',
				DEFAULT: '#81878B',
				dark: '#4A5057',
				darker: '#2D3339',
				darkest: '#1A1D23',
			},
			/* Dark backgrounds */
			dark: {
				DEFAULT: '#0F1419', // Softer than pure black
				lighter: '#1A1F26',
				alt: '#252B33',
			},
		},
		boxShadow: {
			'accent-glow': '0 4px 20px rgba(224, 122, 95, 0.15)',
			'accent-glow-lg': '0 8px 30px rgba(224, 122, 95, 0.25)',
		},
	},
});
