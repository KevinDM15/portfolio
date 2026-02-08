interface TimelineItemProps {
	company: string;
	position: string;
	period: string;
	description: string;
	technologies: string[];
	align?: 'left' | 'right';
}

export function TimelineItem({
	company,
	position,
	period,
	description,
	technologies,
	align = 'left',
}: TimelineItemProps) {
	return (
		<div className="timeline-item group">
			{/* Glassmorphic card */}
			<div className="backdrop-blur-sm bg-neutral-lightest/3 border border-neutral-dark hover:border-accent rounded-2xl p-8 transition-all hover:bg-neutral-lightest/5">
				{/* Period badge */}
				<div className="inline-block px-4 py-1 bg-accent/10 border border-accent/30 rounded-full mb-4">
					<span className="text-xs font-bold text-accent uppercase tracking-widest">
						{period}
					</span>
				</div>

				<h3 className="text-2xl md:text-3xl font-bold text-neutral-lightest mb-2 leading-tight">
					{position}
				</h3>

				<p className="text-lg text-accent font-semibold mb-6">
					{company}
				</p>

				<p className="text-neutral-lighter leading-relaxed mb-6 text-base">
					{description}
				</p>

				{/* Tech stack */}
				<div className="flex flex-wrap gap-2">
					{technologies.map((tech) => (
						<span
							key={tech}
							className="text-xs px-3 py-1.5 bg-dark-lighter border border-neutral-dark text-neutral-light rounded-lg font-medium"
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
