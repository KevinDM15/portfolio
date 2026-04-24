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
			className="section-base dark:bg-[#1A1419] light:bg-white relative overflow-hidden"
		>

			<div className="max-w-6xl w-full mx-auto relative z-10">
				{/* Number + Title layout - Riccardo style */}
				{intro && (
					<div className="about-content mb-20 flex items-start gap-6">
						<div className="about-number text-8xl md:text-9xl font-black text-accent/20 leading-none">
							02
						</div>
						<div className="flex-1 pt-4">
							<h2 className="about-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-theme mb-4 leading-tight">
								{intro.data.title}
							</h2>
							<div
								className="text-lg md:text-xl text-theme-secondary leading-relaxed max-w-2xl"
								dangerouslySetInnerHTML={{ __html: intro.body }}
							/>
						</div>
					</div>
				)}

				{/* Numbered cards with hover states */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
					{details.map((detail, index) => {
						return (
							<div
								key={detail.id}
								className={`about-detail group relative ${getCardClass(detail.data.highlight)} p-6 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden`}
							>
								{/* Large number background */}
								<div className="absolute -top-4 -right-4 text-8xl font-black opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
									0{index + 1}
								</div>

								<div className="relative z-10">
									{detail.data.title && (
										<div className="flex items-center gap-3 mb-3">
											<span className="text-2xl font-black text-accent">
												0{index + 1}
											</span>
											<p className={`text-xs font-bold ${getTitleColor(detail.data.highlight)} uppercase tracking-widest`}>
												{detail.data.title}
											</p>
										</div>
									)}
									<div
										className="text-base text-theme-secondary leading-relaxed"
										dangerouslySetInnerHTML={{ __html: detail.body }}
									/>
								</div>

								{/* Animated border on hover */}
								<div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${
									detail.data.highlight === 'accent' ? 'bg-accent' :
									detail.data.highlight === 'secondary' ? 'bg-secondary' :
									'bg-theme-muted'
								}`}></div>
							</div>
						);
					})}
				</div>

				{/* Minimalist footer */}
				<div className="about-footer mt-24 text-center">
					<p className="text-xs text-theme-muted font-mono opacity-50 hover:opacity-100 transition-opacity">
						Inspirado por la Luna del Río — 65 metros de altura, infinitas posibilidades de código
					</p>
				</div>
			</div>

		</section>
	);
}
