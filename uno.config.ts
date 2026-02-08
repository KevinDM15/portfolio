import { defineConfig, presetWind, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetWind({
			dark: {
				dark: '[data-theme="dark"]',
				light: '[data-theme="light"]'
			}
		}),
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

		/* Theme-aware utilities */
		'bg-theme': 'bg-theme-bg transition-colors duration-300',
		'bg-theme-lighter': 'bg-theme-bg-lighter transition-colors duration-300',
		'bg-theme-alt': 'bg-theme-bg-alt transition-colors duration-300',
		'text-theme': 'text-theme-text transition-colors duration-300',
		'text-theme-secondary': 'text-theme-text-secondary transition-colors duration-300',
		'text-theme-muted': 'text-theme-text-muted transition-colors duration-300',

		/* Glassmorphism cards */
		'glass-card': 'backdrop-blur-20 backdrop-saturate-180 rounded-2xl border dark:border-white/18 light:border-black/10 transition-all duration-300',
		'glass-card-accent': 'backdrop-blur-20 backdrop-saturate-180 rounded-2xl border dark:border-accent/20 light:border-accent/30 dark:bg-gradient-to-br dark:from-accent/10 dark:to-accent/5 light:bg-gradient-to-br light:from-accent/15 light:to-accent/8 transition-all duration-300',
		'glass-card-secondary': 'backdrop-blur-20 backdrop-saturate-180 rounded-2xl border dark:border-secondary/20 light:border-secondary/30 dark:bg-gradient-to-br dark:from-secondary/10 dark:to-secondary/5 light:bg-gradient-to-br light:from-secondary/15 light:to-secondary/8 transition-all duration-300',
		'glass-card-neutral': 'backdrop-blur-20 backdrop-saturate-180 rounded-2xl border dark:border-white/10 light:border-black/10 dark:bg-gradient-to-br dark:from-white/8 dark:to-white/3 light:bg-gradient-to-br light:from-black/6 light:to-black/2 transition-all duration-300',

		/* Section layouts */
		'section-base': 'min-h-screen flex items-center relative overflow-hidden px-8 md:px-16 pt-32 pb-24 bg-theme',
	},
	theme: {
		colors: {
			/* Theme-aware colors (CSS variables that change with [data-theme]) */
			'theme-bg': 'var(--color-bg)',
			'theme-bg-lighter': 'var(--color-bg-lighter)',
			'theme-bg-alt': 'var(--color-bg-alt)',
			'theme-text': 'var(--color-text-primary)',
			'theme-text-secondary': 'var(--color-text-secondary)',
			'theme-text-muted': 'var(--color-text-muted)',

			/* Professional Warm Palette (static colors) */
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
