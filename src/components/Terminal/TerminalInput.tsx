import { forwardRef } from 'react';

interface TerminalInputProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
	({ value, onChange, onKeyDown }, ref) => {
		return (
			<div className="terminal-input bg-dark-alt border-t-2 border-cyan-400 px-6 py-4 flex items-center gap-3 shadow-[inset_0_1px_0_rgba(0,240,255,0.2)]">
				<span className="text-lime-400 font-bold text-lg" style={{ textShadow: '0 0 10px rgba(57,255,20,0.6)' }}>→</span>
				<span className="text-cyan-400 font-code font-bold" style={{ textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
					$
				</span>
				<input
					ref={ref}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					className="flex-1 bg-transparent outline-none text-white font-code placeholder-gray-500 text-sm"
					placeholder="Escribe un comando..."
					autoComplete="off"
					spellCheck={false}
					style={{
						textShadow: '0 0 5px rgba(0,240,255,0.3)',
						caretColor: 'rgb(0, 240, 255)',
					}}
				/>
				<span className="text-cyan-400 animate-pulse font-bold">▌</span>
			</div>
		);
	}
);

TerminalInput.displayName = 'TerminalInput';
