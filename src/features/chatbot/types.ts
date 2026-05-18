export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export interface QuickReply {
	label: string;
	text: string;
	icon: React.ReactNode;
}
