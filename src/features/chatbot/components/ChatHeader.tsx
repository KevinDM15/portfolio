interface ChatHeaderProps {
	onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
	return (
		<div
			className="flex items-center gap-3 px-4 py-3.5 border-b dark:border-white/8 light:border-black/8 flex-none"
			style={{ background: 'rgba(255,255,255,0.02)' }}
		>
			<div className="relative flex-none">
				<div
					className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm"
					style={{ background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)' }}
				>
					KD
				</div>
				<span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 dark:border-[#141419] light:border-white" />
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-sm font-bold text-theme leading-tight">Asistente de Kevin</p>
				<p className="text-[11px] text-theme-muted flex items-center gap-1.5">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
					En línea
				</p>
			</div>

			<button
				onClick={onClose}
				className="w-7 h-7 rounded-full flex items-center justify-center text-theme-muted hover:text-theme dark:hover:bg-white/8 light:hover:bg-black/8 transition-colors flex-none"
				aria-label="Cerrar chat"
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}
