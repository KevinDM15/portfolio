import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experienceCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
	schema: z.object({
		company: z.string(),
		position: z.string(),
		period: z.string(),
		technologies: z.array(z.string()),
		order: z.number(),
	}),
});

const projectsCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		technologies: z.array(z.string()),
		icon: z.string(),
		iconColor: z.string(),
		gradientFrom: z.string(),
		gradientTo: z.string(),
		githubUrl: z.string().optional(),
		liveUrl: z.string().optional(),
		order: z.number(),
	}),
});

const aboutCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
	schema: z.object({
		type: z.enum(['intro', 'detail']),
		title: z.string().optional(),
		icon: z.string().optional(),
		highlight: z.enum(['accent', 'secondary', 'neutral']).optional(),
		order: z.number(),
	}),
});

export const collections = {
	experience: experienceCollection,
	projects: projectsCollection,
	about: aboutCollection,
};
