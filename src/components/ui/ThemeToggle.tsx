import { useThemeSync } from '../../hooks/useThemeSync';

export function ThemeToggle() {
	const { theme, toggleTheme } = useThemeSync();

	return (
		<button
			onClick={toggleTheme}
			className="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-50 rounded-full p-3 sm:p-3.5 transition-all duration-300"
			style={{
				backdropFilter: 'blur(20px) saturate(180%)',
				WebkitBackdropFilter: 'blur(20px) saturate(180%)',
				background: theme === 'dark'
					? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
					: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
				border: theme === 'dark'
					? '1px solid rgba(255,255,255,0.18)'
					: '1px solid rgba(0,0,0,0.1)',
				boxShadow: theme === 'dark'
					? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
					: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
			}}
			aria-label="Toggle theme"
		>
			{/* Sun icon (light mode) */}
			{theme === 'dark' ? (
				<svg
					className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300"
					style={{ color: '#F2CC8F' }}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<circle cx="12" cy="12" r="4" fill="currentColor" />
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
					/>
				</svg>
			) : (
				<svg
					className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300"
					style={{ color: '#E07A5F' }}
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-8.14-8.1 8.59 8.59 0 01.25-2A1 1 0 008 2.36a10.14 10.14 0 1014 11.69 1 1 0 00-.36-1.05zm-9.5 6.69A8.14 8.14 0 017.08 5.22v.27a10.15 10.15 0 0010.14 10.14 9.79 9.79 0 002.1-.22 8.11 8.11 0 01-7.18 4.32z" />
				</svg>
			)}
		</button>
	);
}
