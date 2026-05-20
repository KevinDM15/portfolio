import { useThemeSync } from '../../hooks/useThemeSync';

export function ThemeToggle() {
	const { theme, toggleTheme } = useThemeSync();

	return (
		<div className="fixed top-0 left-8 z-50 flex flex-col items-center" style={{ pointerEvents: 'none' }}>
			{/* Cable */}
			<div
				style={{
					width: '1.5px',
					height: '48px',
					background: 'linear-gradient(to bottom, rgba(212,98,42,0.5), rgba(212,98,42,0.2))',
					flexShrink: 0,
				}}
			/>

			{/* Lamp button */}
			<button
				onClick={toggleTheme}
				aria-label="Toggle theme"
				style={{ pointerEvents: 'auto' }}
				className="
					relative flex items-center justify-center
					w-11 h-11 rounded-full
					backdrop-blur-20 backdrop-saturate-180
					dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5
					light:bg-gradient-to-br light:from-white/80 light:to-white/60
					border dark:border-white/18 light:border-black/10
					dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
					light:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
					transition-all duration-300
					hover:scale-110 active:scale-95
					animate-lamp-swing
				"
			>
				{theme === 'dark' ? (
					<svg
						className="w-5 h-5 transition-transform duration-300 hover:rotate-180"
						style={{ color: '#F2CC8F' }}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<circle cx="12" cy="12" r="4" fill="currentColor" />
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
					</svg>
				) : (
					<svg
						className="w-5 h-5 transition-transform duration-300 hover:-rotate-12"
						style={{ color: '#E07A5F' }}
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-8.14-8.1 8.59 8.59 0 01.25-2A1 1 0 008 2.36a10.14 10.14 0 1014 11.69 1 1 0 00-.36-1.05zm-9.5 6.69A8.14 8.14 0 017.08 5.22v.27a10.15 10.15 0 0010.14 10.14 9.79 9.79 0 002.1-.22 8.11 8.11 0 01-7.18 4.32z" />
					</svg>
				)}
			</button>

			<style>{`
				@keyframes lamp-swing {
					0%, 100% { transform: rotate(-6deg); }
					50%       { transform: rotate(6deg); }
				}
				.animate-lamp-swing {
					transform-origin: top center;
					animation: lamp-swing 4s ease-in-out infinite;
				}
				.animate-lamp-swing:hover {
					animation-play-state: paused;
				}
			`}</style>
		</div>
	);
}
