interface ChatHeaderProps {
	onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
	return (
		<div className="kc-head">
			<div className="kc-avatar">
				<img src="/img/retrato.jpg" alt="Kevin Díaz" />
			</div>

			<div className="kc-title">
				<b>Asistente</b>
				<span>Información sobre Kevin Díaz</span>
			</div>

			<button type="button" onClick={onClose} className="kc-close" aria-label="Cerrar chat">
				<svg viewBox="0 0 12 12" fill="none">
					<path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}
