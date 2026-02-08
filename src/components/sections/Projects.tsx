import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from '../ui/ProjectCard';
import type { ProjectsSectionProps } from '../../types/content';

export function Projects({ projects = [] }: ProjectsSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		// No animations for this section
	}, []);

	return (
		<section
			id="projects"
			ref={sectionRef}
			className="min-h-screen flex items-center justify-center relative overflow-hidden px-8 md:px-16 pt-32 pb-24 bg-theme dark:bg-[#191419] light:bg-[#EFEFEF]"
		>
			<div className="text-center">
				<h2 className="projects-title text-6xl md:text-8xl font-display font-black text-theme mb-6 tracking-tighter">
					Proyectos
				</h2>
				<div className="projects-coming-soon">
					<p className="text-2xl md:text-3xl text-theme-secondary font-medium mb-4">
						Coming Soon
					</p>
					<p className="text-base text-theme-muted font-mono">
						Preparando algo especial...
					</p>
				</div>
			</div>
		</section>
	);
}
