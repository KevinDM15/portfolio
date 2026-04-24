import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ExperienceSectionProps } from '../../types/content';

export function SectionExperience({ experiences = [] }: ExperienceSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		if (!sectionRef.current || !containerRef.current) return;

		gsap.registerPlugin(ScrollTrigger);

		let lastIndex = 0;

		const ctx = gsap.context(() => {
			// Pin the section while scrolling through experiences
			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: 'top top',
				end: `+=${experiences.length * 100}%`,
				pin: true,
				pinSpacing: true,
				scrub: 0.5,
				onUpdate: (self) => {
					const progress = self.progress;

					// Calculate which experience should be showing
					const newIndex = Math.min(
						Math.floor(progress * experiences.length),
						experiences.length - 1
					);

					if (newIndex !== lastIndex) {
						lastIndex = newIndex;
						setIsTransitioning(true);
						setTimeout(() => {
							setCurrentIndex(newIndex);
							setTimeout(() => setIsTransitioning(false), 50);
						}, 300);
					}
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, [experiences]);

	// Current experience to display
	const currentExp = experiences[currentIndex];

	return (
		<section
			id="experience"
			ref={sectionRef}
			className="h-screen flex items-center relative dark:bg-[#141419] light:bg-neutral-lighter overflow-hidden"
		>
			<div ref={containerRef} className="max-w-5xl w-full mx-auto px-6 sm:px-10 md:px-16 relative z-10">
				<div className="flex gap-6 sm:gap-10 md:gap-14">
					{/* Timeline - columna fija */}
					<div className="relative flex-none w-0.5">
						<div className="absolute inset-0 bg-gradient-to-b from-accent via-secondary to-accent opacity-20"></div>
						<div
							className="absolute left-0 top-0 w-full bg-gradient-to-b from-accent via-secondary to-accent transition-all duration-500"
							style={{ height: `${(currentIndex + 1) / experiences.length * 100}%` }}
						></div>
						{/* Progress badge */}
						<div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
							<div className="bg-accent text-white font-black text-xs px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
								{currentIndex + 1}/{experiences.length}
							</div>
						</div>
						{/* Dot */}
						<div className="absolute top-8 left-1/2 -translate-x-1/2">
							<div className="relative">
								<div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75"></div>
								<div className="relative w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent border-2 sm:border-4 dark:border-[#141419] light:border-neutral-lighter"></div>
							</div>
						</div>
					</div>

					{/* Content - columna flexible */}
					{currentExp && (
						<div
							key={currentExp.id}
							className={`min-w-0 flex-1 transition-all duration-500 ${
								isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
							}`}
						>
							<h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-theme mb-3 sm:mb-4 leading-tight">
								{currentExp.data.position}
							</h3>

							<div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
								<p className="text-lg sm:text-2xl md:text-3xl text-accent font-bold">
									{currentExp.data.company}
								</p>
								<span className="text-theme-muted hidden sm:inline">•</span>
								<div className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold font-mono uppercase tracking-wider bg-accent/20 text-accent">
									{currentExp.data.period}
								</div>
							</div>

							<p className="text-sm sm:text-base md:text-lg text-theme-secondary leading-relaxed mb-4 sm:mb-8">
								{currentExp.body}
							</p>

							<div className="flex flex-wrap gap-1.5 sm:gap-2">
								{currentExp.data.technologies.map((tech) => (
									<span
										key={tech}
										className="text-xs sm:text-sm text-theme dark:bg-neutral-dark/30 light:bg-neutral-dark/10 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full font-mono border dark:border-white/10 light:border-black/10"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
