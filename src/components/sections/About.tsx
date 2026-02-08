import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutSectionProps } from '../../types/content';

export function SectionAbout({ aboutContent = [] }: AboutSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	// Separate intro from details
	const intro = aboutContent.find((item) => item.data.type === 'intro');
	const details = aboutContent.filter((item) => item.data.type === 'detail');

	// Helper to get card class based on highlight
	const getCardClass = (highlight?: string) => {
		switch (highlight) {
			case 'accent':
				return 'glass-card-accent';
			case 'secondary':
				return 'glass-card-secondary';
			case 'neutral':
			default:
				return 'glass-card-neutral';
		}
	};

	// Helper to get text color based on highlight
	const getTitleColor = (highlight?: string) => {
		switch (highlight) {
			case 'accent':
				return 'text-accent';
			case 'secondary':
				return 'text-secondary';
			case 'neutral':
			default:
				return 'text-theme-muted';
		}
	};

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#about',
					start: 'top 70%',
					once: true, // Solo ejecuta una vez
				},
			});

			// Title types in like a terminal
			tl.fromTo('.about-title',
				{ opacity: 0, x: -30 },
				{ opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
			);

			// Content reveals with clip-path (like terminal text appearing)
			tl.fromTo('.about-content',
				{ opacity: 0, clipPath: 'inset(0 100% 0 0)' },
				{ opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.inOut' },
				'-=0.3'
			);

			// Cards flip in with 3D rotation
			tl.fromTo('.about-detail',
				{
					opacity: 0,
					rotationY: -60,
					transformOrigin: 'left center',
				},
				{
					opacity: 1,
					rotationY: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: 'back.out(1.3)',
				},
				'-=0.5'
			);

			// Luna del Río reference bounces in
			tl.fromTo('.about-footer',
				{ opacity: 0, scale: 0.9, y: 20 },
				{ opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' },
				'-=0.2'
			);
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="about"
			ref={sectionRef}
			className="section-base dark:bg-[#1A1419] light:bg-white"
		>
			{/* Ambient light effect */}
			<div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl pointer-events-none"
				style={{
					background: 'radial-gradient(circle, rgba(224, 122, 95, 0.3) 0%, transparent 70%)',
				}}
			></div>

			<div className="max-w-6xl w-full mx-auto relative z-10">
				<div className="grid md:grid-cols-2 gap-16">
					{/* Left - Intro */}
					{intro && (
						<div className="about-content">
							<h2 className="about-title text-4xl md:text-5xl font-bold text-theme mb-6 leading-tight">
								{intro.data.title}
							</h2>
							<div
								className="prose prose-lg prose-p:text-theme-secondary prose-p:leading-relaxed prose-p:mb-6 last:prose-p:mb-0"
								dangerouslySetInnerHTML={{ __html: intro.body }}
							/>
						</div>
					)}

					{/* Right - Details with liquid glass cards */}
					<div className="space-y-6">
						{details.map((detail) => (
							<div
								key={detail.id}
								className={`about-detail ${getCardClass(detail.data.highlight)} p-6`}
							>
								{detail.data.title && (
									<p className={`text-xs font-bold ${getTitleColor(detail.data.highlight)} uppercase tracking-widest mb-3`}>
										{detail.data.title}
									</p>
								)}
								<div
									className="text-base text-theme-secondary"
									dangerouslySetInnerHTML={{ __html: detail.body }}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Luna del Río reference with liquid glass */}
				<div className="about-footer mt-20">
					<div className="inline-block px-6 py-3 glass-card">
						<p className="text-sm text-theme-muted font-mono">
							Inspirado por la Luna del Río — 65 metros de altura, infinitas posibilidades de código
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
