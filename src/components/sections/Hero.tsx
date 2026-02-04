import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useThemeSync } from '../../hooks/useThemeSync';

export function SectionHero() {
	const heroRef = useRef<HTMLElement>(null);
	const { theme } = useThemeSync();

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline();

			// Fade in animations - use TO instead of FROM
			tl.to('.hero-name', {
				opacity: 1,
				y: 0,
				duration: 1.2,
				ease: 'power2.out',
			});

			tl.to('.hero-role', {
				opacity: 1,
				duration: 0.8,
				ease: 'power2.out',
			}, '-=0.6');

			tl.to('.hero-location', {
				opacity: 1,
				duration: 0.8,
				ease: 'power2.out',
			}, '-=0.5');

		}, heroRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="hero"
			ref={heroRef}
			className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-8 md:px-16 pt-32 pb-24 transition-colors duration-300"
			style={{
				backgroundColor: theme === 'dark' ? '#0F1419' : '#F8F9FA',
			}}
		>
			{/* Animated gradient orbs - Apple style */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute top-1/4 -left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-20 blur-3xl"
					style={{
						background: 'radial-gradient(circle, rgba(224, 122, 95, 0.4) 0%, transparent 70%)',
						animation: 'float 20s infinite ease-in-out',
					}}
				></div>
				<div
					className="absolute bottom-1/4 -right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full opacity-20 blur-3xl"
					style={{
						background: 'radial-gradient(circle, rgba(242, 204, 143, 0.3) 0%, transparent 70%)',
						animation: 'float 15s infinite ease-in-out reverse',
					}}
				></div>
			</div>

			{/* Main Content - Centered */}
			<div className="w-full max-w-7xl mx-auto relative z-10">
				{/* Giant Name Typography */}
				<div className="text-center mb-6 sm:mb-8 md:mb-10">
					<h1 className="hero-name font-display font-black leading-[0.85] sm:leading-[0.85] md:leading-[0.85] tracking-tighter opacity-0 transition-colors duration-300">
						<span
							className="block text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[14rem]"
							style={{ color: theme === 'dark' ? '#F8F9FA' : '#1A1F26' }}
						>
							KEVIN
						</span>
						<span className="block text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[14rem] text-transparent bg-clip-text bg-gradient-to-r from-accent via-secondary to-accent-light">
							DÍAZ
						</span>
					</h1>
				</div>

				{/* Role - AI First Developer */}
				<div className="hero-role text-center mb-6 sm:mb-8 opacity-0">
					<div className="inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center px-2">
						<div
							className="relative overflow-hidden rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 transition-all duration-300"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: theme === 'dark'
									? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
									: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
								border: theme === 'dark'
									? '1px solid rgba(255,255,255,0.18)'
									: '1px solid rgba(0,0,0,0.1)',
							}}
						>
							<p
								className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-300"
								style={{ color: theme === 'dark' ? '#F8F9FA' : '#1A1F26' }}
							>
								Desarrollador de Software
							</p>
						</div>
						<div
							className="relative overflow-hidden rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3"
							style={{
								backdropFilter: 'blur(20px) saturate(180%)',
								WebkitBackdropFilter: 'blur(20px) saturate(180%)',
								background: 'linear-gradient(135deg, rgba(224, 122, 95, 0.2) 0%, rgba(242, 204, 143, 0.2) 100%)',
								border: '1px solid rgba(224, 122, 95, 0.3)',
								boxShadow: '0 4px 20px rgba(224, 122, 95, 0.2)',
							}}
						>
							<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light font-black tracking-tight">
								AI-First
							</p>
						</div>
					</div>
				</div>

				{/* Location - Barranquilla */}
				<p
					className="hero-location text-center text-sm sm:text-base md:text-lg font-mono opacity-0 px-4 transition-colors duration-300"
					style={{ color: theme === 'dark' ? '#C1C3C5' : '#666370' }}
				>
					Barranquilla, Colombia
				</p>
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
