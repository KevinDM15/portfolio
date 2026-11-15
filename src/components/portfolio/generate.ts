import { gsap } from 'gsap';

/*
 * Page reveal while scrolling. Each section is one unit: it stays hidden until it enters, then a
 * dashed frame with the section label blinks in and the content fades up. Plays once, fixed
 * duration, so nothing keeps moving once a section is on screen.
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

// units: the direct children of main (sections, the marquee, the footer)
function collect(main: HTMLElement, out: HTMLElement[]) {
	Array.from(main.children).forEach((el) => {
		if (!(el instanceof HTMLElement) || getComputedStyle(el).display === 'none') return;
		const r = el.getBoundingClientRect();
		if (r.height >= 4 && r.width >= 4) out.push(el);
	});
}

export function initGeneration({ root, wrap, main, orb, delay, onPortrait }: Options) {
	const units: HTMLElement[] = [];
	collect(main, units);
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

	const nameOf = (u: HTMLElement) =>
		(u.dataset.screenLabel ?? u.getAttribute('aria-label') ?? 'bloque').replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim().toLowerCase();


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

		frame.append(tag);
		layer.appendChild(frame);
		gsap.set(frame, { autoAlpha: 1 });
		u.style.clipPath = '';

		const d = 0.55;
		const tl = gsap.timeline({ onComplete: () => { frame.remove(); u.style.opacity = ''; u.style.transform = ''; } });
		tl.fromTo(u, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d, ease: 'power2.out', onComplete: () => log(label, d * 1000) }, 0)
			.to(frame, { autoAlpha: 0, duration: 0.25 }, d + 0.15);
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
	const pending = new Set(units);
	const io = new IntersectionObserver((entries) => entries.forEach((e) => {
		if (!e.isIntersecting) return;
		io.unobserve(e.target);
		pending.delete(e.target as HTMLElement);
		enqueue(e.target as HTMLElement);
	}), { rootMargin: '0px 0px -12% 0px' });
	units.forEach((u) => io.observe(u));
	// a unit jumped over without ever entering the viewport (anchor link, fast scroll) is shown as generated
	const catchUp = () => {
		pending.forEach((u) => {
			const r = u.getBoundingClientRect();
			if (r.top > innerHeight) return;
			pending.delete(u);
			io.unobserve(u);
			if (r.bottom < 0) {
				u.style.clipPath = '';
				if (orb && (u === orb || u.contains(orb))) onPortrait(1);
			} else enqueue(u); // partly on screen after a jump: generate it now
		});
	};
	addEventListener('scroll', catchUp, { passive: true });
}
