/*
 * Behaviour of the landing: Bogotá clock, copy-to-clipboard, plate reveal, portrait tilt, the route in the
 * header, and the living network behind everything (loaded on demand from features/network).
 */
const EMAIL = 'kevindiazm.14@gmail.com';
const NODE_LABELS: Record<string, string> = { 'sobre-mi': 'sobre mí', proyectos: 'proyectos', experiencia: 'experiencia', contacto: 'contacto' };

export function initPortfolio() {
	const root = document.querySelector<HTMLElement>('[data-kd]');
	if (!root || root.dataset.ready) return;
	root.dataset.ready = '1';
	const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel);
	const $$ = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- clock (Bogotá) ---------- */
	const timeEls = $$<HTMLElement>('[data-time]');
	const hh = $<SVGLineElement>('[data-k="hh"]'), mm = $<SVGLineElement>('[data-k="mm"]'), sec = $<SVGGElement>('[data-k="sec"]');
	function tick() {
		const now = new Date();
		const parts = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(now);
		const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
		const h = get('hour') % 24, m = get('minute'), s = get('second');
		const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
		timeEls.forEach((el) => { if (el.textContent !== label) el.textContent = label; });
		hh?.setAttribute('transform', `rotate(${(h % 12) * 30 + m * 0.5} 50 50)`);
		mm?.setAttribute('transform', `rotate(${m * 6 + s * 0.1} 50 50)`);
		sec?.setAttribute('transform', `rotate(${s * 6} 50 50)`);
	}
	tick();
	setInterval(tick, 1000);

	/* ---------- copy email ---------- */
	const toast = $<HTMLElement>('[data-k="toast"]');
	let toastTimer: number | undefined;
	function say(text: string) {
		if (!toast) return;
		toast.textContent = text;
		toast.classList.add('on');
		clearTimeout(toastTimer);
		toastTimer = window.setTimeout(() => toast.classList.remove('on'), 1800);
	}
	$$<HTMLElement>('[data-copy]').forEach((el) => el.addEventListener('click', () => {
		const ok = () => say('Correo copiado');
		const fail = () => say('Copia: ' + EMAIL);
		try { navigator.clipboard.writeText(EMAIL).then(ok, fail); } catch { fail(); }
	}));

	/* ---------- plates settle flat when they come into view ---------- */
	const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).dataset.in = '1'; rio.unobserve(e.target); } }), { rootMargin: '0px 0px -14% 0px' });
	$$<HTMLElement>('[data-reveal]').forEach((el) => rio.observe(el));

	/* ---------- the portrait plate tilts toward the cursor ---------- */
	const tilt = $<HTMLElement>('[data-tilt]');
	if (tilt && !reduce && matchMedia('(hover: hover)').matches) {
		root.addEventListener('pointermove', (e) => {
			const r = tilt.getBoundingClientRect();
			const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
			const near = Math.abs(dx) < 1.4 && Math.abs(dy) < 1.4;
			tilt.style.transform = near ? `perspective(1200px) rotateY(${(-10 + dx * 10).toFixed(2)}deg) rotateX(${(2 - dy * 10).toFixed(2)}deg)` : '';
		});
		document.addEventListener('pointerleave', () => (tilt.style.transform = ''));
	}

	/* ---------- the route in the header: where you are, what you passed ---------- */
	const links = $$<HTMLAnchorElement>('[data-nav]');
	const order = ['inicio', 'sobre', 'proyectos', 'experiencia', 'contacto'];
	let cur = '';
	function route() {
		const vh = innerHeight;
		let now = 'inicio';
		order.slice(1).forEach((id) => { const el = root!.querySelector('#' + id); if (el && el.getBoundingClientRect().top < vh / 2) now = id; });
		if (now === cur) return;
		cur = now;
		const idx = order.indexOf(now);
		links.forEach((a) => {
			const i = order.indexOf(a.dataset.nav!);
			if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
			if (i < idx) a.dataset.lit = '1'; else delete a.dataset.lit;
		});
	}
	const bar = $<HTMLElement>('[data-k="bar"]'), paper = $<HTMLElement>('.kd-paper');
	function tone() {
		if (!bar || !paper) return;
		const onPaper = paper.getBoundingClientRect().top < 40;
		if (onPaper) bar.dataset.paper = '1'; else delete bar.dataset.paper;
	}
	addEventListener('scroll', () => { route(); tone(); }, { passive: true });
	route();
	tone();

	/* ---------- the living network ---------- */
	const net = $<HTMLCanvasElement>('[data-k="net"]');
	const trace = $<HTMLElement>('[data-k="trace"]');
	const first = $<HTMLElement>('[data-node="inicio"]');
	if (net && first) {
		const rest = $$<HTMLElement>('[data-node]').filter((el) => el !== first);
		import('../../features/network/scene').then((m) => m.createNetwork({
			canvas: net, reduce,
			nodes: [
				{ id: 'inicio', label: 'inicio', el: first, anchor: 'bottom', narrow: root!.querySelector<HTMLElement>('.kd-hero') ?? undefined },
				...rest.map((el) => ({ id: el.dataset.node!, label: NODE_LABELS[el.dataset.node!] ?? el.dataset.node!, el })),
			],
			onStatus: (s) => { if (trace) trace.replaceChildren(Object.assign(document.createElement('b'), { textContent: `${s.hops} ${s.hops === 1 ? 'salto' : 'saltos'} · ${s.ms} ms` }), ` ${s.text}`); },
		})).catch(() => {});
	}
}
