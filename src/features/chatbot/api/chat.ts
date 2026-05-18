import type { Message } from '../types';

export async function streamChatResponse(
	messages: Message[],
	onChunk: (text: string) => void
): Promise<void> {
	const res = await fetch('/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ messages }),
	});

	if (!res.ok) throw new Error(`Chat API error: ${res.status}`);

	const reader = res.body!.getReader();
	const decoder = new TextDecoder();
	let streamDone = false;

	while (!streamDone) {
		const { done, value } = await reader.read();
		if (done) break;

		const lines = decoder.decode(value).split('\n');

		for (const line of lines) {
			if (!line.startsWith('data: ')) continue;
			const data = line.slice(6);
			if (data === '[DONE]') { streamDone = true; break; }
			try {
				const parsed = JSON.parse(data);
				if (parsed.text) onChunk(parsed.text);
			} catch {}
		}
	}
}
