interface SuggestedRepliesProps {
	suggestions: string[];
	onSelect: (text: string) => void;
}

export function SuggestedReplies({ suggestions, onSelect }: SuggestedRepliesProps) {
	if (!suggestions.length) return null;

	return (
		<div className="kc-suggest">
			{suggestions.map((s, i) => (
				<button
					type="button"
					key={i}
					onClick={() => onSelect(s)}
					className="kc-chip"
				>
					{s}
				</button>
			))}
		</div>
	);
}