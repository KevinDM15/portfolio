import { useState, useEffect, useRef } from 'react';

interface NavLink {
	label: string;
	shortLabel: string;
	id: string;
	icon: string;
}

const navLinks: NavLink[] = [
	{ label: 'Inicio', shortLabel: 'Inicio', id: 'hero', icon: 'i-mdi-home' },
	{ label: 'Sobre mí', shortLabel: 'Sobre mí', id: 'about', icon: 'i-mdi-account' },
	{ label: 'Experiencia', shortLabel: 'Exp', id: 'experience', icon: 'i-mdi-briefcase' },
	{ label: 'Proyectos', shortLabel: 'Proy', id: 'projects', icon: 'i-mdi-rocket-launch' },
	{ label: 'Contacto', shortLabel: 'Contacto', id: 'contact', icon: 'i-mdi-email' },
];

export function FloatingNav() {
	const [activeSection, setActiveSection] = useState('hero');
	const navRef = useRef<HTMLDivElement>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

	useEffect(() => {
		// Intersection Observer to track active section
		const observerOptions = {
			root: null,
			rootMargin: '-50% 0px -50% 0px',
			threshold: 0,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			});
		}, observerOptions);

		// Observe all sections
		navLinks.forEach(({ id }) => {
			const section = document.getElementById(id);
			if (section) observer.observe(section);
		});

		return () => observer.disconnect();
	}, []);

	// Update indicator position when active section changes
	useEffect(() => {
		if (!navRef.current) return;

		const updateIndicator = () => {
			const activeButton = navRef.current?.querySelector(`button[data-section="${activeSection}"]`) as HTMLElement;
			if (activeButton) {
				const left = activeButton.offsetLeft;
				const width = activeButton.offsetWidth;
				setIndicatorStyle({ left, width });
			}
		};

		// Small delay to ensure DOM is ready
		const timer = setTimeout(updateIndicator, 0);

		// Also update on resize
		window.addEventListener('resize', updateIndicator);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', updateIndicator);
		};
	}, [activeSection]);

	const scrollToSection = (id: string) => {
		const section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<nav className="fixed top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95%] sm:max-w-[600px] backdrop-blur-20 backdrop-saturate-180">
			{/* Liquid glass container */}
			<div className="relative">
				{/* Glass background with gradient border */}
				<div className="absolute inset-0 rounded-full transition-all duration-300 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 light:bg-gradient-to-br light:from-white/80 light:to-white/60 border dark:border-white/18 light:border-black/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] light:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"></div>

				{/* Inner glow effect */}
				<div
					className="absolute inset-0 rounded-full opacity-50 transition-opacity duration-300"
					style={{
						background: 'radial-gradient(circle at 50% 0%, rgba(224, 122, 95, 0.2), transparent 70%)',
					}}
				></div>

				{/* Content */}
				<div ref={navRef} className="relative flex items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 sm:py-2">
					{/* Animated sliding background indicator */}
					<div
						className="absolute rounded-full pointer-events-none bg-gradient-to-br from-accent to-accent-light shadow-accent-glow"
						style={{
							left: `${indicatorStyle.left}px`,
							width: `${indicatorStyle.width}px`,
							height: 'calc(100% - 0.75rem)',
							top: '0.375rem',
							transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
						}}
					></div>

					{navLinks.map((link) => {
						const isActive = activeSection === link.id;
						return (
							<button
								key={link.id}
								data-section={link.id}
								onClick={() => scrollToSection(link.id)}
								className="relative px-2.5 py-2 sm:px-4 sm:py-2.5 md:px-5 text-sm sm:text-sm font-extrabold rounded-full transition-colors duration-300 flex items-center justify-center min-w-[44px] sm:min-w-0"
								style={{
									color: isActive ? '#F8F9FA' : 'var(--color-text-muted)',
									fontFamily: 'var(--font-nav)',
								}}
								aria-label={link.label}
								title={link.label}
							>
								{/* Icon only for mobile */}
								<span className={`relative z-10 sm:hidden ${link.icon} text-lg`}></span>
								{/* Full label for tablets and up */}
								<span className="relative z-10 hidden sm:inline whitespace-nowrap">{link.label}</span>
							</button>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
