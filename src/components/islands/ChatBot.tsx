import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useChatBot } from '../../features/chatbot/hooks/useChatBot';
import { ChatHeader } from '../../features/chatbot/components/ChatHeader';
import { MessageList } from '../../features/chatbot/components/MessageList';
import { QuickReplies } from '../../features/chatbot/components/QuickReplies';
import { SuggestedReplies } from '../../features/chatbot/components/SuggestedReplies';
import { ChatInput } from '../../features/chatbot/components/ChatInput';

const BUBBLE_TEXT = '¡Hola! ¿Quieres saber algo sobre Kevin?';
const BUBBLE_DELAY = 2500;

export function ChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState('');
	const [showBubble, setShowBubble] = useState(false);
	const [bubbleDismissed, setBubbleDismissed] = useState(false);
	const [typedText, setTypedText] = useState('');
	const { messages, isLoading, isTyping, suggestions, sendMessage } = useChatBot();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const bubbleRef = useRef<HTMLDivElement>(null);

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
		if (!bubbleRef.current || !showBubble) return;
		gsap.fromTo(bubbleRef.current,
			{ opacity: 0, x: 16, scale: 0.9 },
			{ opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }
		);
	}, [showBubble]);

	// Desktop dropdown animation
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

	// Mobile bottom sheet animation
	useEffect(() => {
		if (!sheetRef.current || !backdropRef.current) return;
		if (isOpen) {
			gsap.fromTo(backdropRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.25 }
			);
			gsap.fromTo(sheetRef.current,
				{ y: '100%' },
				{ y: '0%', duration: 0.4, ease: 'power3.out' }
			);
			setTimeout(() => inputRef.current?.focus(), 400);
		} else {
			gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 });
			gsap.to(sheetRef.current, { y: '100%', duration: 0.3, ease: 'power2.in' });
		}
	}, [isOpen]);

	const handleSend = () => {
		sendMessage(input);
		setInput('');
	};

	const handleQuickReply = (text: string) => {
		sendMessage(text);
	};

	const handleOpen = () => {
		setIsOpen(prev => !prev);
		setShowBubble(false);
		setBubbleDismissed(true);
	};

	const chatContent = (
		<>
			<ChatHeader onClose={() => setIsOpen(false)} />
			<MessageList messages={messages} isLoading={isLoading} isTyping={isTyping} />
			{messages.length === 0 && <QuickReplies onSelect={handleQuickReply} />}
			<SuggestedReplies suggestions={suggestions} onSelect={handleQuickReply} />
			<ChatInput
				value={input}
				onChange={setInput}
				onSubmit={handleSend}
				disabled={isLoading}
				inputRef={inputRef}
			/>
		</>
	);

	return (
		<>
			{/* Mobile bottom sheet */}
			{isOpen && (
				<div className="sm:hidden">
					<div
						ref={backdropRef}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsOpen(false)}
					/>
					<div
						ref={sheetRef}
						className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl overflow-hidden border-t dark:border-white/8 light:border-black/8"
						style={{
							height: '85dvh',
							background: 'var(--color-bg, #141419)',
							boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
						}}
					>
						{/* Drag handle */}
						<div className="flex justify-center pt-3 pb-1 flex-none">
							<div className="w-10 h-1 rounded-full dark:bg-white/20 light:bg-black/20" />
						</div>
						{chatContent}
					</div>
				</div>
			)}

			{/* Desktop dropdown */}
			<div className={`fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-30 flex-col items-end gap-3 ${isOpen ? 'hidden sm:flex' : 'flex'}`}>
				{isOpen && (
					<div
						ref={dropdownRef}
						className="hidden sm:flex w-[22rem] rounded-2xl overflow-hidden border dark:border-white/8 light:border-black/8 flex-col"
						style={{
							height: 'min(520px, calc(100vh - 120px))',
							background: 'var(--color-bg, #141419)',
							boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
						}}
					>
						{chatContent}
					</div>
				)}

				{/* Proactive bubble */}
				{showBubble && !isOpen && (
					<div
						ref={bubbleRef}
						className="absolute bottom-16 right-0 flex items-start gap-1.5"
						style={{ width: 'max-content', maxWidth: '220px' }}
					>
						<button
							onClick={() => { setShowBubble(false); setBubbleDismissed(true); }}
							className="mt-1 w-4 h-4 rounded-full flex items-center justify-center dark:bg-white/10 light:bg-black/10 hover:bg-white/20 transition-colors flex-none"
							aria-label="Cerrar"
						>
							<svg width="7" height="7" viewBox="0 0 10 10" fill="none">
								<path d="M1 1l8 8M9 1L1 9" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
							</svg>
						</button>
						<div
							className="relative px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed"
							style={{
								background: 'white',
								color: '#1a1a1a',
								boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
							}}
						>
							{typedText}
							{typedText.length < BUBBLE_TEXT.length && (
								<span className="inline-block w-0.5 h-3.5 ml-0.5 bg-black/40 animate-pulse align-middle" />
							)}
						</div>
					</div>
				)}

				<button
					onClick={handleOpen}
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
		</>
	);
}
