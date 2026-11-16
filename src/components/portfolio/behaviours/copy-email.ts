/* the copy button puts the address on the clipboard and says so, in the button and in the toast */
import type { Behaviour } from './context';
import { EMAIL } from '../data';

const HINT = 'clic para copiar el correo';
const DONE = 'copiado, ya puedes pegarlo';

export const copyEmail: Behaviour = ({ $, $$, say }) => {
	const hint = $<HTMLElement>('[data-k="mail-hint"]');
	let timer: number | undefined;
	$$<HTMLElement>('[data-copy]').forEach((button) => button.addEventListener('click', () => {
		const done = () => {
			say('Correo copiado');
			button.dataset.done = '1';
			if (hint) hint.textContent = DONE;
			clearTimeout(timer);
			timer = window.setTimeout(() => { delete button.dataset.done; if (hint) hint.textContent = HINT; }, 2400);
		};
		const fallback = () => say(`Copia: ${EMAIL}`);
		try { navigator.clipboard.writeText(EMAIL).then(done, fallback); } catch { fallback(); }
	}));
};
