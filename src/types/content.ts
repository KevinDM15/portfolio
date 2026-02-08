/**
 * Content Collections Types
 * Interfaces for type-safe content from Astro content collections
 */

// ============================================================================
// Experience Types
// ============================================================================

export interface ExperienceData {
	company: string;
	position: string;
	period: string;
	technologies: string[];
	order: number;
}

export interface Experience {
	id: string;
	slug: string;
	data: ExperienceData;
	body: string;
}

// ============================================================================
// Projects Types
// ============================================================================

export interface ProjectData {
	title: string;
	technologies: string[];
	icon: string;
	iconColor: string;
	gradientFrom: string;
	gradientTo: string;
	githubUrl?: string;
	liveUrl?: string;
	order: number;
}

export interface Project {
	id: string;
	slug: string;
	data: ProjectData;
	body: string;
}

// ============================================================================
// About Types
// ============================================================================

export type AboutType = 'intro' | 'detail';
export type AboutHighlight = 'accent' | 'secondary' | 'neutral';

export interface AboutData {
	type: AboutType;
	title?: string;
	icon?: string;
	highlight?: AboutHighlight;
	order: number;
}

export interface About {
	id: string;
	slug: string;
	data: AboutData;
	body: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ExperienceSectionProps {
	experiences: Experience[];
}

export interface ProjectsSectionProps {
	projects: Project[];
}

export interface AboutSectionProps {
	aboutContent: About[];
}
