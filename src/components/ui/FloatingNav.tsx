import { useState, useEffect, useRef } from 'react';
import { useThemeSync } from '../../hooks/useThemeSync';

interface NavLink {
	label: string;
	href: string;
}

const navLinks: NavLink[] = [
	{ label: 'Inicio', href: '/' },
	{ label: 'Sobre mí', href: '/about' },
	{ label: 'Experiencia', href: '/experience' },
	{ label: 'Contacto', href: '/contact' },
];

export function FloatingNav() {
	const [currentPath, setCurrentPath] = useState('');
	const navRef = useRef<HTMLDivElement>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
	const { theme } = useThemeSync();

	useEffect(() => {
		// Set initial path
		setCurrentPath(window.location.pathname);

		// Update path on navigation (for View Transitions)
		const updatePath = () => {
			setCurrentPath(window.location.pathname);
		};

		// Listen to both popstate (browser back/forward) and astro page events
		window.addEventListener('popstate', updatePath);

		// Listen to Astro view transitions
		document.addEventListener('astro:page-load', updatePath);
		document.addEventListener('astro:after-swap', updatePath);

		return () => {
			window.removeEventListener('popstate', updatePath);
			document.removeEventListener('astro:page-load', updatePath);
			document.removeEventListener('astro:after-swap', updatePath);
		};
	}, []);

	// Update indicator position when path changes
	useEffect(() => {
		if (!navRef.current) return;

		const updateIndicator = () => {
			const activeLink = navRef.current?.querySelector(`a[href="${currentPath}"]`) as HTMLElement;
			if (activeLink) {
				const left = activeLink.offsetLeft;
				const width = activeLink.offsetWidth;
				setIndicatorStyle({ left, width });
			}
		};

		// Small delay to ensure DOM is ready
		const timer = setTimeout(updateIndicator, 0);

		return () => clearTimeout(timer);
	}, [currentPath]);

	return (
		<nav
			className="fixed top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-[600px]"
			style={{
				backdropFilter: 'blur(20px) saturate(180%)',
				WebkitBackdropFilter: 'blur(20px) saturate(180%)',
			}}
		>
			{/* Liquid glass container */}
			<div className="relative">
				{/* Glass background with gradient border */}
				<div
					className="absolute inset-0 rounded-full sm:rounded-full transition-all duration-300"
					style={{
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
				></div>

				{/* Inner glow effect */}
				<div
					className="absolute inset-0 rounded-full sm:rounded-full opacity-50 transition-opacity duration-300"
					style={{
						background: 'radial-gradient(circle at 50% 0%, rgba(224, 122, 95, 0.2), transparent 70%)',
					}}
				></div>

				{/* Content */}
				<div ref={navRef} className="relative flex items-center justify-center sm:justify-start gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2">
					{/* Animated sliding background indicator */}
					<div
						className="absolute rounded-full pointer-events-none"
						style={{
							background: 'linear-gradient(135deg, #E07A5F 0%, #F4A59D 100%)',
							boxShadow: '0 4px 15px rgba(224, 122, 95, 0.4)',
							left: `${indicatorStyle.left}px`,
							width: `${indicatorStyle.width}px`,
							height: 'calc(100% - 0.75rem)',
							top: '0.375rem',
							transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
						}}
					></div>

					{navLinks.map((link) => {
						const isActive = currentPath === link.href;
						return (
							<a
								key={link.href}
								href={link.href}
								className="relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 text-xs sm:text-sm font-extrabold rounded-full whitespace-nowrap transition-colors duration-300"
								style={{
									color: isActive
										? '#F8F9FA'
										: theme === 'dark'
											? '#C1C3C5'
											: '#666370',
									fontFamily: 'var(--font-nav)',
								}}
							>
								<span className="relative z-10">{link.label}</span>
							</a>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
