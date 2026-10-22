import { useEffect, useRef } from 'react';
import { formatMarkdown } from '../utils/formatMarkdown';
import type { Message } from '../types';

interface MessageListProps {
	messages: Message[];
	isLoading: boolean;
	isTyping: boolean;
}

function TypingIndicator() {
	return (
		<span className="kc-dots" aria-label="Escribiendo">
			<i />
			<i />
			<i />
		</span>
	);
}

export function MessageList({ messages, isLoading, isTyping }: MessageListProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages]);

	return (
		<div ref={containerRef} className="kc-msgs">
			{messages.length === 0 && (
				<div className="kc-empty">
					<p>Pregunta por su experiencia, sus tecnologías o cómo contactarlo.</p>
				</div>
			)}

			{messages.map((msg, i) => {
				const isLast = i === messages.length - 1;
				const showTyping = (isTyping || (isLoading && !msg.content)) && isLast && msg.role === 'assistant';

				return (
					<div key={i} className="kc-row" data-role={msg.role}>
						{msg.role === 'assistant' && (
							<div className="kc-mini">
								<img src="/img/retrato.jpg" alt="Kevin" />
							</div>
						)}

						<div className="kc-msg">
							{showTyping ? <TypingIndicator /> : <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />}
						</div>
					</div>
				);
			})}
		</div>
	);
}
