import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThemeSync } from '../../hooks/useThemeSync';

const experiences = [
	{
		id: 'senior-dev',
		company: 'Tech Company Inc.',
		position: 'Senior Full-Stack Developer',
		period: '2022 - Presente',
		description: 'Liderazgo técnico en desarrollo de aplicaciones web escalables. Arquitectura de microservicios, optimización de performance y mentoreo de equipo junior.',
		technologies: ['React', 'Node.js', 'AWS', 'Docker'],
	},
	{
		id: 'fullstack-dev',
		company: 'Digital Agency',
		position: 'Full-Stack Developer',
		period: '2020 - 2022',
		description: 'Desarrollo de sitios web y aplicaciones para clientes corporativos. Implementación de diseños responsivos y optimización SEO.',
		technologies: ['Vue.js', 'Laravel', 'MySQL'],
	},
	{
		id: 'frontend-dev',
		company: 'Startup XYZ',
		position: 'Frontend Developer',
		period: '2018 - 2020',
		description: 'Desarrollo de interfaces de usuario modernas y responsivas. Colaboración estrecha con diseñadores y equipo backend.',
		technologies: ['JavaScript', 'HTML/CSS', 'SASS'],
	},
];

export function SectionExperience() {
	const sectionRef = useRef<HTMLElement>(null);
	const { theme } = useThemeSync();

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from('.experience-title', {
				opacity: 0,
				y: 30,
				duration: 1,
				scrollTrigger: {
					trigger: '#experience',
					start: 'top 70%',
				},
			});

			gsap.from('.experience-item', {
				opacity: 0,
				y: 20,
				duration: 0.8,
				stagger: 0.2,
				scrollTrigger: {
					trigger: '.experience-item',
					start: 'top 80%',
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="experience"
			ref={sectionRef}
			className="min-h-screen flex items-center relative overflow-hidden px-8 md:px-16 pt-32 pb-24 transition-colors duration-300"
			style={{
				backgroundColor: theme === 'dark' ? '#0F1419' : '#F8F9FA',
			}}
		>
			<div className="max-w-5xl w-full mx-auto">
				<h2 className="experience-title text-4xl md:text-5xl font-bold text-neutral-lightest mb-16">
					Experiencia
				</h2>

				<div className="space-y-16">
					{experiences.map((exp) => (
						<div key={exp.id} className="experience-item">
							<div className="mb-4">
								<div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
									<h3 className="text-2xl md:text-3xl font-bold text-neutral-lightest">
										{exp.position}
									</h3>
									<span className="text-sm text-neutral font-mono">
										{exp.period}
									</span>
								</div>
								<p className="text-lg text-accent font-medium">
									{exp.company}
								</p>
							</div>

							<p className="text-base text-neutral-light leading-relaxed mb-4">
								{exp.description}
							</p>

							<div className="flex flex-wrap gap-2">
								{exp.technologies.map((tech) => (
									<span
										key={tech}
										className="text-xs text-neutral-lightest bg-neutral-dark/50 px-3 py-1 rounded-full font-mono"
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
