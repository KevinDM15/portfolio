import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

/*
 * "Generation" of the page while scrolling. Main is split into blocks no taller than the viewport;
 * each one stays hidden until it enters, then a dashed frame appears and the block resolves cell by
 * cell (glyphs first, then the real content) while its headings decode. Blocks play once with a
 * fixed duration (never scrubbed), so text is not left half-scrambled when the scroll stops.
 */

type Options = {
	root: HTMLElement;
	wrap: HTMLElement;
	main: HTMLElement;
	orb: HTMLElement | null;
	/** seconds to wait before the first block (the boot log runs first) */
	delay: number;
	/** 0 = portrait drawn as ASCII, 1 = fully resolved into dots */
	onPortrait: (p: number) => void;
};

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789#/<>_';
const MONO_GLYPHS = '01<>/_#';
const CELL_GLYPHS = '01#/<>_=+*';
const LEAF = 'ul,ol,p,h1,h2,h3,figure,article,button,a';

// blocks: an element that fits in the viewport, or a leaf; taller containers are split into their children
function collect(el: HTMLElement, maxH: number, out: HTMLElement[]) {
	const r = el.getBoundingClientRect();
	if (r.height < 4 || r.width < 4) return;
	const kids = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement && getComputedStyle(c).display !== 'none');
	if (r.height <= maxH || !kids.length || el.matches(LEAF)) { out.push(el); return; }
	kids.forEach((k) => collect(k, maxH, out));
}

// wrap every word of a heading in a span so each one can decode on its own; nested markup is kept
function wrapWords(el: HTMLElement): HTMLElement[] {
	const cached = (el as any)._kgw as HTMLElement[] | undefined;
	if (cached) return cached;
	const out: HTMLElement[] = [];
	const walk = (node: Node) => {
		Array.from(node.childNodes).forEach((c) => {
			if (c.nodeType === Node.ELEMENT_NODE) { if ((c as Element).tagName !== 'BR') walk(c); return; }
			if (c.nodeType !== Node.TEXT_NODE || !c.textContent?.trim()) return;
			const frag = document.createDocumentFragment();
			c.textContent.split(/(\s+)/).forEach((part) => {
				if (!part) return;
				if (/^\s+$/.test(part)) { frag.append(part); return; }
				const s = document.createElement('span');
				s.textContent = part;
				if (/[\p{L}\p{N}]/u.test(part)) out.push(s);
				frag.append(s);
			});
			c.replaceWith(frag);
		});
	};
	walk(el);
	(el as any)._kgw = out;
	return out;
}

export function initGeneration({ root, wrap, main, orb, delay, onPortrait }: Options) {
	const units: HTMLElement[] = [];
	Array.from(main.children).forEach((c) => { if (c instanceof HTMLElement) collect(c, innerHeight * 0.85, units); });
	units.forEach((u) => (u.style.clipPath = 'inset(0 0 100% 0)'));
	root.removeAttribute('data-gen');

	const layer = document.createElement('div');
	layer.className = 'kg-layer';
	layer.setAttribute('aria-hidden', 'true');
	wrap.appendChild(layer);

	// build status: one line in the header bar, so it never covers page content
	const logEl = document.createElement('span');
	logEl.className = 'kg-log';
	logEl.setAttribute('aria-hidden', 'true');
	const logHost = root.querySelector('.kd-right');
	if (logHost) logHost.prepend(logEl);
	let logTimer: number | undefined;
	function log(label: string, ms: number) {
		const ok = document.createElement('b');
		ok.textContent = '[ ok ]';
		logEl.replaceChildren(ok, ` ${label} · ${Math.round(ms)} ms`);
		logEl.classList.add('on');
		clearTimeout(logTimer);
		logTimer = window.setTimeout(() => logEl.classList.remove('on'), 2200);
	}

	// readable frame labels: the section plus what the block is (its heading, or its first words)
	const KIND: Record<string, string> = { figure: 'diagrama', aside: 'recorrido', button: 'acción', a: 'enlace' };
	const clean = (s: string) => s.replace(/[()]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
	const short = (s: string) => (s.length > 30 ? s.slice(0, 29).trimEnd() + '…' : s);
	const nameOf = (u: HTMLElement) => {
		const host = u.closest<HTMLElement>('[data-screen-label]');
		const section = clean((host?.dataset.screenLabel ?? u.getAttribute('aria-label') ?? 'bloque').replace(/^\d+\s*/, ''));
		if (!host || u === host) return section;
		let part = '';
		if (orb && (u === orb || u.contains(orb))) part = 'retrato';
		else {
			const head = u.matches('h1,h2,h3') ? u : u.querySelector<HTMLElement>('h1,h2,h3');
			part = clean(head?.getAttribute('aria-label') ?? head?.innerText ?? '') || KIND[u.tagName.toLowerCase()] || clean(u.innerText ?? '') || 'bloque';
		}
		part = short(part);
		return part === section ? section : `${section} / ${part}`;
	};

	function decode(u: HTMLElement, tl: gsap.core.Timeline) {
		const heads = u.matches('h1,h2,h3') ? [u] : Array.from(u.querySelectorAll<HTMLElement>('h1,h2,h3'));
		heads.forEach((h, i) => {
			const words = wrapWords(h);
			if (!words.length) return;
			const mono = /mono/i.test(getComputedStyle(h).fontFamily);
			tl.to(words, { duration: 0.75, scrambleText: { text: '{original}', chars: mono ? MONO_GLYPHS : GLYPHS, speed: 0.55, tweenLength: false }, stagger: 0.03 }, 0.1 + Math.min(i, 6) * 0.06);
		});
		// the big statement is already split into word spans by the scroll reveal
		const st = u.matches('[data-k="st"]') ? u : u.querySelector<HTMLElement>('[data-k="st"]');
		if (st) {
			const words = Array.from(st.querySelectorAll<HTMLElement>('span')).filter((s) => !s.children.length);
			if (words.length) tl.to(words, { duration: 0.7, scrambleText: { text: '{original}', chars: GLYPHS, speed: 0.55, tweenLength: false }, stagger: 0.025 }, 0.1);
		}
	}

	// the colour behind a block, so its cover cells look like empty page until they clear
	function bgBehind(u: HTMLElement) {
		for (let n = u.parentElement; n && n !== document.documentElement; n = n.parentElement) {
			const c = getComputedStyle(n).backgroundColor;
			if (c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)') return c;
		}
		return getComputedStyle(root).getPropertyValue('--bg').trim() || '#EFEEE9';
	}

	function run(u: HTMLElement) {
		const r = u.getBoundingClientRect();
		// blocks already scrolled past (deep link, restored scroll) appear generated
		if (r.bottom < 0) { u.style.clipPath = ''; if (orb && (u === orb || u.contains(orb))) onPortrait(1); return; }
		const w = wrap.getBoundingClientRect(), h = r.height;
		const cs = getComputedStyle(u);
		const accent = cs.getPropertyValue('--accent').trim() || '#D4470E';
		const frame = document.createElement('div');
		frame.className = 'kg-frame';
		frame.style.cssText = `left:${r.left - w.left}px; top:${r.top - w.top}px; width:${r.width}px; height:${h}px`;
		frame.style.setProperty('--accent', accent);
		frame.style.setProperty('--on-accent', cs.getPropertyValue('--on-accent') || '#fff');
		const tag = document.createElement('span');
		tag.className = 'kg-tag';
		const label = nameOf(u);
		tag.textContent = label;

		// cover made of cells; each clears at its own threshold, mostly random with a slight top-to-bottom drift
		const cover = document.createElement('canvas');
		cover.className = 'kg-cells';
		const cw = Math.ceil(r.width), ch = Math.ceil(h);
		cover.width = cw; cover.height = ch;
		const ctx = cover.getContext('2d')!;
		const cell = innerWidth < 760 ? 18 : 26;
		const cols = Math.ceil(cw / cell), rows = Math.ceil(ch / cell);
		const thr = new Float32Array(cols * rows);
		for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) thr[y * cols + x] = (0.72 * Math.random() + 0.28 * (y / Math.max(1, rows - 1))) * 0.9;
		const bg = bgBehind(u);
		ctx.font = `500 ${Math.round(cell * 0.6)}px 'DM Mono', monospace`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const paint = (p: number) => {
			ctx.clearRect(0, 0, cw, ch);
			const tick = Math.floor(p * 36);
			for (let i = 0; i < thr.length; i++) {
				const t = thr[i];
				if (t < p) continue;
				const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
				ctx.fillStyle = bg;
				ctx.fillRect(x, y, cell + 0.5, cell + 0.5);
				// cells about to clear show a glyph first
				if (t < p + 0.1) { ctx.fillStyle = accent; ctx.fillText(CELL_GLYPHS[(i * 7 + tick) % CELL_GLYPHS.length], x + cell / 2, y + cell / 2); }
			}
		};
		paint(0);
		frame.append(cover, tag);
		layer.appendChild(frame);
		gsap.set(frame, { autoAlpha: 1 });
		u.style.clipPath = '';

		const d = gsap.utils.clamp(0.6, 1.2, 0.5 + (h / 900) * 0.7);
		const st = { p: 0 };
		const tl = gsap.timeline({ onComplete: () => frame.remove() });
		tl.to(st, { p: 1, duration: d, ease: 'none', onUpdate: () => paint(st.p), onComplete: () => log(label, d * 1000) }, 0)
			.to(frame, { autoAlpha: 0, duration: 0.3 }, d);
		decode(u, tl);
		if (orb && (u === orb || u.contains(orb))) {
			const port = { p: 0 };
			tl.to(port, { p: 1, duration: 1.9, ease: 'power1.in', onUpdate: () => onPortrait(port.p) }, 0.1);
		}
	}

	// blocks that enter together are spaced out so they read as a sequence
	let nextAt = performance.now() + delay * 1000;
	function enqueue(u: HTMLElement) {
		const now = performance.now(), at = Math.max(now, nextAt);
		nextAt = at + 110;
		gsap.delayedCall((at - now) / 1000, () => run(u));
	}
	// IntersectionObserver instead of ScrollTrigger: its refresh pass moves the scroll position, and with
	// `html { scroll-behavior: smooth }` that left the page animating to the bottom on load
	const io = new IntersectionObserver((entries) => entries.forEach((e) => {
		if (!e.isIntersecting) return;
		io.unobserve(e.target);
		enqueue(e.target as HTMLElement);
	}), { rootMargin: '0px 0px -12% 0px' });
	units.forEach((u) => io.observe(u));
}
