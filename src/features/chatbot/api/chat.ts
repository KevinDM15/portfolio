import type { Message } from '../types';

export async function streamChatResponse(
	messages: Message[],
	onChunk: (text: string) => void,
	onSuggestions?: (suggestions: string[]) => void
): Promise<void> {
	const res = await fetch('/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ messages }),
	});

	if (!res.ok) throw new Error(`Chat API error: ${res.status}`);

	const reader = res.body!.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	const processLines = (lines: string[]) => {
		for (const line of lines) {
			if (!line.startsWith('data: ')) continue;
			const data = line.slice(6);
			if (data === '[DONE]') continue;
			try {
				const parsed = JSON.parse(data);
				if (parsed.text) onChunk(parsed.text);
				if (parsed.suggestions) onSuggestions?.(parsed.suggestions);
			} catch {}
		}
	};

	while (true) {
		const { done, value } = await reader.read();

		buffer += value ? decoder.decode(value, { stream: !done }) : '';

		const lines = buffer.split('\n');
		buffer = done ? '' : (lines.pop() ?? '');
		processLines(lines);

		if (done) break;
	}
}
