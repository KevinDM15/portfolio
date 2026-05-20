import { useEffect, useRef, useState } from 'react';
import { streamChatResponse } from '../api/chat';
import type { Message } from '../types';

const STORAGE_KEY = 'chatbot_history';
const MAX_STORED_MESSAGES = 30;

function loadMessages(): Message[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveMessages(messages: Message[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
	} catch {}
}

export function useChatBot() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const abortRef = useRef<boolean>(false);

	useEffect(() => {
		const stored = loadMessages();
		if (stored.length) setMessages(stored);
	}, []);

	const sendMessage = async (text: string) => {
		if (!text.trim() || isLoading) return;

		setSuggestions([]);
		const userMsg: Message = { role: 'user', content: text };
		const history = [...messages, userMsg];
		const withPlaceholder = [...history, { role: 'assistant' as const, content: '' }];

		setMessages(withPlaceholder);
		setIsLoading(true);
		setIsTyping(true);
		abortRef.current = false;

		try {
			let accumulated = '';
			let firstChunk = true;

			await streamChatResponse(
				history,
				(chunk) => {
					if (abortRef.current) return;
					if (firstChunk) {
						firstChunk = false;
						setIsTyping(false);
					}
					accumulated += chunk;
					setMessages(prev => {
						const updated = [...prev];
						updated[updated.length - 1] = { role: 'assistant', content: accumulated };
						return updated;
					});
				},
				(incoming) => {
					if (!abortRef.current) setSuggestions(incoming);
				}
			);

			saveMessages([...history, { role: 'assistant', content: accumulated }]);
		} catch {
			setIsTyping(false);
			setMessages(prev => {
				const updated = [...prev];
				updated[updated.length - 1] = { role: 'assistant', content: 'Ocurrió un error. Intenta de nuevo.' };
				return updated;
			});
		} finally {
			setIsLoading(false);
			setIsTyping(false);
		}
	};

	const reset = () => {
		abortRef.current = true;
		setMessages([]);
		setSuggestions([]);
		setIsLoading(false);
		setIsTyping(false);
		localStorage.removeItem(STORAGE_KEY);
	};

	return { messages, isLoading, isTyping, suggestions, sendMessage, reset };
}
