import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ExperienceSectionProps } from '../../types/content';

export function SectionExperience({ experiences = [] }: ExperienceSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#experience',
					start: 'top 70%',
					once: true, // Solo ejecuta una vez
				},
			});

			// Title slides in with power
			tl.fromTo('.experience-title',
				{ opacity: 0, x: -50, skewX: 5 },
				{ opacity: 1, x: 0, skewX: 0, duration: 0.5, ease: 'power2.out' }
			);

			// Experience items cascade in with bounce
			tl.fromTo('.experience-item',
				{ opacity: 0, x: -40, scale: 0.95 },
				{
					opacity: 1,
					x: 0,
					scale: 1,
					duration: 0.5,
					stagger: 0.15,
					ease: 'back.out(1.2)',
				},
				'-=0.3'
			);
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="experience"
			ref={sectionRef}
			className="section-base dark:bg-[#141419] light:bg-neutral-lighter"
		>
			<div className="max-w-5xl w-full mx-auto">
				<h2 className="experience-title text-4xl md:text-5xl font-bold text-theme mb-16">
					Experiencia
				</h2>

				<div className="space-y-16">
					{experiences.map((exp) => (
						<div key={exp.id} className="experience-item">
							<div className="mb-4">
								<div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
									<h3 className="text-2xl md:text-3xl font-bold text-theme">
										{exp.data.position}
									</h3>
									<span className="text-sm text-theme-muted font-mono">
										{exp.data.period}
									</span>
								</div>
								<p className="text-lg text-accent font-medium">
									{exp.data.company}
								</p>
							</div>

							<p className="text-base text-theme-secondary leading-relaxed mb-4">
								{exp.body}
							</p>

							<div className="flex flex-wrap gap-2">
								{exp.data.technologies.map((tech) => (
									<span
										key={tech}
										className="text-xs text-theme dark:bg-neutral-dark/50 light:bg-neutral-dark/20 px-3 py-1 rounded-full font-mono"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
