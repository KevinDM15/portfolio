import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from '../ui/ProjectCard';

const projects = [
	{
		id: 'ecommerce',
		title: 'E-Commerce Platform',
		description: 'Plataforma completa de comercio electrónico con carrito, pagos integrados, dashboard admin y analytics en tiempo real.',
		technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
		icon: 'i-mdi-web',
		iconColor: 'text-accent',
		gradientFrom: 'from-accent/10',
		gradientTo: 'to-secondary/10',
		githubUrl: '#',
		liveUrl: '#',
	},
	{
		id: 'dashboard',
		title: 'Analytics Dashboard',
		description: 'Dashboard interactivo para visualización de datos con gráficos en tiempo real, exportación de reportes y filtros avanzados.',
		technologies: ['React', 'D3.js', 'WebSockets', 'MongoDB'],
		icon: 'i-mdi-chart-line',
		iconColor: 'text-secondary',
		gradientFrom: 'from-secondary/10',
		gradientTo: 'to-accent-light/10',
		githubUrl: '#',
		liveUrl: '#',
	},
	{
		id: 'ai-chat',
		title: 'AI Chat Assistant',
		description: 'Asistente conversacional con IA que procesa lenguaje natural, aprende del contexto y proporciona respuestas personalizadas.',
		technologies: ['TypeScript', 'OpenAI', 'Vector DB', 'RAG'],
		icon: 'i-mdi-robot',
		iconColor: 'text-accent-light',
		gradientFrom: 'from-accent-light/10',
		gradientTo: 'to-accent/10',
		githubUrl: '#',
		liveUrl: '#',
	},
	{
		id: '3d-viewer',
		title: '3D Product Viewer',
		description: 'Visualizador interactivo de productos 3D con realidad aumentada, configuración en tiempo real y exportación de renders.',
		technologies: ['Three.js', 'WebGL', 'React', 'AR.js'],
		icon: 'i-mdi-camera-3d',
		iconColor: 'text-accent',
		gradientFrom: 'from-accent/10',
		gradientTo: 'to-secondary-light/10',
		githubUrl: '#',
		liveUrl: '#',
	},
];

export function Projects() {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from('.projects-coming-soon', {
				opacity: 0,
				y: 30,
				duration: 1,
				scrollTrigger: {
					trigger: '#projects',
					start: 'top 70%',
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="projects"
			ref={sectionRef}
			className="min-h-screen flex items-center justify-center relative overflow-hidden px-8 md:px-16"
		>
			<div className="projects-coming-soon text-center">
				<h2 className="text-6xl md:text-8xl font-display font-black text-neutral-lightest mb-6 tracking-tighter">
					Proyectos
				</h2>
				<p className="text-2xl md:text-3xl text-neutral-light font-medium mb-4">
					Coming Soon
				</p>
				<p className="text-base text-neutral font-mono">
					Preparando algo especial...
				</p>
			</div>
		</section>
	);
}
