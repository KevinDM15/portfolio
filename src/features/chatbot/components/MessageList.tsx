import { useEffect, useRef } from 'react';
import { formatMarkdown } from '../utils/formatMarkdown';
import type { Message } from '../types';

interface MessageListProps {
	messages: Message[];
	isLoading: boolean;
}

function TypingIndicator() {
	return (
		<span className="flex gap-1 items-center h-4 px-1">
			{[0, 150, 300].map(delay => (
				<span
					key={delay}
					className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce"
					style={{ animationDelay: `${delay}ms` }}
				/>
			))}
		</span>
	);
}

function BotAvatar() {
	return (
		<div
			className="w-6 h-6 flex-none mb-0.5 overflow-hidden"
			style={{
				borderRadius: '7px',
				border: '1px solid rgba(212,98,42,0.4)',
			}}
		>
			<img
				src="/profile_recreated.png"
				alt="Kevin"
				className="w-full h-full object-cover object-top"
			/>
		</div>
	);
}

export function MessageList({ messages, isLoading }: MessageListProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
			{messages.length === 0 && (
				<div className="flex flex-col items-center text-center pt-4 pb-2">
					<p className="text-sm font-semibold text-theme mb-1">Hola</p>
					<p className="text-xs text-theme-muted leading-relaxed max-w-[200px]">
						Soy el asistente de Kevin. Preguntame sobre su experiencia, stack o cómo contactarlo.
					</p>
				</div>
			)}

			{messages.map((msg, i) => {
				const isLast = i === messages.length - 1;
				const showTyping = isLoading && isLast && msg.role === 'assistant' && !msg.content;

				return (
					<div
						key={i}
						className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						{msg.role === 'assistant' && <BotAvatar />}

						<div
							className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed ${
								msg.role === 'user'
									? 'text-white rounded-2xl rounded-br-sm'
									: 'text-theme dark:bg-white/6 light:bg-black/5 rounded-2xl rounded-bl-sm'
							}`}
							style={msg.role === 'user' ? {
								background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
							} : {}}
						>
							{showTyping ? (
								<TypingIndicator />
							) : (
								<span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
							)}
						</div>
					</div>
				);
			})}

			<div ref={bottomRef} />
		</div>
	);
}
