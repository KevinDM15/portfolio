interface QuickReply {
	label: string;
	text: string;
	icon: React.ReactNode;
}

const QUICK_REPLIES: QuickReply[] = [
	{
		label: 'Experiencia',
		text: '¿En qué empresas ha trabajado Kevin?',
		icon: (
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<rect x="2" y="7" width="20" height="14" rx="2" />
				<path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
			</svg>
		),
	},
	{
		label: 'Skills',
		text: '¿Cuáles son las habilidades técnicas de Kevin?',
		icon: (
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="16 18 22 12 16 6" />
				<polyline points="8 6 2 12 8 18" />
			</svg>
		),
	},
	{
		label: 'Contacto',
		text: '¿Cómo puedo contactar a Kevin?',
		icon: (
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
				<polyline points="22,6 12,13 2,6" />
			</svg>
		),
	},
	{
		label: 'Sobre él',
		text: '¿Quién es Kevin Díaz?',
		icon: (
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		),
	},
];

interface QuickRepliesProps {
	onSelect: (text: string) => void;
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
	return (
		<div className="px-4 pb-3 grid grid-cols-2 gap-1.5 flex-none">
			{QUICK_REPLIES.map(q => (
				<button
					key={q.label}
					onClick={() => onSelect(q.text)}
					className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left border dark:border-white/10 light:border-black/10 dark:text-white/70 light:text-black/60 dark:hover:bg-white/6 light:hover:bg-black/5 dark:hover:border-accent/30 light:hover:border-accent/30 hover:text-accent transition-all duration-200"
				>
					{q.icon}
					{q.label}
				</button>
			))}
		</div>
	);
}
