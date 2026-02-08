import { defineCollection, z } from 'astro:content';

const experienceCollection = defineCollection({
	type: 'content',
	schema: z.object({
		company: z.string(),
		position: z.string(),
		period: z.string(),
		technologies: z.array(z.string()),
		order: z.number(),
	}),
});

const projectsCollection = defineCollection({
	type: 'content',
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
	type: 'content',
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
