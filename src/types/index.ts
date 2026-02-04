export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	icon: string;
	iconColor: string;
	gradientFrom: string;
	gradientTo: string;
	githubUrl?: string;
	liveUrl?: string;
}

export interface Experience {
	id: string;
	company: string;
	position: string;
	period: string;
	description: string;
	technologies: string[];
	align?: 'left' | 'right';
}

export interface SocialLink {
	id: string;
	icon: string;
	url: string;
	label: string;
}

export interface NavItem {
	id: string;
	label: string;
	href: string;
}
