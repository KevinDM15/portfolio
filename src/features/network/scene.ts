import { Application, BlurFilter, Container, Graphics } from 'pixi.js';

/*
 * The living network behind the landing. The visitor is a data packet: scrolling moves it along a
 * route whose nodes are anchored to the page sections (the portrait first). Ambient nodes, links
 * and traffic fill the map. Between the first two nodes there is a hop to play: pick the open link,
 * firewalls drop the packet; scrolling past routes the packet automatically.
 */

export type NodeDef = { id: string; label: string; el: HTMLElement; anchor?: 'bottom' | 'left'; /** element used instead on narrow screens */ narrow?: HTMLElement };
export type Status = { hops: number; ms: number; text: string };
export type NetworkOptions = { canvas: HTMLCanvasElement; nodes: NodeDef[]; reduce: boolean; onStatus: (s: Status) => void };

type Pt = { x: number; y: number };
const CORAL = 0xff5a2b, LIME = 0xb8ff3a, CYAN = 0x2be4ff, VIOLET = 0x8b5cff, FG = 0xf2f4ff, MUTED = 0x8c92b0;

const bez = (p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt => {
	const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
	return { x: a * p0.x + b * c1.x + c * c2.x + d * p1.x, y: a * p0.y + b * c1.y + c * c2.y + d * p1.y };
};
/* an S-shaped cable between two nodes; `bend` pushes the middle sideways */
const cable = (p0: Pt, p1: Pt, bend: number) => {
	const dy = p1.y - p0.y;
	return { c1: { x: p0.x + bend, y: p0.y + dy * 0.45 }, c2: { x: p1.x + bend, y: p1.y - dy * 0.45 } };
};
const ease = (t: number) => t * t * (3 - 2 * t);

export async function createNetwork({ canvas, nodes, reduce, onStatus }: NetworkOptions) {
	const app = new Application();
	await app.init({ canvas, resizeTo: window, backgroundAlpha: 0, antialias: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true });

	const route = new Graphics(), gates = new Graphics(), packet = new Graphics();
	// bloom: the live cable and the packet are drawn a second time, wide and blurred, under the sharp pass
	const glow = new Graphics();
	const glowLayer = new Container();
	glowLayer.addChild(glow);
	glowLayer.filters = [new BlurFilter({ strength: 16, quality: 3 })];
	glowLayer.alpha = 0.85;
	const world = new Container();
	app.stage.addChild(world, glowLayer, route, gates, packet);

	/* ---------- ambient map in three depths: far is small, dim and slow; near is big, bright and quick ---------- */
	type ANode = Pt & { r: number };
	type ALink = { a: number; b: number };
	type Car = { l: number; t: number; v: number; c: number; s: number };
	type Layer = { par: number; alpha: number; size: number; density: number; g: Graphics; tr: Graphics; nodes: ANode[]; links: ALink[]; cars: Car[] };
	const layers: Layer[] = [
		{ par: 0.02, alpha: 0.28, size: 0.6, density: 1 / 52000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
		{ par: 0.06, alpha: 0.55, size: 1, density: 1 / 44000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
		{ par: 0.14, alpha: 0.95, size: 1.9, density: 1 / 170000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
	];
	layers.forEach((l) => world.addChild(l.g, l.tr));
	function buildAmbient() {
		const w = app.screen.width, h = app.screen.height + 520;
		layers.forEach((L) => {
			const n = Math.max(6, Math.round(w * h * L.density));
			L.nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (2 + Math.random() * 2.5) * L.size }));
			L.links = [];
			L.nodes.forEach((p, i) => {
				const near = L.nodes.map((q, j) => ({ j, d: (q.x - p.x) ** 2 + (q.y - p.y) ** 2 })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
				near.forEach((o) => { if (!L.links.some((l) => (l.a === o.j && l.b === i) || (l.a === i && l.b === o.j))) L.links.push({ a: i, b: o.j }); });
			});
			L.cars = Array.from({ length: Math.round(L.links.length * 1.3) }, () => ({ l: Math.floor(Math.random() * L.links.length), t: Math.random(), v: (0.06 + Math.random() * 0.2) * (0.6 + L.par * 4) * (Math.random() < 0.5 ? 1 : -1), c: [CYAN, VIOLET, LIME][Math.floor(Math.random() * 3)], s: (2 + Math.random() * 2) * L.size }));
			L.g.clear();
			L.links.forEach((l) => { const a = L.nodes[l.a], b = L.nodes[l.b]; L.g.moveTo(a.x, a.y).lineTo(b.x, b.y); });
			L.g.stroke({ color: VIOLET, alpha: 0.18 * L.alpha, width: L.size });
			L.nodes.forEach((p) => L.g.circle(p.x, p.y, p.r));
			L.g.fill({ color: CYAN, alpha: 0.5 * L.alpha });
		});
	}

	/* ---------- route nodes anchored to the page ---------- */
	type RNode = { def: NodeDef; doc: Pt; lit: boolean };
	let rNodes: RNode[] = [];
	function layout() {
		rNodes = nodes.map((def, i) => {
			const r = (innerWidth < 760 && def.narrow ? def.narrow : def.el).getBoundingClientRect();
			const doc = def.anchor === 'bottom' || i === 0
				? { x: r.left + r.width / 2, y: r.bottom + scrollY + 6 }
				: { x: Math.max(28, r.left - 26), y: r.top + scrollY + r.height / 2 };
			return { def, doc, lit: rNodes[i]?.lit ?? false };
		});
	}

	/* ---------- the first hop: three candidate links, one open ---------- */
	const hop = { state: 'idle' as 'idle' | 'open' | 'done', open: Math.floor(Math.random() * 3), chosen: 1, drops: 0, flash: 0 };
	// the fan of candidate links narrows on phones and is centred on screen, whatever the node positions
	const hopBends = () => {
		const a = rNodes[0], b = rNodes[1];
		const k = Math.min(1, innerWidth / 900);
		const shift = a && b ? Math.max(-200, Math.min(200, (innerWidth / 2 - (a.doc.x + b.doc.x) / 2) / 0.75)) : 0;
		return [-230, 0, 230].map((v) => v * k + shift);
	};
	let hops = 0, ms = 0;
	const status = (text: string) => onStatus({ hops, ms, text });

	function markers(): Pt[] {
		const a = rNodes[0], b = rNodes[1];
		if (!a || !b) return [];
		return hopBends().map((bend) => { const { c1, c2 } = cable(a.doc, b.doc, bend); const p = bez(a.doc, c1, c2, b.doc, 0.5); return { x: p.x, y: p.y - scrollY }; });
	}
	addEventListener('pointerdown', (e) => {
		if (hop.state !== 'open') return;
		if ((e.target as Element).closest?.('a, button, input, textarea, [data-kd] header')) return;
		const hitI = markers().findIndex((m) => (m.x - e.clientX) ** 2 + (m.y - e.clientY) ** 2 < 40 * 40);
		if (hitI < 0) return;
		if (hitI === hop.open) { resolve(hitI, 'enlace abierto · en camino'); }
		else { hop.drops++; hop.flash = 1; status('firewall · paquete descartado, prueba otro'); }
	});
	function resolve(i: number, text: string) {
		hop.state = 'done'; hop.chosen = i;
		status(text);
	}

	/* ---------- packet ---------- */
	const pos: Pt = { x: 0, y: 0 };
	let seg = 0, segT = 0, first = true;
	const trail: Pt[] = [];
	let clock = 0;

	function target(): Pt {
		const cy = scrollY + innerHeight * 0.45;
		if (rNodes.length < 2) return { x: innerWidth / 2, y: innerHeight / 2 };
		seg = 0;
		while (seg < rNodes.length - 2 && cy >= rNodes[seg + 1].doc.y) seg++;
		const a = rNodes[seg], b = rNodes[seg + 1];
		segT = Math.max(0, Math.min(1, (cy - a.doc.y) / Math.max(1, b.doc.y - a.doc.y)));
		// first hop: the packet waits at the node while the link is being chosen
		if (seg === 0) {
			if (hop.state === 'idle' && segT > 0.03) { hop.state = 'open'; status('elige el enlace abierto'); }
			if (hop.state === 'open' && segT >= 0.62) resolve(hop.open, 'ruta automática');
			if (hop.state !== 'done') return { x: a.doc.x, y: a.doc.y - scrollY };
		}
		const bend = seg === 0 ? hopBends()[hop.chosen] : seg % 2 ? -120 : 120;
		const { c1, c2 } = cable(a.doc, b.doc, bend);
		const p = bez(a.doc, c1, c2, b.doc, ease(segT));
		return { x: p.x, y: p.y - scrollY };
	}

	function arrive() {
		rNodes.forEach((n, i) => {
			if (n.lit) return;
			const reached = i === 0 ? true : i === seg + 1 ? segT >= 0.985 : i <= seg;
			if (!reached) return;
			n.lit = true;
			if (i > 0) { hops++; ms += 14 + Math.round(Math.abs(n.doc.y - rNodes[i - 1].doc.y) / 60); status(`${n.def.label} alcanzado`); }
		});
	}

	function draw(dt: number) {
		clock += dt;
		const w = app.screen.width;
		layers.forEach((L) => {
			L.g.y = L.tr.y = -scrollY * L.par;
			L.tr.clear();
			if (!reduce) L.cars.forEach((c) => { c.t += c.v * dt; if (c.t > 1 || c.t < 0) { c.l = Math.floor(Math.random() * L.links.length); c.t = c.v > 0 ? 0 : 1; } });
			L.cars.forEach((c) => { const l = L.links[c.l]; if (!l) return; const a = L.nodes[l.a], b = L.nodes[l.b]; const x = a.x + (b.x - a.x) * c.t, y = a.y + (b.y - a.y) * c.t; L.tr.circle(x, y, c.s / 2).fill({ color: c.c, alpha: 0.8 * L.alpha }); });
		});
		// route
		route.clear();
		glow.clear();
		for (let i = 0; i < rNodes.length - 1; i++) {
			const a = rNodes[i], b = rNodes[i + 1];
			const p0 = { x: a.doc.x, y: a.doc.y - scrollY }, p1 = { x: b.doc.x, y: b.doc.y - scrollY };
			if (p1.y < -600 || p0.y > innerHeight + 600) continue;
			const bends = i === 0 && hop.state !== 'done' ? hopBends() : [i === 0 ? hopBends()[hop.chosen] : i % 2 ? -120 : 120];
			bends.forEach((bend, k) => {
				const { c1, c2 } = cable(p0, p1, bend);
				route.moveTo(p0.x, p0.y).bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
				const live = b.lit || (i === seg && hop.state === 'done');
				route.stroke({ color: live ? LIME : i === 0 && hop.state === 'open' ? CYAN : MUTED, alpha: live ? 0.95 : 0.4, width: live ? 2.5 : 1.2 });
				if (live) glow.moveTo(p0.x, p0.y).bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y).stroke({ color: LIME, alpha: 0.7, width: 9 });
			});
			// node
			const lit = b.lit, pulse = reduce ? 0 : (Math.sin(clock * 3 + i) + 1) / 2;
			route.circle(p1.x, p1.y, 16 + (lit ? pulse * 5 : 0)).stroke({ color: lit ? LIME : MUTED, alpha: lit ? 0.5 + pulse * 0.4 : 0.5, width: 1.5 });
			route.circle(p1.x, p1.y, 5).fill({ color: lit ? LIME : MUTED, alpha: lit ? 1 : 0.6 });
			if (lit) glow.circle(p1.x, p1.y, 14).fill({ color: LIME, alpha: 0.8 });
		}
		if (rNodes[0]) { const p = { x: rNodes[0].doc.x, y: rNodes[0].doc.y - scrollY }; route.circle(p.x, p.y, 5).fill({ color: LIME }); glow.circle(p.x, p.y, 12).fill({ color: LIME, alpha: 0.8 }); }
		// hop markers
		gates.clear();
		if (hop.state === 'open') {
			hop.flash = Math.max(0, hop.flash - dt * 2);
			markers().forEach((m, k) => {
				const isOpen = k === hop.open;
				if (isOpen) {
					const pulse = reduce ? 0.5 : (Math.sin(clock * 5) + 1) / 2;
					gates.circle(m.x, m.y, 18 + pulse * 6).stroke({ color: LIME, alpha: 0.9, width: 2 });
					gates.circle(m.x, m.y, 7).fill({ color: LIME });
				} else {
					const s = 15 + hop.flash * 6;
					gates.circle(m.x, m.y, s).fill({ color: CORAL, alpha: 0.85 + hop.flash * 0.15 });
					gates.moveTo(m.x - 6, m.y - 6).lineTo(m.x + 6, m.y + 6).moveTo(m.x + 6, m.y - 6).lineTo(m.x - 6, m.y + 6).stroke({ color: 0x070a14, width: 2.5 });
				}
			});
		}
		// packet with trail
		const t = target();
		if (first || reduce) { pos.x = t.x; pos.y = t.y; first = false; }
		else { pos.x += (t.x - pos.x) * Math.min(1, dt * 7); pos.y += (t.y - pos.y) * Math.min(1, dt * 7); }
		trail.unshift({ x: pos.x, y: pos.y });
		if (trail.length > 14) trail.pop();
		packet.clear();
		trail.forEach((p, i) => { const s = 4.5 - i * 0.25; packet.circle(p.x, p.y, s).fill({ color: CORAL, alpha: Math.max(0.04, 0.9 - i * 0.07) }); });
		packet.circle(pos.x, pos.y, 7).fill({ color: FG });
		packet.circle(pos.x, pos.y, 4).fill({ color: CORAL });
		glow.circle(pos.x, pos.y, 18).fill({ color: CORAL, alpha: 0.9 });
		if (w > 0) arrive();
	}

	buildAmbient();
	layout();
	app.renderer.on('resize', () => { buildAmbient(); layout(); });
	setInterval(layout, 1000);
	status('paquete listo · haz scroll');
	app.ticker.add((tk) => draw(Math.min(0.05, tk.deltaMS / 1000)));
	return { relayout: layout };
}
