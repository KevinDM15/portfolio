/*
 * The work ledger: each row opens into what I did, one at a time, and the preview plate beside the ledger shows the
 * schematic of the row under the pointer or, failing that, of the open row.
 */
import type { Behaviour } from './context';

export const work: Behaviour = ({ $, $$ }) => {
	const heads = $$<HTMLButtonElement>('[data-work]');
	const slides = $$<HTMLElement>('[data-slide]');
	let open = -1;

	const show = (index: number) => slides.forEach((s) => { if (Number(s.dataset.slide) === index) s.dataset.on = ''; else delete s.dataset.on; });
	const set = (head: HTMLButtonElement, expanded: boolean) => {
		head.setAttribute('aria-expanded', String(expanded));
		const panel = $<HTMLElement>('#' + head.getAttribute('aria-controls'));
		if (panel) panel.hidden = !expanded;
	};

	heads.forEach((head, index) => {
		head.addEventListener('click', () => {
			open = open === index ? -1 : index;
			heads.forEach((other, i) => set(other, i === open));
			show(open < 0 ? index : open);
		});
		head.addEventListener('pointerenter', () => show(index));
		head.addEventListener('pointerleave', () => show(open < 0 ? index : open));
	});
};
