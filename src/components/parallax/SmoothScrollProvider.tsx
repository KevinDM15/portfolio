import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
	children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		// Initialize Lenis smooth scroll
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		lenisRef.current = lenis;

		// RAF loop
		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Sync GSAP ScrollTrigger with Lenis
		lenis.on('scroll', ScrollTrigger.update);

		// Expose lenis globally for navigation
		(window as any).lenis = lenis;

		return () => {
			lenis.destroy();
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	return <>{children}</>;
}
