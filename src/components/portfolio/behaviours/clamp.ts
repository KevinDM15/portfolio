/* job descriptions read as two lines; "ver más" unfolds them, and the button hides when the text already fits */
import type { Behaviour } from './context';

export const clamp: Behaviour = ({ $$ }) => {
	$$<HTMLElement>('[data-k="clamp"]').forEach((box) => {
		const text = box.querySelector('p'), more = box.querySelector<HTMLButtonElement>('[data-more]');
		if (!text || !more) return;
		const fits = () => {
			if (box.dataset.open) return;
			if (text.scrollHeight <= text.clientHeight + 2) box.dataset.fits = '1'; else delete box.dataset.fits;
		};
		fits();
		addEventListener('resize', fits, { passive: true });
		more.addEventListener('click', () => {
			const open = !box.dataset.open;
			if (open) box.dataset.open = '1'; else delete box.dataset.open;
			more.textContent = open ? 'ver menos' : 'ver más';
			more.setAttribute('aria-expanded', String(open));
		});
	});
};
