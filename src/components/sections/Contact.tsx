import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThemeSync } from '../../hooks/useThemeSync';

const socialLinks = [
	{ id: 'github', url: 'https://github.com', label: 'GitHub' },
	{ id: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
	{ id: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
	{ id: 'email', url: 'mailto:kevin@example.com', label: 'Email' },
];

export function SectionContact() {
	const sectionRef = useRef<HTMLElement>(null);
	const { theme } = useThemeSync();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from('.contact-content', {
				opacity: 0,
				y: 30,
				duration: 1,
				scrollTrigger: {
					trigger: '#contact',
					start: 'top 70%',
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		// Add form submission logic here
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<section
			id="contact"
			ref={sectionRef}
			className="min-h-screen flex items-center relative overflow-hidden px-8 md:px-16 pt-32 pb-24 transition-colors duration-300"
			style={{
				backgroundColor: theme === 'dark' ? '#0F1419' : '#F8F9FA',
			}}
		>
			<div className="max-w-4xl w-full mx-auto contact-content">
				<h2 className="text-4xl md:text-5xl font-bold text-neutral-lightest mb-4">
					Conversemos
				</h2>
				<p className="text-lg text-neutral-light mb-12">
					¿Tienes un proyecto en mente? Escríbeme.
				</p>

				<form onSubmit={handleSubmit} className="space-y-6 mb-12">
					<div>
						<label htmlFor="name" className="text-sm text-neutral-light mb-2 block">
							Nombre
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-neutral-lightest placeholder-neutral-dark focus:outline-none transition-all rounded-xl"
							style={{
								backdropFilter: 'blur(10px) saturate(150%)',
								WebkitBackdropFilter: 'blur(10px) saturate(150%)',
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}
							onFocus={(e) => e.target.style.border = '1px solid rgba(224, 122, 95, 0.5)'}
							onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
							placeholder="Tu nombre"
							required
						/>
					</div>

					<div>
						<label htmlFor="email" className="text-sm text-neutral-light mb-2 block">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-neutral-lightest placeholder-neutral-dark focus:outline-none transition-all rounded-xl"
							style={{
								backdropFilter: 'blur(10px) saturate(150%)',
								WebkitBackdropFilter: 'blur(10px) saturate(150%)',
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}
							onFocus={(e) => e.target.style.border = '1px solid rgba(224, 122, 95, 0.5)'}
							onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
							placeholder="tu@email.com"
							required
						/>
					</div>

					<div>
						<label htmlFor="message" className="text-sm text-neutral-light mb-2 block">
							Mensaje
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-neutral-lightest placeholder-neutral-dark focus:outline-none transition-all resize-none rounded-xl"
							style={{
								backdropFilter: 'blur(10px) saturate(150%)',
								WebkitBackdropFilter: 'blur(10px) saturate(150%)',
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}
							onFocus={(e) => e.target.style.border = '1px solid rgba(224, 122, 95, 0.5)'}
							onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
							placeholder="Cuéntame sobre tu proyecto..."
							rows={6}
							required
						></textarea>
					</div>

					<button
						type="submit"
						className="relative overflow-hidden px-8 py-3 font-semibold text-white rounded-full transition-all group"
						style={{
							background: 'linear-gradient(135deg, #E07A5F 0%, #F4A59D 100%)',
							boxShadow: '0 4px 15px rgba(224, 122, 95, 0.4)',
						}}
					>
						<span className="relative z-10">Enviar Mensaje</span>
						<div
							className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							style={{
								background: 'linear-gradient(135deg, #F4A59D 0%, #E07A5F 100%)',
							}}
						></div>
					</button>
				</form>

				{/* Social links */}
				<div className="pt-8 border-t border-neutral-dark/50">
					<p className="text-sm text-neutral mb-4">
						O encuéntrame en
					</p>
					<div className="flex flex-wrap gap-6">
						{socialLinks.map((link) => (
							<a
								key={link.id}
								href={link.url}
								target={link.id !== 'email' ? '_blank' : undefined}
								rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
								className="text-sm text-neutral-light hover:text-accent transition-colors"
								aria-label={link.label}
							>
								{link.label}
							</a>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-20 text-xs text-neutral-dark font-mono">
					© 2026 Kevin Díaz — Hecho con código y café desde Barranquilla
				</div>
			</div>
		</section>
	);
}
