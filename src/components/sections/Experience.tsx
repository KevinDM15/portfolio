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

			<div ref={containerRef} className="max-w-7xl w-full mx-auto px-8 relative z-10">
				{/* Timeline with single experience display */}
				<div className="relative">
					{/* Timeline vertical line - left side on mobile, center on desktop */}
					<div className="absolute left-0 md:left-12 top-0 bottom-0 w-0.5">
						{/* Background line */}
						<div className="absolute inset-0 bg-gradient-to-b from-accent via-secondary to-accent opacity-20"></div>
						{/* Animated fill line */}
						<div
							className="absolute left-0 top-0 w-full bg-gradient-to-b from-accent via-secondary to-accent transition-all duration-500"
							style={{ height: `${(currentIndex + 1) / experiences.length * 100}%` }}
						></div>
					</div>

					{/* Progress indicator */}
					<div className="absolute left-0 md:left-12 top-4 -translate-x-1/2 z-20">
						<div className="bg-accent text-white font-black text-sm px-2.5 py-1 rounded-full shadow-lg">
							{currentIndex + 1}/{experiences.length}
						</div>
					</div>

					{/* Single experience content with fade transition */}
					{currentExp && (
						<div
							key={currentExp.id}
							className={`experience-item pl-12 md:pl-24 transition-all duration-500 ${
								isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
							}`}
						>
							{/* Timeline dot */}
							<div className="absolute left-0 md:left-12 top-0 -translate-x-1/2">
								<div className="relative">
									<div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75"></div>
									<div className="relative w-4 h-4 rounded-full bg-accent border-4 dark:border-[#141419] light:border-neutral-lighter"></div>
								</div>
							</div>

							{/* Giant Title - Position */}
							<h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-theme mb-4 leading-tight">
								{currentExp.data.position}
							</h3>

							{/* Company & Period */}
							<div className="flex flex-wrap items-center gap-4 mb-8">
								<p className="text-2xl md:text-3xl text-accent font-bold">
									{currentExp.data.company}
								</p>
								<span className="text-theme-muted text-lg">•</span>
								<div className="px-4 py-1.5 rounded-full text-sm font-bold font-mono uppercase tracking-wider bg-accent/20 text-accent">
									{currentExp.data.period}
								</div>
							</div>

							{/* Description */}
							<p className="text-lg md:text-xl text-theme-secondary leading-relaxed mb-8 max-w-3xl">
								{currentExp.body}
							</p>

							{/* Technologies */}
							<div className="flex flex-wrap gap-2 max-w-3xl">
								{currentExp.data.technologies.map((tech) => (
									<span
										key={tech}
										className="text-sm text-theme dark:bg-neutral-dark/30 light:bg-neutral-dark/10 px-4 py-2 rounded-full font-mono border dark:border-white/10 light:border-black/10"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* CSS Animations */}
			<style>{`
				@keyframes slide-right {
					0%, 100% { transform: translateX(-100%); }
					50% { transform: translateX(100%); }
				}
				.animate-slide-right {
					animation: slide-right 4s ease-in-out infinite;
				}
			`}</style>
		</section>
	);
}
