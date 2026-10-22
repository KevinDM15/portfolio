import { useEffect, useRef, useState } from 'react';
import '../../features/chatbot/chatbot.css';
import { useChatBot } from '../../features/chatbot/hooks/useChatBot';
import { ChatHeader } from '../../features/chatbot/components/ChatHeader';
import { MessageList } from '../../features/chatbot/components/MessageList';
import { QuickReplies } from '../../features/chatbot/components/QuickReplies';
import { SuggestedReplies } from '../../features/chatbot/components/SuggestedReplies';
import { ChatInput } from '../../features/chatbot/components/ChatInput';

const BUBBLE_TEXT = '¡Hola! ¿Quieres saber algo sobre Kevin?';
const BUBBLE_DELAY = 2500;
const CLOSE_MS = 250;

export function ChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [input, setInput] = useState('');
	const [showBubble, setShowBubble] = useState(false);
	const [bubbleDismissed, setBubbleDismissed] = useState(false);
	const [typedText, setTypedText] = useState('');
	const { messages, isLoading, isTyping, suggestions, sendMessage } = useChatBot();
	const inputRef = useRef<HTMLInputElement>(null);
	const closeTimer = useRef<number>();

	// Show bubble after delay, typewriter effect
	useEffect(() => {
		if (bubbleDismissed || isOpen) return;
		const timer = setTimeout(() => setShowBubble(true), BUBBLE_DELAY);
		return () => clearTimeout(timer);
	}, [bubbleDismissed, isOpen]);

	useEffect(() => {
		if (!showBubble) { setTypedText(''); return; }
		let i = 0;
		const interval = setInterval(() => {
			i++;
			setTypedText(BUBBLE_TEXT.slice(0, i));
			if (i >= BUBBLE_TEXT.length) clearInterval(interval);
		}, 35);
		return () => clearInterval(interval);
	}, [showBubble]);

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
		setShowBubble(false);
		setBubbleDismissed(true);
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

			{showBubble && !isOpen && (
				<div className="kc-bubble">
					<button type="button" className="kc-x" onClick={() => { setShowBubble(false); setBubbleDismissed(true); }} aria-label="Cerrar">
						<svg viewBox="0 0 10 10" fill="none">
							<path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
						</svg>
					</button>
					<div className="kc-bubble-text">
						{typedText}
						{typedText.length < BUBBLE_TEXT.length && <span className="kc-caret" />}
					</div>
				</div>
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
