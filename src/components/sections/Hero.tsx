import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function SectionHero() {
	const heroRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#hero',
					start: 'top 80%',
					once: true, // Solo ejecuta una vez
				},
			});

			// Dramatic entrance with scale and rotation
			tl.fromTo('.hero-name',
				{
					opacity: 0,
					scale: 0.9,
					rotationX: -10,
				},
				{
					opacity: 1,
					scale: 1,
					rotationX: 0,
					duration: 0.6,
					ease: 'power2.out',
				}
			);

			// Role badges fly in from sides
			tl.fromTo('.hero-role .badge-1',
				{ opacity: 0, x: -50, rotation: -5 },
				{ opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' },
				'-=0.4'
			);

			tl.fromTo('.hero-role .badge-2',
				{ opacity: 0, x: 50, rotation: 5 },
				{ opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' },
				'-=0.4'
			);

			// Location fades up
			tl.fromTo('.hero-location',
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
				'-=0.3'
			);

			// Continuous floating animation for orbs
			gsap.to('.orb-1', {
				x: 30,
				y: -30,
				scale: 1.1,
				duration: 8,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});

			gsap.to('.orb-2', {
				x: -40,
				y: 30,
				scale: 0.9,
				duration: 10,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});

		}, heroRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="hero"
			ref={heroRef}
			className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-8 md:px-16 pt-32 pb-24 dark:bg-[#120F0C] light:bg-[#FAF7F4]"
		>
			{/* Animated gradient orbs - Apple style */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="orb-1 absolute top-1/4 -left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-20 blur-3xl"
					style={{
						background: 'radial-gradient(circle, rgba(212, 98, 42, 0.35) 0%, transparent 70%)',
					}}
				></div>
				<div
					className="orb-2 absolute bottom-1/4 -right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full opacity-20 blur-3xl"
					style={{
						background: 'radial-gradient(circle, rgba(232, 184, 109, 0.25) 0%, transparent 70%)',
					}}
				></div>
			</div>

			{/* Main Content */}
			<div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-10">

				{/* Left — text */}
				<div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
					<h1 className="hero-name font-display font-black leading-[0.85] tracking-[-0.04em] mb-6 sm:mb-8">
						<span className="block text-[4rem] sm:text-[6rem] md:text-[7rem] lg:text-[9rem] text-theme">
							KEVIN
						</span>
						<span className="block text-[4rem] sm:text-[6rem] md:text-[7rem] lg:text-[9rem] text-transparent bg-clip-text bg-gradient-to-r from-accent via-secondary to-accent-light">
							DÍAZ
						</span>
					</h1>

					{/* Role badges */}
					<div className="hero-role mb-5 sm:mb-7">
						<div className="inline-flex items-center gap-3 flex-wrap justify-center md:justify-start">
							<div className="badge-1 relative overflow-hidden rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-20 backdrop-saturate-180 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 light:bg-gradient-to-br light:from-white/80 light:to-white/60 border dark:border-white/18 light:border-black/10 transition-all duration-300">
								<p className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-theme">
									Desarrollador de Software
								</p>
							</div>
							<div
								className="badge-2 relative overflow-hidden rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-20 backdrop-saturate-180 border border-accent/30"
								style={{
									background: 'linear-gradient(135deg, rgba(212, 98, 42, 0.18) 0%, rgba(232, 184, 109, 0.18) 100%)',
									boxShadow: '0 4px 20px rgba(212, 98, 42, 0.18)',
								}}
							>
								<p className="text-base sm:text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light font-black tracking-tight">
									AI-First
								</p>
							</div>
						</div>
					</div>

					<p className="hero-location text-sm sm:text-base font-mono text-theme-muted mb-6">
						Barranquilla, Colombia
					</p>

					<div className="hero-location">
						<a
							href="/CV_KEVIN_ES.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-mono text-sm font-bold tracking-wide border border-accent/40 text-accent transition-all duration-300 hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_20px_rgba(224,122,95,0.2)]"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
								<polyline points="14,2 14,8 20,8"/>
								<line x1="12" y1="18" x2="12" y2="12"/>
								<line x1="9" y1="15" x2="15" y2="15"/>
							</svg>
							Ver CV
						</a>
					</div>
				</div>

				{/* Right — profile image with premium geometric shape */}
				<div
					className="hero-name flex-none relative"
					style={{ width: 'clamp(240px, 30vw, 380px)', flexShrink: 0 }}
				>
					{/* Amber layer — back */}
					<div style={{
						position: 'absolute',
						inset: 0,
						transform: 'translate(16px, 16px) skewX(-4deg)',
						background: 'rgba(232,184,109,0.15)',
						borderRadius: '12px',
					}} />
					{/* Orange layer — mid */}
					<div style={{
						position: 'absolute',
						inset: 0,
						transform: 'translate(8px, 8px) skewX(-4deg)',
						background: 'rgba(212,98,42,0.3)',
						borderRadius: '12px',
					}} />

					{/* Image — skewed, on top */}
					<div style={{
						position: 'relative',
						transform: 'skewX(-4deg)',
						borderRadius: '12px',
						overflow: 'hidden',
						aspectRatio: '3 / 4',
					}}>
						<img
							src="/profile_recreated.png"
							alt="Kevin Díaz"
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition: 'top center',
								display: 'block',
								transform: 'skewX(4deg) scale(1.05)',
							}}
						/>
					</div>

					{/* Accent line */}
					<div style={{
						position: 'absolute',
						bottom: -14,
						left: 0,
						width: '50%',
						height: '2px',
						background: 'linear-gradient(90deg, #D4622A, transparent)',
					}} />
					<div style={{
						position: 'absolute',
						bottom: -18,
						left: 0,
						width: '2px',
						height: '20px',
						background: '#D4622A',
					}} />
				</div>

			</div>

			{/* Floating animation keyframes */}
			<style>{`
				@keyframes float {
					0%, 100% { transform: translate(0, 0) scale(1); }
					33% { transform: translate(30px, -30px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
				}
			`}</style>
		</section>
	);
}
