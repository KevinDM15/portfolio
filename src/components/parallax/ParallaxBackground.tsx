import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Layer {
	id: string;
	speed: number;
	color: string;
	blur: string;
	position: {
		top?: string;
		left?: string;
		right?: string;
		bottom?: string;
	};
	size: string;
}

const layers: Layer[] = [
	{
		id: 'layer-1',
		speed: 0.3,
		color: 'bg-accent',
		blur: 'blur-3xl',
		position: { top: '20%', left: '5%' },
		size: 'w-96 h-96',
	},
	{
		id: 'layer-2',
		speed: 0.5,
		color: 'bg-secondary',
		blur: 'blur-3xl',
		position: { top: '40%', right: '10%' },
		size: 'w-72 h-72',
	},
	{
		id: 'layer-3',
		speed: 0.7,
		color: 'bg-accent-light',
		blur: 'blur-3xl',
		position: { bottom: '30%', left: '15%' },
		size: 'w-80 h-80',
	},
	{
		id: 'layer-4',
		speed: 0.4,
		color: 'bg-secondary-light',
		blur: 'blur-2xl',
		position: { top: '60%', right: '20%' },
		size: 'w-64 h-64',
	},
];

export function ParallaxBackground() {
	const layersRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		layersRef.current.forEach((layer, index) => {
			if (!layer) return;

			const speed = layers[index].speed;

			gsap.to(layer, {
				y: () => window.innerHeight * speed,
				ease: 'none',
				scrollTrigger: {
					trigger: 'body',
					start: 'top top',
					end: 'bottom top',
					scrub: true,
				},
			});
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
			{layers.map((layer, index) => (
				<div
					key={layer.id}
					ref={el => { layersRef.current[index] = el; }}
					className="absolute"
					style={{
						top: layer.position.top,
						left: layer.position.left,
						right: layer.position.right,
						bottom: layer.position.bottom,
					}}
				>
					<div className={`${layer.size} ${layer.color} ${layer.blur} rounded-full opacity-5`}></div>
				</div>
			))}
		</div>
	);
}
