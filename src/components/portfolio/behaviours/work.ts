/*
 * The work ledger: rows with a body open into what I did, one at a time, and the preview plate beside the ledger
 * shows the schematic of the row under the pointer or, failing that, of the open row (or the first one).
 */
import type { Behaviour } from './context';

export const work: Behaviour = ({ $, $$ }) => {
	const heads = $$<HTMLElement>('[data-work]');
	const slides = $$<HTMLElement>('[data-slide]');
	let open = -1;

	const show = (index: number) => slides.forEach((s) => { if (Number(s.dataset.slide) === index) s.dataset.on = ''; else delete s.dataset.on; });
	const resting = () => (open < 0 ? 0 : open);
	const set = (head: HTMLElement, expanded: boolean) => {
		head.setAttribute('aria-expanded', String(expanded));
		const panel = $<HTMLElement>('#' + head.getAttribute('aria-controls'));
		if (panel) panel.hidden = !expanded;
	};

	heads.forEach((head) => {
		const index = Number(head.dataset.work);
		head.addEventListener('pointerenter', () => show(index));
		head.addEventListener('pointerleave', () => show(resting()));
		if (!head.hasAttribute('aria-controls')) return;
		head.addEventListener('click', () => {
			open = open === index ? -1 : index;
			heads.forEach((other) => { if (other.hasAttribute('aria-controls')) set(other, Number(other.dataset.work) === open); });
			show(open < 0 ? index : open);
		});
	});
};
