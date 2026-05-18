import type { APIRoute } from 'astro';
import Groq from 'groq-sdk';

export const prerender = false;

const SYSTEM_PROMPT = `Eres el asistente personal de Kevin Díaz, un desarrollador de software Full-Stack con más de 6 años de experiencia. Responde preguntas sobre Kevin de forma amigable, profesional y concisa. No inventes información — solo usa los datos que tienes aquí.

## Sobre Kevin
Kevin Díaz es un desarrollador Full-Stack con enfoque AI-First, basado en Barranquilla, Colombia.

## Experiencia laboral
- **The Rocket Code** (Oct 2023 – presente): Desarrollador Full-Stack. Stack: Next.js, React, NestJS, PostgreSQL, AWS, MaterialUI, Redux.
- **Wawandco** (anterior): Desarrollador. Stack: React, Ruby on Rails.
- **Koombea** (anterior): Desarrollador. Stack: React, Node.js.

## Habilidades técnicas
- Frontend: React, Next.js, TypeScript, TailwindCSS, UnoCSS
- Backend: NestJS, Node.js, PostgreSQL, AWS
- Herramientas: Git, Docker, Vercel
- Otros: IA/LLMs, arquitectura limpia

## Contacto
- Email: kevindiazm.14@gmail.com
- LinkedIn: https://www.linkedin.com/in/kevindm14/
- GitHub: https://github.com/KevinDM15

## Instrucciones
- Responde siempre en el idioma en que te hablen (español o inglés)
- Sé conciso pero informativo
- Si no sabes algo sobre Kevin, dilo honestamente
- No respondas preguntas que no tengan relación con Kevin o su trabajo profesional`;

export const POST: APIRoute = async ({ request }) => {
	try {
	const groq = new Groq({ apiKey: import.meta.env.GROQ_API_KEY });

	const body = await request.json();
	const { messages } = body;

	const stream = await groq.chat.completions.create({
		model: 'llama-3.1-8b-instant',
		messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
		stream: true,
		max_tokens: 512,
	});

	const encoder = new TextEncoder();
	const readable = new ReadableStream({
		async start(controller) {
			for await (const chunk of stream) {
				const text = chunk.choices[0]?.delta?.content ?? '';
				if (text) {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
				}
			}
			controller.enqueue(encoder.encode('data: [DONE]\n\n'));
			controller.close();
		},
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		},
	});
	} catch (err) {
		console.error('[chat api error]', err);
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};
