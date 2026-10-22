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
			className="kc-form"
		>
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="Escribe tu pregunta..."
				disabled={disabled}
				className="kc-input"
			/>
			<button
				type="submit"
				disabled={!value.trim() || disabled}
				className="kc-send"
				aria-label="Enviar mensaje"
			>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</form>
	);
}
