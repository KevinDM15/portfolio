import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutSectionProps } from '../../types/content';

const SKILLS = [
	{ label: 'React', weight: 'font-black' },
	{ label: 'Next.js', weight: 'font-bold' },
	{ label: 'NestJS', weight: 'font-black' },
	{ label: 'TypeScript', weight: 'font-bold' },
	{ label: 'PostgreSQL', weight: 'font-light' },
	{ label: 'AWS', weight: 'font-black' },
	{ label: 'Go', weight: 'font-light' },
	{ label: 'Docker', weight: 'font-bold' },
	{ label: 'Redux', weight: 'font-light' },
	{ label: 'MaterialUI', weight: 'font-bold' },
];

const STATS = [
	{ value: '6+', label: 'años de\nexperiencia' },
	{ value: '3', label: 'empresas\ntecnológicas' },
	{ value: '∞', label: 'líneas de\ncódigo' },
];

export function SectionAbout({ aboutContent = [] }: AboutSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	const intro = aboutContent.find(item => item.data.type === 'intro');

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			// Label slides in
			gsap.fromTo('.about-label',
				{ opacity: 0, x: -20 },
				{
					opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
					scrollTrigger: { trigger: '#about', start: 'top 75%', once: true },
				}
			);

			// Big words stagger up
			gsap.fromTo('.about-word',
				{ opacity: 0, y: 60, skewY: 4 },
				{
					opacity: 1, y: 0, skewY: 0,
					duration: 0.9, stagger: 0.12, ease: 'power4.out',
					scrollTrigger: { trigger: '#about', start: 'top 70%', once: true },
				}
			);

			// Divider expands
			gsap.fromTo('.about-divider',
				{ scaleX: 0, transformOrigin: 'left center' },
				{
					scaleX: 1, duration: 0.8, ease: 'power3.inOut', delay: 0.3,
					scrollTrigger: { trigger: '#about', start: 'top 65%', once: true },
				}
			);

			// Right column fades up
			gsap.fromTo('.about-right',
				{ opacity: 0, y: 30 },
				{
					opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4,
					scrollTrigger: { trigger: '#about', start: 'top 65%', once: true },
				}
			);

			// Stats count up
			gsap.fromTo('.about-stat',
				{ opacity: 0, y: 20 },
				{
					opacity: 1, y: 0,
					duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.6,
					scrollTrigger: { trigger: '#about', start: 'top 60%', once: true },
				}
			);

			// Skills stagger
			gsap.fromTo('.skill-item',
				{ opacity: 0, y: 10 },
				{
					opacity: 1, y: 0,
					duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.5,
					scrollTrigger: { trigger: '.about-skills', start: 'top 80%', once: true },
				}
			);
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="about"
			ref={sectionRef}
			className="relative dark:bg-[#1C1713] light:bg-[#EDE8E2] py-28 sm:py-36 px-6 sm:px-10 md:px-16 overflow-hidden"
		>
			{/* Grain texture overlay */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundRepeat: 'repeat',
					backgroundSize: '128px',
				}}
			/>

			{/* Decorative accent line top */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

			<div className="max-w-6xl w-full mx-auto relative z-10">

				{/* Section label */}
				<div className="about-label flex items-center gap-3 mb-12">
					<span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent">02 — Sobre mí</span>
					<div className="h-px w-12 bg-accent/40" />
				</div>

				{/* Main editorial layout */}
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

					{/* LEFT — Big typography */}
					<div className="flex-none lg:w-[42%]">
						<div className="overflow-hidden">
							<h2
								className="about-word block font-black leading-[0.88] tracking-tighter text-theme"
								style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
							>
								Full-
							</h2>
						</div>
						<div className="overflow-hidden">
							<h2
								className="about-word block font-black leading-[0.88] tracking-tighter text-transparent bg-clip-text"
								style={{
									fontSize: 'clamp(3.5rem, 8vw, 7rem)',
									backgroundImage: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
								}}
							>
								Stack
							</h2>
						</div>
						<div className="overflow-hidden">
							<h2
								className="about-word block font-black leading-[0.88] tracking-tighter text-theme"
								style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
							>
								Dev.
							</h2>
						</div>

						{/* Divider */}
						<div className="about-divider h-px bg-gradient-to-r from-accent/60 to-transparent mt-8 mb-8" />

						{/* Stats row */}
						<div className="flex gap-8">
							{STATS.map(stat => (
								<div key={stat.value} className="about-stat">
									<div
										className="font-black text-accent leading-none mb-1"
										style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
									>
										{stat.value}
									</div>
									<div className="text-[10px] font-mono uppercase tracking-wider text-theme-muted whitespace-pre-line leading-relaxed">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* RIGHT — Content */}
					<div className="about-right flex-1 min-w-0 pt-0 lg:pt-4">

						{/* Bio */}
						<p
							className="text-theme leading-relaxed mb-10"
							style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}
						>
							{intro?.body ?? 'Desarrollador Full-Stack con más de 6 años construyendo productos digitales que escalan. Me obsesiona la arquitectura limpia, el código legible y las interfaces que sienten naturales.'}
						</p>

						{/* Current work */}
						<div className="mb-10 pl-4 border-l-2 border-accent/40">
							<p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-2">Actualmente</p>
							<p className="text-sm text-theme-secondary leading-relaxed">
								The Rocket Code — construyendo APIs con NestJS y arquitectura hexagonal. Liderando decisiones técnicas en un equipo de producto.
							</p>
						</div>

						{/* Skills — typographic, no badges */}
						<div className="about-skills">
							<p className="text-[10px] font-mono uppercase tracking-[0.3em] text-theme-muted mb-5">Stack técnico</p>
							<div className="flex flex-wrap gap-x-4 gap-y-2">
								{SKILLS.map((skill, i) => (
									<span
										key={skill.label}
										className={`skill-item ${skill.weight} text-theme-secondary hover:text-accent transition-colors duration-200 cursor-default`}
										style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}
									>
										{skill.label}
										{i < SKILLS.length - 1 && (
											<span className="ml-4 text-theme-muted/30 font-light select-none">·</span>
										)}
									</span>
								))}
							</div>
						</div>

						{/* Disponibilidad */}
						<div className="mt-12 inline-flex items-center gap-3">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
							</span>
							<span className="text-xs font-mono text-theme-muted">
								Abierto a nuevos proyectos y colaboraciones
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Decorative bottom line */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
		</section>
	);
}
