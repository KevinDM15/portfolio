import { useEffect, useRef, useState } from 'react';
import '../../features/chatbot/chatbot.css';
import { useChatBot } from '../../features/chatbot/hooks/useChatBot';
import { ChatHeader } from '../../features/chatbot/components/ChatHeader';
import { MessageList } from '../../features/chatbot/components/MessageList';
import { QuickReplies } from '../../features/chatbot/components/QuickReplies';
import { SuggestedReplies } from '../../features/chatbot/components/SuggestedReplies';
import { ChatInput } from '../../features/chatbot/components/ChatInput';

const CLOSE_MS = 250;

export function ChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [input, setInput] = useState('');
	const { messages, isLoading, isTyping, suggestions, sendMessage } = useChatBot();
	const inputRef = useRef<HTMLInputElement>(null);
	const closeTimer = useRef<number>();

	useEffect(() => {
		if (isOpen && !isClosing) {
			const t = setTimeout(() => inputRef.current?.focus(), 400);
			return () => clearTimeout(t);
		}
	}, [isOpen, isClosing]);

	useEffect(() => () => clearTimeout(closeTimer.current), []);

	const open = () => {
		clearTimeout(closeTimer.current);
		setIsClosing(false);
		setIsOpen(true);
	};

	const close = () => {
		setIsClosing(true);
		closeTimer.current = window.setTimeout(() => {
			setIsOpen(false);
			setIsClosing(false);
		}, CLOSE_MS);
	};

	const handleSend = () => {
		sendMessage(input);
		setInput('');
	};

	return (
		<div className="kc-root">
			{isOpen && (
				<>
					<div className="kc-backdrop" onClick={close} />
					<div className="kc-panel" role="dialog" aria-label="Asistente de Kevin" data-closing={isClosing || undefined}>
						<ChatHeader onClose={close} />
						<MessageList messages={messages} isLoading={isLoading} isTyping={isTyping} />
						{messages.length === 0 && <QuickReplies onSelect={sendMessage} />}
						<SuggestedReplies suggestions={suggestions} onSelect={sendMessage} />
						<ChatInput value={input} onChange={setInput} onSubmit={handleSend} disabled={isLoading} inputRef={inputRef} />
					</div>
				</>
			)}

			<button
				type="button"
				className="kc-fab"
				data-open={isOpen && !isClosing ? '' : undefined}
				onClick={isOpen && !isClosing ? close : open}
				aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
			>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					{isOpen && !isClosing ? (
						<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
					) : (
						<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					)}
				</svg>
			</button>
		</div>
	);
}
