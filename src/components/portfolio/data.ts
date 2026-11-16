/*
 * Everything the landing says about Kevin, in one place. Sections read from here; nothing in here knows about markup.
 */

export const EMAIL = 'kevindiazm.14@gmail.com';
export const PHONE = { label: '+57 300 232 9174', href: 'tel:+573002329174' };
export const REPO = 'https://github.com/KevinDM15/portfolio';
export const CV = '/CV_KEVIN_ES.pdf';
export const SOCIAL = [
	{ name: 'GitHub', url: 'https://github.com/KevinDM15' },
	{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/kevindm14/' },
];

/** the sections of the page, in reading order; `node` is the waypoint id the star travels through */
export const SECTIONS = [
	{ id: 'inicio', href: '#top', label: 'Inicio', node: 'inicio', target: '.kd-hero' },
	{ id: 'sobre', href: '#sobre', label: 'Sobre mí', node: 'sobre-mi', target: '#sobre' },
	{ id: 'proyectos', href: '#proyectos', label: 'Proyectos', node: 'proyectos', target: '#proyectos' },
	{ id: 'experiencia', href: '#experiencia', label: 'Experiencia', node: 'experiencia', target: '#experiencia' },
	{ id: 'contacto', href: '#contacto', label: 'Contacto', node: 'contacto', target: '#contacto' },
] as const;

/** where Kevin has worked, with the initials shown on the tiles */
export const companies = {
	cuc: { name: 'Universidad de la Costa', short: 'CUC', url: 'https://www.cuc.edu.co' },
	elsol: { name: 'El Sol Neighborhood Educational Center', short: 'El Sol', url: 'https://elsolnec.org' },
	rocket: { name: 'The Rocket Code', short: 'RC', url: 'https://therocketcode.com' },
	wawandco: { name: 'Wawandco', short: 'W', url: 'https://wawand.co' },
	koombea: { name: 'Koombea', short: 'K', url: 'https://www.koombea.com' },
};
export const now = [companies.cuc, companies.elsol];
export const before = [companies.rocket, companies.wawandco, companies.koombea];

/** the stack as network modules: name, where it lives in my work, a short interface-like id and its mark in /svg/tech */
export const tech = [
	{ name: 'React', kind: 'frontend', id: 'ui0', icon: 'react' },
	{ name: 'Next.js', kind: 'frontend', id: 'ui1', icon: 'nextdotjs' },
	{ name: 'React Native', kind: 'móvil', id: 'mb0', icon: 'react' },
	{ name: 'TypeScript', kind: 'lenguaje', id: 'ts0', icon: 'typescript' },
	{ name: 'NestJS', kind: 'backend', id: 'api0', icon: 'nestjs' },
	{ name: 'Go', kind: 'backend', id: 'api1', icon: 'go' },
	{ name: 'Python', kind: 'backend', id: 'api2', icon: 'python' },
	{ name: 'PostgreSQL', kind: 'datos', id: 'db0', icon: 'postgresql' },
	{ name: 'AWS', kind: 'cloud', id: 'cl0', icon: 'amazonwebservices' },
	{ name: 'GCP', kind: 'cloud', id: 'cl1', icon: 'googlecloud' },
	{ name: 'LLMs', kind: 'IA', id: 'ai0', icon: 'llm' },
	{ name: 'Arquitectura hexagonal', kind: 'diseño', id: 'arq', icon: 'hexagonal' },
];
/** the part of the stack that has a brand mark, for the fact rows */
export const stack = tech.filter((t) => !['llm', 'hexagonal'].includes(t.icon));

export const readouts = [
	{ figure: '2018', text: 'Primer empleo como desarrollador' },
	{ figure: '5', text: 'Empresas y clientes, del backend al frontend' },
	{ figure: 'Yo + IA', text: 'Personas deciden, agentes ejecutan' },
];

/** what is being built right now, while the first case study is on its way */
export const building = [
	{ name: 'Este portafolio', text: 'La landing como mapa de red con PixiJS sobre Astro, y un asistente que responde con el CV como contexto.', url: REPO, meta: 'TypeScript · Astro' },
];

export const jobs = [
	{ when: 'Jun 2026 — hoy', span: '4 meses y contando', name: companies.cuc.name, url: companies.cuc.url, role: 'Desarrollador full-stack · Freelance', text: 'Desarrollo aplicaciones web con Vite y React y diseño arquitecturas y planes técnicos para nuevas funcionalidades. Migro de forma progresiva módulos legacy (PHP, JavaScript y jQuery) hacia una arquitectura moderna, con React en el frontend y Python serverless en el backend.', tags: ['React', 'Vite', 'Python', 'Serverless'] },
	{ when: 'Ene 2026 — hoy', span: '9 meses y contando', name: companies.elsol.name, url: companies.elsol.url, role: 'Desarrollador full-stack · Freelance', text: 'Desarrollo aplicaciones web y móviles con Next.js, React y React Native, con interfaces multiplataforma que priorizan rendimiento, usabilidad y consistencia visual. Diseño arquitecturas y planes técnicos, y trabajo en equipos ágiles con Scrum.', tags: ['Next.js', 'React', 'React Native'] },
	{ when: 'Oct 2023 — Jul 2026', span: '2 años, 9 meses', name: companies.rocket.name, url: companies.rocket.url, role: 'Desarrollador full-stack · Freelance', text: 'Optimicé aplicaciones del lado del cliente para escalar y responder más rápido. Creé APIs con NestJS, PostgreSQL y AWS bajo arquitectura hexagonal, integré modelos de lenguaje (LLMs) por API para automatizar procesos y construí componentes reutilizables con React, MaterialUI, Redux y Next.js.', tags: ['Next.js', 'React', 'NestJS', 'PostgreSQL', 'AWS', 'LLMs'] },
	{ when: 'Ago 2020 — Abr 2023', span: '2 años, 8 meses', name: companies.wawandco.name, url: companies.wawandco.url, role: 'Desarrollador full-stack', text: 'Mejoré código nativo en Go aplicando SOLID, Clean Code y MVC. Implementé servicios backend y funciones serverless en GCP, reduje la deuda técnica y migré librerías a versiones actuales.', tags: ['Go', 'GCP', 'Cloud Functions', 'Firestore'] },
	{ when: 'Ago — Dic 2018', span: '5 meses', name: companies.koombea.name, url: companies.koombea.url, role: 'Desarrollador full-stack', text: 'Desarrollo de aplicaciones web con JavaScript, HTML y CSS.', tags: ['JavaScript'] },
];

/** timeline lanes: months since Jan 2018 over a 108-month axis (2018 to 2026) */
export const TIMELINE_MONTHS = 108;
export const lanes = [
	{ name: 'CUC', when: 'Jun 26 — hoy', start: 101, length: 5 },
	{ name: 'El Sol', when: 'Ene 26 — hoy', start: 96, length: 10 },
	{ name: 'Rocket Code', when: 'Oct 23 — Jul 26', start: 69, length: 33 },
	{ name: 'Wawandco', when: 'Ago 20 — Abr 23', start: 31, length: 32 },
	{ name: 'Koombea', when: 'Ago — Dic 18', start: 7, length: 5 },
];

export type CredentialKind = 'degree' | 'certificate';
export const credentials: { title: string; detail: string; kind: CredentialKind }[] = [
	{ title: 'Técnico en Programación de Software', detail: 'SENA · 2017 — 2018', kind: 'degree' },
	{ title: 'Técnico en Mantenimiento de Sistemas Informáticos', detail: 'UniBarranquilla · 2019 — 2021', kind: 'degree' },
	{ title: 'Tecnólogo en Gestión de Sistemas Informáticos', detail: 'UniBarranquilla · 2022 — hoy', kind: 'degree' },
	{ title: 'Scrum Developer', detail: 'Kleer · 2023', kind: 'certificate' },
];
/** `level` is a five-step meter, not a score */
export const languages = [
	{ name: 'Español', detail: 'Nativo', level: 5 },
	{ name: 'Inglés', detail: 'Básico', level: 2 },
];
