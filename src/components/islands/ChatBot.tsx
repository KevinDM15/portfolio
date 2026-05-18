import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useChatBot } from '../../features/chatbot/hooks/useChatBot';
import { ChatHeader } from '../../features/chatbot/components/ChatHeader';
import { MessageList } from '../../features/chatbot/components/MessageList';
import { QuickReplies } from '../../features/chatbot/components/QuickReplies';
import { ChatInput } from '../../features/chatbot/components/ChatInput';

export function ChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState('');
	const { messages, isLoading, sendMessage } = useChatBot();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!dropdownRef.current) return;
		if (isOpen) {
			gsap.fromTo(
				dropdownRef.current,
				{ opacity: 0, y: 16, scale: 0.96, transformOrigin: 'bottom right' },
				{ opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
			);
			setTimeout(() => inputRef.current?.focus(), 350);
		} else {
			gsap.to(dropdownRef.current, {
				opacity: 0, y: 16, scale: 0.96, duration: 0.2, ease: 'power2.in',
			});
		}
	}, [isOpen]);

	const handleSend = () => {
		sendMessage(input);
		setInput('');
	};

	const handleQuickReply = (text: string) => {
		sendMessage(text);
	};

	return (
		<div className="fixed bottom-24 sm:bottom-28 right-6 sm:right-8 z-50 flex flex-col items-end gap-3">
			{isOpen && (
				<div
					ref={dropdownRef}
					className="w-80 sm:w-[22rem] rounded-2xl overflow-hidden border dark:border-white/8 light:border-black/8 flex flex-col"
					style={{
						height: '520px',
						background: 'var(--color-bg, #141419)',
						boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
					}}
				>
					<ChatHeader onClose={() => setIsOpen(false)} />
					<MessageList messages={messages} isLoading={isLoading} />
					{messages.length === 0 && <QuickReplies onSelect={handleQuickReply} />}
					<ChatInput
						value={input}
						onChange={setInput}
						onSubmit={handleSend}
						disabled={isLoading}
						inputRef={inputRef}
					/>
				</div>
			)}

			<button
				onClick={() => setIsOpen(prev => !prev)}
				className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
				style={{
					background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
					boxShadow: '0 4px 24px rgba(224,122,95,0.45)',
				}}
				aria-label="Abrir chat"
			>
				<svg
					width="22" height="22" viewBox="0 0 24 24" fill="none"
					style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
				>
					{isOpen ? (
						<path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
					) : (
						<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					)}
				</svg>
			</button>
		</div>
	);
}
