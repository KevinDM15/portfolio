import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface NavItem {
	id: string;
	label: string;
	href: string;
}

const navItems: NavItem[] = [
	{ id: 'hero', label: 'Inicio', href: '#hero' },
	{ id: 'about', label: 'Sobre Mí', href: '#about' },
	{ id: 'projects', label: 'Proyectos', href: '#projects' },
	{ id: 'experience', label: 'Experiencia', href: '#experience' },
	{ id: 'contact', label: 'Contacto', href: '#contact' },
];

export function Navigation() {
	const [activeSection, setActiveSection] = useState('hero');

	useEffect(() => {
		const sections = document.querySelectorAll('section[id]');

		ScrollTrigger.create({
			trigger: 'body',
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: () => {
				sections.forEach((section) => {
					const rect = section.getBoundingClientRect();
					const isActive = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;

					if (isActive) {
						setActiveSection(section.id);
					}
				});
			},
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault();
		const target = document.querySelector(href);
		if (target && (window as any).lenis) {
			(window as any).lenis.scrollTo(target, { duration: 1.5 });
		}
	};

	return (
		<nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
			{navItems.map((item) => (
				<a
					key={item.id}
					href={item.href}
					onClick={(e) => handleNavClick(e, item.href)}
					className={`
						w-3 h-3 rounded-full transition-all cursor-pointer border
						${activeSection === item.id
							? 'bg-accent border-accent scale-125 shadow-accent-glow'
							: 'bg-transparent border-neutral-dark hover:border-accent hover:bg-accent/20'
						}
					`}
					aria-label={item.label}
					title={item.label}
				></a>
			))}
		</nav>
	);
}
