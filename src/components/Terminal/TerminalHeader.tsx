export function TerminalHeader() {
	return (
		<div className="terminal-header bg-gradient-to-r from-dark-alt to-dark-alt border-b-2 border-cyan-400 px-6 py-4 flex items-center justify-between shadow-[inset_0_1px_0_rgba(0,240,255,0.2)]">
			<div className="flex items-center gap-4">
				{/* Neon window dots */}
				<div className="flex gap-2">
					<div className="w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse"></div>
					<div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
					<div className="w-3 h-3 rounded-full bg-magenta-500 shadow-[0_0_8px_rgba(255,0,255,0.8)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
				</div>
				<div className="w-px h-6 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50"></div>
				<span className="text-sm font-code text-cyan-400" style={{ textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
					kevin@portfolio:~$
				</span>
			</div>
			<div className="flex items-center gap-2 text-lime-400 text-xs font-code">
				<span className="i-mdi-terminal"></span>
				<span>CYBERPUNK.sh</span>
				<span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
			</div>
		</div>
	);
}
