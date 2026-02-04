import { useState, useCallback } from 'react';
import type { CommandOutput } from './types';
import { commands } from './commands';

function createErrorOutput(cmd: string) {
	return (
		<div className="text-scarlet-fire">
			comando no encontrado: {cmd}
			<br />
			<span className="text-gray-400">Escribe 'help' para ver comandos disponibles</span>
		</div>
	);
}

export function useTerminal() {
	const [history, setHistory] = useState<CommandOutput[]>([]);
	const [input, setInput] = useState('');

	const executeCommand = useCallback((cmd: string) => {
		const trimmedCmd = cmd.trim().toLowerCase();

		if (trimmedCmd === '') return;

		if (trimmedCmd === 'clear') {
			setHistory([]);
			setInput('');
			return;
		}

		const commandFunc = commands[trimmedCmd];

		if (commandFunc) {
			setHistory((prev) => [
				...prev,
				{
					command: cmd,
					output: commandFunc(),
				},
			]);
		} else {
			setHistory((prev) => [
				...prev,
				{
					command: cmd,
					output: createErrorOutput(cmd),
				},
			]);
		}

		setInput('');
	}, []);

	return {
		history,
		input,
		setInput,
		executeCommand,
	};
}
