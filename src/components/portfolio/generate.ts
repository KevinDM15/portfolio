import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

/*
 * "Generation" of the page while scrolling. Main is split into blocks no taller than the viewport;
 * each one stays clipped until it enters, then a dashed frame with a scan line sweeps it top to
 * bottom while its headings decode. Blocks play once with a fixed duration (never scrubbed), so
 * text is not left half-scrambled when the scroll stops.
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
const PAD = 120; // lets hand notes that overflow a block stay visible once it is generated
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

	const logEl = document.createElement('div');
	logEl.className = 'kg-log';
	logEl.setAttribute('aria-hidden', 'true');
	root.appendChild(logEl);
	let logTimer: number | undefined;
	function log(label: string, ms: number) {
		const line = document.createElement('div');
		const ok = document.createElement('b');
		ok.textContent = '[ ok ]';
		line.append(ok, ` ${label} · ${Math.round(ms)} ms`);
		logEl.appendChild(line);
		while (logEl.children.length > 5) logEl.firstElementChild!.remove();
		logEl.classList.add('on');
		clearTimeout(logTimer);
		logTimer = window.setTimeout(() => logEl.classList.remove('on'), 2600);
	}

	const nameOf = (u: HTMLElement) => {
		const host = u.closest<HTMLElement>('[data-screen-label], [aria-label]');
		const raw = host?.dataset.screenLabel ?? host?.getAttribute('aria-label') ?? 'bloque';
		return `${raw.replace(/^\d+\s*/, '').toLowerCase()} · <${u.tagName.toLowerCase()}>`;
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

	function run(u: HTMLElement) {
		const r = u.getBoundingClientRect();
		// blocks already scrolled past (deep link, restored scroll) appear generated
		if (r.bottom < 0) { u.style.clipPath = ''; if (orb && (u === orb || u.contains(orb))) onPortrait(1); return; }
		const w = wrap.getBoundingClientRect(), h = r.height;
		const cs = getComputedStyle(u);
		const frame = document.createElement('div');
		frame.className = 'kg-frame';
		frame.style.cssText = `left:${r.left - w.left}px; top:${r.top - w.top}px; width:${r.width}px; height:${h}px`;
		frame.style.setProperty('--accent', cs.getPropertyValue('--accent'));
		frame.style.setProperty('--on-accent', cs.getPropertyValue('--on-accent') || '#fff');
		const tag = document.createElement('span');
		tag.className = 'kg-tag';
		const label = nameOf(u);
		tag.textContent = label;
		const scan = document.createElement('i');
		scan.className = 'kg-scan';
		frame.append(tag, scan);
		layer.appendChild(frame);

		const d = gsap.utils.clamp(0.45, 1.15, 0.35 + (h / 900) * 0.8);
		const st = { p: 0 };
		const tl = gsap.timeline({ onComplete: () => { u.style.clipPath = ''; frame.remove(); } });
		tl.fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0)
			.to(st, {
				p: 1, duration: d, ease: 'power1.inOut',
				onUpdate: () => {
					u.style.clipPath = `inset(0px -${PAD}px ${(1 - st.p) * (h + PAD) - PAD}px -${PAD}px)`;
					scan.style.transform = `translateY(${st.p * h}px)`;
				},
				onComplete: () => log(label, d * 1000),
			}, 0.08)
			.to(frame, { autoAlpha: 0, duration: 0.3 }, 0.08 + d);
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
