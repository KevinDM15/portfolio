import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ExperienceSectionProps } from '../../types/content';

const TECH_ICONS: Record<string, string> = {
	'React':        'i-simple-icons-react',
	'Next.js':      'i-simple-icons-nextdotjs',
	'NestJS':       'i-simple-icons-nestjs',
	'TypeScript':   'i-simple-icons-typescript',
	'PostgreSQL':   'i-simple-icons-postgresql',
	'AWS':          'i-simple-icons-amazonaws',
	'MaterialUI':   'i-simple-icons-mui',
	'Redux':        'i-simple-icons-redux',
	'Node.js':      'i-simple-icons-nodedotjs',
	'Docker':       'i-simple-icons-docker',
	'Go':           'i-simple-icons-go',
	'Ruby':         'i-simple-icons-ruby',
	'Rails':        'i-simple-icons-rubyonrails',
	'GraphQL':      'i-simple-icons-graphql',
	'Git':          'i-simple-icons-git',
	'Tailwind':     'i-simple-icons-tailwindcss',
};

export function SectionExperience({ experiences = [] }: ExperienceSectionProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const expandRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
	const isDragging = useRef(false);
	const dragStart = useRef({ x: 0 });
	const prevIndex = useRef(0);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.fromTo('.exp-header',
				{ opacity: 0, y: -10 },
				{ opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
					scrollTrigger: { trigger: '#experience', start: 'top 80%', once: true } }
			);
			gsap.fromTo('.exp-timeline',
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15,
					scrollTrigger: { trigger: '#experience', start: 'top 75%', once: true } }
			);
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	useEffect(() => {
		if (!expandRef.current || prevIndex.current === activeIndex) return;
		prevIndex.current = activeIndex;
		gsap.fromTo(expandRef.current,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
		);
	}, [activeIndex]);

	const onMouseDown = (e: React.MouseEvent) => {
		isDragging.current = false;
		dragStart.current = { x: e.pageX };

		const onMove = (ev: MouseEvent) => {
			if (Math.abs(ev.pageX - dragStart.current.x) > 4) isDragging.current = true;
		};
		const onUp = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
			setTimeout(() => { isDragging.current = false; }, 50);
		};
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	};

	const handleNodeClick = (i: number) => {
		if (!isDragging.current) setActiveIndex(i);
	};

	const handleMouseMove = (e: React.MouseEvent, i: number) => {
		setHoveredIndex(i);
		setTooltipPos({ x: e.clientX, y: e.clientY });
	};

	const active = experiences[activeIndex];
	const hovered = hoveredIndex !== null ? experiences[hoveredIndex] : null;

	return (
		<section
			id="experience"
			ref={sectionRef}
			className="relative dark:bg-[#120F0C] light:bg-[#FAF7F4] pt-28 sm:pt-36 pb-32 overflow-hidden"
		>
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

			{/* Header */}
			<div className="exp-header max-w-5xl mx-auto px-6 sm:px-10 md:px-16 mb-16">
				<div className="flex items-center gap-3 mb-5">
					<span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent">03 — Trayectoria</span>
					<div className="h-px w-12 bg-accent/40" />
				</div>
				<h2
					className="font-black text-theme leading-[0.9] tracking-tight"
					style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
				>
					Donde estuve<br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">trabajando.</span>
				</h2>
			</div>

			{/* Timeline */}
			<div className="exp-timeline max-w-5xl mx-auto px-6 sm:px-10 md:px-16">
				{/* Track */}
				<div className="relative" onMouseDown={onMouseDown}>
					{/* Base line */}
					<div className="absolute top-5 left-0 right-0 h-px dark:bg-white/8 light:bg-black/10" />

					{/* Nodes row — centered */}
					<div className="flex justify-center">
						{experiences.map((exp, i) => {
							const isActive = activeIndex === i;

							return (
								<div
									key={exp.id}
									className="relative flex-none"
									style={{ width: 'clamp(160px, 20vw, 240px)' }}
								>
									{/* Progress fill between nodes */}
									{i < experiences.length - 1 && (
										<div className="absolute top-5 left-1/2 w-full h-px overflow-hidden">
											<div
												className="h-full transition-all duration-500"
												style={{
													background: i < activeIndex ? '#D4622A' : 'transparent',
													width: i < activeIndex ? '100%' : '0%',
												}}
											/>
										</div>
									)}

									<div
										className="flex flex-col items-center pb-6 px-4 cursor-pointer select-none"
										onClick={() => handleNodeClick(i)}
										onMouseMove={(e) => handleMouseMove(e, i)}
										onMouseLeave={() => setHoveredIndex(null)}
									>
										{/* Node */}
										<div className="relative mb-4 z-10 flex items-center justify-center" style={{ width: 40, height: 40 }}>
											{isActive && (
												<div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse" />
											)}
											<div
												className="rounded-full transition-all duration-300"
												style={{
													width: isActive ? 18 : 10,
													height: isActive ? 18 : 10,
													background: isActive ? '#D4622A' : hoveredIndex === i ? 'rgba(212,98,42,0.5)' : 'rgba(212,98,42,0.25)',
													boxShadow: isActive ? '0 0 0 4px rgba(212,98,42,0.15)' : 'none',
												}}
											/>
										</div>

										<p
											className="text-sm font-bold text-center mb-1 transition-all duration-300"
											style={{
												color: isActive ? '#D4622A' : 'var(--color-text-muted)',
											}}
										>
											{exp.data.company}
										</p>
										<p
											className="text-[9px] font-mono uppercase tracking-widest text-center transition-opacity duration-300"
											style={{ color: 'var(--color-text-muted)', opacity: isActive ? 0.65 : 0.3 }}
										>
											{exp.data.period}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Expanded info — inline below the active node */}
				{active && (
					<div ref={expandRef} className="mt-8">
						<div className="h-px w-full mb-8" style={{ background: 'rgba(212,98,42,0.12)' }} />

						<div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-12">
							{/* Left — title + meta */}
							<div className="flex-none sm:w-56">
								<p
									className="text-[10px] font-mono uppercase tracking-[0.35em] mb-2"
									style={{ color: 'rgba(212,98,42,0.6)' }}
								>
									{String(activeIndex + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
								</p>
								<h3
									className="font-black text-theme tracking-tight leading-[1.05] mb-2"
									style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
								>
									{active.data.position}
								</h3>
								<p className="text-accent font-semibold text-sm mb-1">{active.data.company}</p>
								<p className="text-[10px] font-mono uppercase tracking-wider text-theme-muted opacity-60">
									{active.data.period}
								</p>
							</div>

							{/* Right — description + stack */}
							<div className="flex-1 min-w-0">
								<p className="text-sm sm:text-base text-theme-secondary leading-relaxed mb-6">
									{active.body}
								</p>
								<div className="flex flex-wrap gap-2">
									{active.data.technologies.map(tech => {
										const icon = TECH_ICONS[tech];
										return (
											<div
												key={tech}
												className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-white/5 light:bg-black/5 border dark:border-white/8 light:border-black/8 hover:border-accent/30 group transition-all duration-200 cursor-default"
											>
												{icon && <span className={`${icon} text-xs opacity-50 group-hover:opacity-90 transition-opacity`} />}
												<span className="text-[11px] font-mono text-theme-muted group-hover:text-accent transition-colors whitespace-nowrap">
													{tech}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Tooltip — follows cursor for non-active nodes */}
			{hovered && hoveredIndex !== activeIndex && (
				<div
					className="fixed z-50 pointer-events-none rounded-xl p-4 w-52"
					style={{
						left: tooltipPos.x + 16,
						top: tooltipPos.y - 8,
						background: 'var(--color-bg)',
						border: '1px solid rgba(212,98,42,0.25)',
						boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
						transform: 'translateY(-50%)',
					}}
				>
					<p className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1">{hovered.data.period}</p>
					<p className="text-sm font-bold text-theme mb-0.5">{hovered.data.position}</p>
					<p className="text-xs text-accent/80 font-semibold mb-2.5">{hovered.data.company}</p>
					<div className="flex flex-wrap gap-1">
						{hovered.data.technologies.slice(0, 5).map(tech => (
							<span key={tech} className="text-[10px] font-mono text-theme-muted dark:bg-white/5 light:bg-black/5 px-1.5 py-0.5 rounded">
								{tech}
							</span>
						))}
						{hovered.data.technologies.length > 5 && (
							<span className="text-[10px] font-mono text-accent/50">+{hovered.data.technologies.length - 5}</span>
						)}
					</div>
				</div>
			)}

			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
		</section>
	);
}
