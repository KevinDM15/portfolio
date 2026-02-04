import type { CommandOutput } from './types';

interface CommandHistoryProps {
	history: CommandOutput[];
}

export function CommandHistory({ history }: CommandHistoryProps) {
	if (history.length === 0) return null;

	return (
		<>
			{history.map((entry, index) => (
				<div key={index} className="mb-6 pb-4 border-b border-cyan-400/20">
					{/* Command line */}
					<div className="flex items-start gap-2 mb-2">
						<span className="text-cyan-400 font-bold" style={{ textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>$</span>
						<span className="text-lime-400 font-code" style={{ textShadow: '0 0 8px rgba(57,255,20,0.4)' }}>
							{entry.command}
						</span>
					</div>
					{/* Output */}
					<div className="pl-6 text-cyan-400 text-sm leading-relaxed">
						{entry.output}
					</div>
				</div>
			))}
		</>
	);
}
