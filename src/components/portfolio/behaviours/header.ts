/*
 * The bar: which section is current and which were passed, the frosted and paper tones, the progress line,
 * and the phone menu that opens the route as a full-screen panel.
 */
import type { Behaviour } from './context';
import { SECTIONS } from '../data';

export const header: Behaviour = ({ root, $, $$ }) => {
	const bar = $<HTMLElement>('[data-k="bar"]');
	const links = $$<HTMLAnchorElement>('[data-nav]');
	const paper = $<HTMLElement>('.kd-paper');
	if (!bar) return;

	/* the route: the current section is the last one whose top passed the middle of the viewport */
	const order = SECTIONS.map((s) => s.id);
	let current = '';
	function route() {
		let now: string = order[0];
		order.slice(1).forEach((id) => { const el = root.querySelector('#' + id); if (el && el.getBoundingClientRect().top < innerHeight / 2) now = id; });
		if (now === current) return;
		current = now;
		const index = order.indexOf(now);
		links.forEach((a) => {
			const i = order.indexOf(a.dataset.nav ?? '');
			if (i === index) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
			if (i < index) a.dataset.lit = '1'; else delete a.dataset.lit;
		});
	}

	/* the tone: frosted once scrolled, light over the paper, and how far down the page is */
	function tone() {
		const onPaper = !!paper && paper.getBoundingClientRect().top < 40;
		if (onPaper) { bar!.dataset.paper = '1'; root.dataset.paper = '1'; } else { delete bar!.dataset.paper; delete root.dataset.paper; }
		if (scrollY > 24) bar!.dataset.scrolled = '1'; else delete bar!.dataset.scrolled;
		const span = document.documentElement.scrollHeight - innerHeight;
		bar!.style.setProperty('--progress', String(span > 0 ? Math.min(1, scrollY / span) : 0));
	}

	/* the phone menu */
	const burger = $<HTMLButtonElement>('[data-k="burger"]');
	function menu(open: boolean) {
		if (!burger) return;
		if (open) bar!.dataset.open = '1'; else delete bar!.dataset.open;
		burger.setAttribute('aria-expanded', String(open));
		burger.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú');
		document.documentElement.style.overflow = open ? 'hidden' : '';
	}
	burger?.addEventListener('click', () => menu(!bar!.dataset.open));
	links.forEach((a) => a.addEventListener('click', () => menu(false)));
	addEventListener('keydown', (e) => { if (e.key === 'Escape') menu(false); });
	addEventListener('resize', () => { if (innerWidth >= 900) menu(false); }, { passive: true });

	addEventListener('scroll', () => { route(); tone(); }, { passive: true });
	route();
	tone();
};
