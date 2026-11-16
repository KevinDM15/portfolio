import { Application, BlurFilter, Container, Graphics } from 'pixi.js';

/*
 * The living network behind the landing. The visitor is a star travelling down the page: the section
 * anchors are its waypoints, all in one column beside the content, and scrolling moves the star from
 * the hero to the contact block, where it lands. Behind it the travelled path stays lit; ahead only a
 * short dotted stretch shows where it is going. Ambient nodes, links and traffic fill the map.
 */

export type NodeDef = { id: string; label: string; el: HTMLElement };
export type Status = { hops: number; ms: number; text: string };
export type NetworkOptions = { canvas: HTMLCanvasElement; nodes: NodeDef[]; reduce: boolean; onStatus: (s: Status) => void; /** the waypoint the star is currently reading from */ onActive?: (id: string) => void };

type Pt = { x: number; y: number };
/* colours come from the page palette (CSS tokens on :root), so a palette swap recolours the map too */
const tok = (name: string, fallback: number) => {
	if (typeof document === 'undefined') return fallback;
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return /^#[0-9a-f]{6}$/i.test(v) ? parseInt(v.slice(1), 16) : fallback;
};
const CYAN = tok('--cyan', 0x5ad3f3), AMBER = tok('--amber', 0xf5b544), VIOLET = tok('--violet', 0x6d4cff), MUTED = tok('--muted', 0x96a0c8), FG = tok('--fg', 0xeef2ff);

/* a square rotated 45°, `h` is the half-diagonal */
const diamond = (x: number, y: number, h: number): Pt[] => [{ x, y: y - h }, { x: x + h, y }, { x, y: y + h }, { x: x - h, y }];

export async function createNetwork({ canvas, nodes, reduce, onStatus, onActive }: NetworkOptions) {
	const app = new Application();
	await app.init({ canvas, resizeTo: window, backgroundAlpha: 0, antialias: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true });

	const route = new Graphics(), star = new Graphics();
	// bloom: the lit path and the star are drawn a second time, wide and blurred, under the sharp pass
	const glow = new Graphics();
	const glowLayer = new Container();
	glowLayer.addChild(glow);
	glowLayer.filters = [new BlurFilter({ strength: 16, quality: 3 })];
	glowLayer.alpha = 0.4;
	const world = new Container();
	app.stage.addChild(world, star);

	/* ---------- ambient map in three depths: far is small, dim and slow; near is big, bright and quick ---------- */
	type ANode = Pt & { r: number };
	type ALink = { a: number; b: number };
	type Car = { l: number; t: number; v: number; c: number; s: number };
	type Layer = { par: number; alpha: number; size: number; density: number; g: Graphics; tr: Graphics; nodes: ANode[]; links: ALink[]; cars: Car[] };
	const layers: Layer[] = [
		{ par: 0.02, alpha: 0.16, size: 0.6, density: 1 / 52000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
		{ par: 0.06, alpha: 0.32, size: 1, density: 1 / 44000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
		{ par: 0.14, alpha: 0.55, size: 1.9, density: 1 / 170000, g: new Graphics(), tr: new Graphics(), nodes: [], links: [], cars: [] },
	];
	layers.forEach((l) => world.addChild(l.g, l.tr));
	// the path sits between the mid and near layers, so the nearest nodes pass in front of it: it reads as background
	world.addChildAt(glowLayer, 4);
	world.addChildAt(route, 5);
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
			L.cars = Array.from({ length: Math.round(L.links.length * 1.3) }, () => ({ l: Math.floor(Math.random() * L.links.length), t: Math.random(), v: (0.06 + Math.random() * 0.2) * (0.6 + L.par * 4) * (Math.random() < 0.5 ? 1 : -1), c: [CYAN, VIOLET, MUTED][Math.floor(Math.random() * 3)], s: (2 + Math.random() * 2) * L.size }));
			L.g.clear();
			L.links.forEach((l) => { const a = L.nodes[l.a], b = L.nodes[l.b]; L.g.moveTo(a.x, a.y).lineTo(b.x, b.y); });
			L.g.stroke({ color: VIOLET, alpha: 0.18 * L.alpha, width: L.size });
			L.nodes.forEach((p) => L.g.rect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2));
			L.g.fill({ color: CYAN, alpha: 0.5 * L.alpha });
		});
	}

	/* ---------- waypoints anchored to the page ---------- */
	type RNode = { def: NodeDef; doc: Pt; lit: boolean };
	let rNodes: RNode[] = [];
	// document box of an element ignoring CSS transforms, so a section mid-reveal (rotated and shifted) still anchors where it will settle
	function box(el: HTMLElement) {
		let x = 0, y = 0;
		for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
		return { left: x, top: y, width: el.offsetWidth, height: el.offsetHeight };
	}
	function layout() {
		rNodes = nodes.map((def, i) => {
			const r = box(def.el);
			return { def, doc: { x: r.left + r.width / 2, y: r.top + r.height / 2 }, lit: rNodes[i]?.lit ?? false };
		});
	}

	let hops = 0, ms = 0;
	const status = (text: string) => onStatus({ hops, ms, text });

	/* ---------- the star ---------- */
	const pos: Pt = { x: 0, y: 0 };
	let seg = 0, segT = 0, first = true, landed = 0, active = -1;
	const trail: Pt[] = [];
	let clock = 0;
	const small = () => innerWidth < 760;

	// where the star should be: the reading line of the viewport, clamped to the column between the first and last waypoint
	function target(): Pt {
		if (rNodes.length < 2) return { x: innerWidth / 2, y: innerHeight / 2 };
		const last = rNodes[rNodes.length - 1].doc;
		const cy = Math.max(rNodes[0].doc.y, Math.min(last.y, scrollY + innerHeight * 0.45));
		seg = 0;
		while (seg < rNodes.length - 2 && cy >= rNodes[seg + 1].doc.y) seg++;
		const a = rNodes[seg].doc, b = rNodes[seg + 1].doc;
		segT = Math.max(0, Math.min(1, (cy - a.y) / Math.max(1, b.y - a.y)));
		return { x: a.x + (b.x - a.x) * segT, y: cy - scrollY };
	}

	function arrive() {
		rNodes.forEach((n, i) => {
			if (n.lit) return;
			const reached = i === 0 ? true : i === seg + 1 ? segT >= 0.985 : i <= seg;
			if (!reached) return;
			n.lit = true;
			if (i > 0) {
				hops++; ms += 14 + Math.round(Math.abs(n.doc.y - rNodes[i - 1].doc.y) / 60);
				const end = i === rNodes.length - 1;
				if (end) landed = 1;
				status(end ? 'destino alcanzado' : `${n.def.label} alcanzado`);
			}
		});
	}

	function draw(dt: number) {
		clock += dt;
		layers.forEach((L) => {
			L.g.y = L.tr.y = -scrollY * L.par;
			L.tr.clear();
			if (!reduce) L.cars.forEach((c) => { c.t += c.v * dt; if (c.t > 1 || c.t < 0) { c.l = Math.floor(Math.random() * L.links.length); c.t = c.v > 0 ? 0 : 1; } });
			L.cars.forEach((c) => { const l = L.links[c.l]; if (!l) return; const a = L.nodes[l.a], b = L.nodes[l.b]; const x = a.x + (b.x - a.x) * c.t, y = a.y + (b.y - a.y) * c.t; L.tr.rect(x - c.s / 2, y - c.s / 2, c.s, c.s).fill({ color: c.c, alpha: 0.8 * L.alpha }); });
		});

		const t = target();
		if (first || reduce) { pos.x = t.x; pos.y = t.y; first = false; }
		else { pos.x += (t.x - pos.x) * Math.min(1, dt * 7); pos.y += (t.y - pos.y) * Math.min(1, dt * 7); }
		// the section being read: the waypoint the star left last, or the destination once it lands
		if (rNodes.length > 1) {
			const a = seg === rNodes.length - 2 && segT >= 0.985 ? rNodes.length - 1 : seg;
			if (a !== active) { active = a; onActive?.(rNodes[a].def.id); }
		}

		route.clear();
		glow.clear();
		const pts = rNodes.map((n) => ({ x: n.doc.x, y: n.doc.y - scrollY }));
		// phones have no gutter beside the plates: the star and its tail are the whole reference there, no path lines
		if (pts.length && !small()) {
			// the travelled path: lit from the first waypoint down to the star
			const lit: Pt[] = [pts[0]];
			for (let i = 1; i < pts.length && pts[i].y <= pos.y; i++) lit.push(pts[i]);
			lit.push({ x: pos.x, y: pos.y });
			route.moveTo(lit[0].x, lit[0].y);
			lit.slice(1).forEach((p) => route.lineTo(p.x, p.y));
			route.stroke({ color: CYAN, alpha: 0.45, width: 1.4 });
			glow.moveTo(lit[0].x, lit[0].y);
			lit.slice(1).forEach((p) => glow.lineTo(p.x, p.y));
			glow.stroke({ color: CYAN, alpha: 0.35, width: 6 });
			// ahead: a short dotted stretch that fades out, so the destination is hinted, never drawn across the page
			const last = pts[pts.length - 1];
			if (pos.y < last.y - 4) {
				const reach = Math.min(small() ? 150 : 220, last.y - pos.y);
				for (let d = 18; d < reach; d += 12) {
					const k = seg < rNodes.length - 1 ? (pts[seg + 1].x - pos.x) / Math.max(1, pts[seg + 1].y - pos.y) : 0;
					route.rect(pos.x + k * d - 1, pos.y + d - 1, 2, 2).fill({ color: MUTED, alpha: 0.6 * (1 - d / reach) });
				}
			}
		}
		if (pts.length) {
			const last = pts[pts.length - 1];
			// waypoints: a diamond core inside a ring that pulses once lit
			pts.forEach((p, i) => {
				if (p.y < -80 || p.y > innerHeight + 80) return;
				const on = rNodes[i].lit, pulse = reduce ? 0 : (Math.sin(clock * 3 + i) + 1) / 2;
				route.poly(diamond(p.x, p.y, 14 + (on ? pulse * 4 : 0)), true).stroke({ color: on ? CYAN : MUTED, alpha: on ? 0.5 + pulse * 0.4 : 0.45, width: 1.5 });
				route.poly(diamond(p.x, p.y, 6), true).fill({ color: on ? CYAN : MUTED, alpha: on ? 1 : 0.6 });
				if (on) glow.poly(diamond(p.x, p.y, 12), true).fill({ color: CYAN, alpha: 0.8 });
			});
			// landing: two rings open from the last waypoint once the star arrives
			if (landed > 0) {
				const k = 1 - landed;
				[0, 0.35].forEach((o) => { const r = Math.max(0, k - o); if (r > 0) route.poly(diamond(last.x, last.y, 10 + r * 70), true).stroke({ color: AMBER, alpha: (1 - r) * 0.8, width: 1.5 }); });
				landed = reduce ? 0 : Math.max(0, landed - dt * 0.6);
			}
		}

		// the star and its tail
		trail.unshift({ x: pos.x, y: pos.y });
		if (trail.length > 16) trail.pop();
		star.clear();
		const core = small() ? 5 : 6;
		if (!reduce) trail.forEach((p, i) => { const s = Math.max(0.5, core * 0.75 - i * 0.28); star.poly(diamond(p.x, p.y, s), true).fill({ color: AMBER, alpha: Math.max(0.03, 0.8 - i * 0.055) }); });
		star.poly(diamond(pos.x, pos.y, core + 3), true).fill({ color: AMBER, alpha: 0.35 });
		star.poly(diamond(pos.x, pos.y, core), true).fill({ color: AMBER });
		star.poly(diamond(pos.x, pos.y, core * 0.4), true).fill({ color: FG });
		glow.circle(pos.x, pos.y, core * 3).fill({ color: AMBER, alpha: 0.9 });
		arrive();
	}

	buildAmbient();
	layout();
	// phone browsers fire resize whenever the address bar collapses: only a width change rebuilds the ambient net
	let lastW = app.screen.width;
	app.renderer.on('resize', () => { if (app.screen.width !== lastW) { lastW = app.screen.width; buildAmbient(); } layout(); });
	// anchors move as fonts, images and reveals settle: re-measure every frame (five offset reads, no transform maths)
	app.ticker.add(layout);
	status('en ruta · haz scroll');
	app.ticker.add((tk) => draw(Math.min(0.05, tk.deltaMS / 1000)));
	return { relayout: layout };
}
