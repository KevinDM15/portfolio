interface SuggestedRepliesProps {
	suggestions: string[];
	onSelect: (text: string) => void;
}

export function SuggestedReplies({ suggestions, onSelect }: SuggestedRepliesProps) {
	if (!suggestions.length) return null;

	return (
		<div className="px-3 pb-2 flex gap-2 overflow-x-auto flex-none scrollbar-none">
			{suggestions.map((s, i) => (
				<button
					key={i}
					onClick={() => onSelect(s)}
					className="flex-none text-[11px] font-medium px-3 py-1.5 rounded-full border dark:border-white/12 light:border-black/12 text-theme-muted hover:text-accent hover:border-accent/40 dark:hover:bg-white/5 light:hover:bg-black/5 transition-all duration-200 whitespace-nowrap"
				>
					{s}
				</button>
			))}
		</div>
	);
}