import { useEffect, useRef, useState } from 'react';

const socialLinks = [
	{ id: 'github', url: 'https://github.com/KevinDM15', label: 'GitHub' },
	{ id: 'linkedin', url: 'https://www.linkedin.com/in/kevindm14/	', label: 'LinkedIn' },
	{ id: 'email', url: 'mailto:kevindiazm.14@gmail.com', label: 'Email' },
	{ id: 'phone', url: 'tel:+573002329174', label: '(57) 3002329174' },
];

export function SectionContact() {
	const sectionRef = useRef<HTMLElement>(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	useEffect(() => {
		// No animations for this section
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
			className="section-base dark:bg-dark light:bg-[#E8E8E8]"
		>
			<div className="max-w-4xl w-full mx-auto">
				<h2 className="contact-title text-4xl md:text-5xl font-bold text-theme mb-4">
					Conversemos
				</h2>
				<p className="contact-subtitle text-lg text-theme-secondary mb-12">
					¿Tienes un proyecto en mente? Escríbeme.
				</p>

				<form onSubmit={handleSubmit} className="space-y-6 mb-12">
					<div className="contact-field">
						<label htmlFor="name" className="text-sm text-theme-secondary mb-2 block">
							Nombre
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-theme dark:placeholder-neutral-dark light:placeholder-neutral focus:outline-none transition-all rounded-xl backdrop-blur-10 backdrop-saturate-150 dark:bg-white/5 light:bg-black/5 border dark:border-white/10 light:border-black/10 focus:border-accent/50"
							placeholder="Tu nombre"
							required
						/>
					</div>

					<div className="contact-field">
						<label htmlFor="email" className="text-sm text-theme-secondary mb-2 block">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-theme dark:placeholder-neutral-dark light:placeholder-neutral focus:outline-none transition-all rounded-xl backdrop-blur-10 backdrop-saturate-150 dark:bg-white/5 light:bg-black/5 border dark:border-white/10 light:border-black/10 focus:border-accent/50"
							placeholder="tu@email.com"
							required
						/>
					</div>

					<div className="contact-field">
						<label htmlFor="message" className="text-sm text-theme-secondary mb-2 block">
							Mensaje
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							className="w-full px-4 py-3 text-base text-theme dark:placeholder-neutral-dark light:placeholder-neutral focus:outline-none transition-all resize-none rounded-xl backdrop-blur-10 backdrop-saturate-150 dark:bg-white/5 light:bg-black/5 border dark:border-white/10 light:border-black/10 focus:border-accent/50"
							placeholder="Cuéntame sobre tu proyecto..."
							rows={6}
							required
						></textarea>
					</div>

					<button
						type="submit"
						className="contact-submit relative overflow-hidden px-8 py-3 font-semibold text-white rounded-full transition-all group bg-gradient-to-br from-accent to-accent-light shadow-accent-glow hover:shadow-accent-glow-lg"
					>
						<span className="relative z-10">Enviar Mensaje</span>
						<div
							className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent-light to-accent"
						></div>
					</button>
				</form>

				{/* Social links */}
				<div className="pt-8 border-t dark:border-neutral-dark/50 light:border-neutral-dark/30">
					<p className="text-sm text-theme-muted mb-4">
						O encuéntrame en
					</p>
					<div className="flex flex-wrap gap-6">
						{socialLinks.map((link) => (
							<a
								key={link.id}
								href={link.url}
								target={link.id !== 'email' && link.id !== 'phone' ? '_blank' : undefined}
								rel={link.id !== 'email' && link.id !== 'phone' ? 'noopener noreferrer' : undefined}
								className="text-sm text-theme-secondary hover:text-accent transition-colors"
								aria-label={link.label}
							>
								{link.label}
							</a>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-20 text-xs text-theme-muted font-mono">
					© 2026 Kevin Díaz — Hecho con código y café desde Barranquilla
				</div>
			</div>
		</section>
	);
}
