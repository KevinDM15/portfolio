import { forwardRef, type ReactNode } from 'react';

interface TerminalBodyProps {
	children: ReactNode;
	onClick: () => void;
}

export const TerminalBody = forwardRef<HTMLDivElement, TerminalBodyProps>(
	({ children, onClick }, ref) => {
		return (
			<div
				ref={ref}
				className="terminal-body bg-dark-alt/80 p-8 font-code text-sm flex-1 overflow-y-auto cursor-text min-h-0 relative"
				onClick={onClick}
				style={{
					backgroundImage: `
						linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.03) 25%, rgba(0, 240, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.03) 75%, rgba(0, 240, 255, 0.03) 76%, transparent 77%, transparent),
						linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.03) 25%, rgba(0, 240, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.03) 75%, rgba(0, 240, 255, 0.03) 76%, transparent 77%, transparent)
					`,
					backgroundSize: '50px 50px',
					color: 'rgb(224, 224, 255)',
					lineHeight: '1.8',
				}}
			>
				<div className="relative z-10">
					{children}
				</div>
			</div>
		);
	}
);

TerminalBody.displayName = 'TerminalBody';
