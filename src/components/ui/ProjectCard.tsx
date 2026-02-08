interface ProjectCardProps {
	title: string;
	description: string;
	technologies: string[];
	icon: string;
	iconColor: string;
	gradientFrom: string;
	gradientTo: string;
	githubUrl?: string;
	liveUrl?: string;
}

export function ProjectCard({
	title,
	description,
	technologies,
	icon,
	iconColor,
	gradientFrom,
	gradientTo,
	githubUrl,
	liveUrl,
}: ProjectCardProps) {
	return (
		<div className="project-card flex-shrink-0 w-[85vw] sm:w-[450px] border-l-4 border-accent pl-8 pr-6 py-6 group flex flex-col h-[400px] bg-dark-lighter/50">
			<h3 className="text-3xl md:text-4xl font-bold text-neutral-lightest mb-4 leading-tight tracking-tight">
				{title}
			</h3>

			<p className="text-neutral-light mb-6 leading-relaxed text-base flex-grow">
				{description}
			</p>

			<div className="flex flex-wrap gap-2 mb-6">
				{technologies.map((tech) => (
					<span
						key={tech}
						className="text-xs px-3 py-1 border border-neutral-dark text-neutral-lighter rounded-full uppercase tracking-wide font-semibold"
					>
						{tech}
					</span>
				))}
			</div>

			<div className="flex gap-6 mt-auto">
				{githubUrl && (
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-accent hover:text-accent-light flex items-center gap-2 transition-colors font-semibold"
					>
						<span className="i-mdi-github text-xl"></span>
						Código
					</a>
				)}
				{liveUrl && (
					<a
						href={liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-accent hover:text-accent-light flex items-center gap-2 transition-colors font-semibold"
					>
						<span className="i-mdi-open-in-new text-xl"></span>
						Demo
					</a>
				)}
			</div>
		</div>
	);
}
