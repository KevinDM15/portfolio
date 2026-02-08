import { useEffect, useRef } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalBody } from './TerminalBody';
import { WelcomeMessage } from './WelcomeMessage';
import { CommandHistory } from './CommandHistory';
import { TerminalInput } from './TerminalInput';
import { useTerminal } from './useTerminal';

export default function InteractiveTerminal() {
	const { history, input, setInput, executeCommand } = useTerminal();
	const outputRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto scroll to bottom when history changes
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [history]);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			executeCommand(input);
		}
	};

	const handleContainerClick = () => {
		inputRef.current?.focus();
	};

	const handleWheel = (e: React.WheelEvent) => {
		// Detener la propagación del evento de scroll para que no afecte la navegación de la página
		e.stopPropagation();
	};

	return (
		<div
			className="interactive-terminal backdrop-blur-md rounded-lg overflow-hidden w-full max-w-5xl mx-auto flex flex-col max-h-[70vh] bg-dark-alt/80"
			style={{
				border: '2px solid rgb(0, 240, 255)',
				boxShadow: '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05)',
			}}
			onWheel={handleWheel}
		>
			<TerminalHeader />

			<TerminalBody ref={outputRef} onClick={handleContainerClick}>
				<WelcomeMessage />
				<CommandHistory history={history} />
			</TerminalBody>

			<TerminalInput
				ref={inputRef}
				value={input}
				onChange={setInput}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
