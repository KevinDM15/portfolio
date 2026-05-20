export function formatMarkdown(text: string): string {
	return text
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>')
		.replace(/^[-•]\s(.+)/gm, '<li>$1</li>')
		.replace(/(<li>.*<\/li>)/gs, '<ul class="list-none space-y-1 mt-1">$1</ul>')
		.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:opacity-80 transition-opacity">$1</a>')
		.replace(/([^\s]+)\s*\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:opacity-80 transition-opacity">$1</a>')
		.replace(/(^|[\s>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:opacity-80 transition-opacity">$2</a>')
		.replace(/\n\n/g, '<br/><br/>')
		.replace(/\n/g, '<br/>');
}
