import { useRef } from 'react';

interface ChatInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	disabled: boolean;
	inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ChatInput({ value, onChange, onSubmit, disabled, inputRef }: ChatInputProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="p-3 border-t dark:border-white/8 light:border-black/8 flex gap-2 flex-none"
			style={{ background: 'rgba(255,255,255,0.02)' }}
		>
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="Escribí tu pregunta..."
				disabled={disabled}
				className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-sm dark:bg-white/6 light:bg-black/5 text-theme placeholder-theme-muted border dark:border-white/8 light:border-black/8 focus:outline-none focus:border-accent/50 disabled:opacity-40 transition-colors"
			/>
			<button
				type="submit"
				disabled={!value.trim() || disabled}
				className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 flex-none"
				style={{ background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)' }}
				aria-label="Enviar mensaje"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</form>
	);
}
