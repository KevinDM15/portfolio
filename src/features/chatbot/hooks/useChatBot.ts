import { useRef, useState } from 'react';
import { streamChatResponse } from '../api/chat';
import type { Message } from '../types';

export function useChatBot() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<boolean>(false);

	const sendMessage = async (text: string) => {
		if (!text.trim() || isLoading) return;

		const userMsg: Message = { role: 'user', content: text };
		const history = [...messages, userMsg];

		setMessages([...history, { role: 'assistant', content: '' }]);
		setIsLoading(true);
		abortRef.current = false;

		try {
			let accumulated = '';

			await streamChatResponse(history, (chunk) => {
				if (abortRef.current) return;
				accumulated += chunk;
				setMessages(prev => {
					const updated = [...prev];
					updated[updated.length - 1] = { role: 'assistant', content: accumulated };
					return updated;
				});
			});
		} catch {
			setMessages(prev => {
				const updated = [...prev];
				updated[updated.length - 1] = { role: 'assistant', content: 'Ocurrió un error. Intentá de nuevo.' };
				return updated;
			});
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		abortRef.current = true;
		setMessages([]);
		setIsLoading(false);
	};

	return { messages, isLoading, sendMessage, reset };
}
