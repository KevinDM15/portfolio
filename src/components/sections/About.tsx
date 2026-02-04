import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThemeSync } from '../../hooks/useThemeSync';

export function SectionAbout() {
	const sectionRef = useRef<HTMLElement>(null);
	const { theme } = useThemeSync();

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Fade in content
			gsap.from('.about-content', {
				opacity: 0,
				y: 30,
				duration: 1,
				scrollTrigger: {
					trigger: '#about',
					start: 'top 70%',
				},
			});

			gsap.from('.about-detail', {
				opacity: 0,
				y: 20,
				duration: 0.8,
				stagger: 0.1,
				scrollTrigger: {
					trigger: '.about-detail',
					start: 'top 80%',
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="about"
			ref={sectionRef}
			className="min-h-screen flex items-center relative overflow-hidden px-8 md:px-16 pt-32 pb-24 transition-colors duration-300"
			style={{
				backgroundColor: theme === 'dark' ? '#0F1419' : '#F8F9FA',
			}}
		>
			{/* Ambient light effect */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl pointer-events-none"
				style={{
					background: 'radial-gradient(circle, rgba(224, 122, 95, 0.3) 0%, transparent 70%)',
				}}
			></div>

			<div className="max-w-6xl w-full mx-auto relative z-10">
				<div className="grid md:grid-cols-2 gap-16">
					{/* Left - Intro */}
					<div className="about-content">
						<h2 className="text-4xl md:text-5xl font-bold text-neutral-lightest mb-6 leading-tight">
							Desarrollador de Barranquilla construyendo experiencias web desde el Caribe
						</h2>
						<p className="text-lg text-neutral-light leading-relaxed mb-6">
							Donde el río Magdalena se encuentra con el mar, yo transformo ideas en código.
							Especializado en arquitecturas modernas y interfaces que cuentan historias.
						</p>
						<p className="text-base text-neutral leading-relaxed">
							Desde el malecón de Barranquilla, con vista a la Luna del Río, creo productos
							digitales que conectan personas y generan impacto real.
						</p>
					</div>

					{/* Right - Details with liquid glass cards */}
					<div className="space-y-6">
						{/* Current work */}
						<div
							className="about-detail relative overflow-hidden rounded-2xl p-6"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: 'linear-gradient(135deg, rgba(224, 122, 95, 0.1) 0%, rgba(224, 122, 95, 0.05) 100%)',
								border: '1px solid rgba(224, 122, 95, 0.2)',
							}}
						>
							<p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
								Actualmente
							</p>
							<p className="text-base text-neutral-lightest">
								Disponible para proyectos freelance y colaboraciones
							</p>
						</div>

						{/* Stack */}
						<div
							className="about-detail relative overflow-hidden rounded-2xl p-6"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
								border: '1px solid rgba(255,255,255,0.1)',
							}}
						>
							<p className="text-xs font-bold text-neutral uppercase tracking-widest mb-3">
								Stack Principal
							</p>
							<p className="text-base text-neutral-light">
								React, TypeScript, Node.js, PostgreSQL, Astro, GSAP, Three.js
							</p>
						</div>

						{/* Approach */}
						<div
							className="about-detail relative overflow-hidden rounded-2xl p-6"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
								border: '1px solid rgba(255,255,255,0.1)',
							}}
						>
							<p className="text-xs font-bold text-neutral uppercase tracking-widest mb-3">
								Enfoque
							</p>
							<p className="text-base text-neutral-light">
								Performance-first, clean architecture, exceptional UI/UX
							</p>
						</div>

						{/* Cultural touch */}
						<div
							className="about-detail relative overflow-hidden rounded-2xl p-6"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: 'linear-gradient(135deg, rgba(242, 204, 143, 0.1) 0%, rgba(242, 204, 143, 0.05) 100%)',
								border: '1px solid rgba(242, 204, 143, 0.2)',
							}}
						>
							<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
								Espíritu Costeño
							</p>
							<p className="text-base text-neutral-light">
								Alegría en el código, innovación en cada línea, soluciones que fluyen como el Caribe
							</p>
						</div>
					</div>
				</div>

				{/* Luna del Río reference with liquid glass */}
				<div className="mt-20">
					<div
						className="inline-block px-6 py-3 rounded-full"
						style={{
							backdropFilter: 'blur(10px) saturate(150%)',
							WebkitBackdropFilter: 'blur(10px) saturate(150%)',
							background: 'rgba(255, 255, 255, 0.03)',
							border: '1px solid rgba(255, 255, 255, 0.08)',
						}}
					>
						<p className="text-sm text-neutral-dark font-mono">
							Inspirado por la Luna del Río — 65 metros de altura, infinitas posibilidades de código
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
