export function formatMarkdown(text: string): string {
	return text
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>')
		.replace(/^[-•]\s(.+)/gm, '<li>$1</li>')
		.replace(/(<li>.*<\/li>)/gs, '<ul class="list-none space-y-1 mt-1">$1</ul>')
		.replace(/\n\n/g, '<br/><br/>')
		.replace(/\n/g, '<br/>');
}
