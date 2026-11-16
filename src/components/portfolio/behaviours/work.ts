/* the work ledger: each row opens into what I did; only one row stays open at a time */
import type { Behaviour } from './context';

export const work: Behaviour = ({ $$ }) => {
	const heads = $$<HTMLButtonElement>('[data-work]');
	const body = (head: HTMLButtonElement) => document.getElementById(head.getAttribute('aria-controls') ?? '');
	const set = (head: HTMLButtonElement, open: boolean) => {
		head.setAttribute('aria-expanded', String(open));
		const panel = body(head);
		if (panel) panel.hidden = !open;
	};
	heads.forEach((head) => head.addEventListener('click', () => {
		const open = head.getAttribute('aria-expanded') !== 'true';
		heads.forEach((other) => set(other, other === head && open));
	}));
};
