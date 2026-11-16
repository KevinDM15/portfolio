/* the contact form opens the visitor's mail app with the message already written */
import type { Behaviour } from './context';
import { EMAIL } from '../data';

export const contactForm: Behaviour = ({ $, say }) => {
	const form = $<HTMLFormElement>('[data-k="form"]');
	form?.addEventListener('submit', (event) => {
		event.preventDefault();
		if (!form.reportValidity()) return;
		const data = new FormData(form);
		const subject = `Idea de ${data.get('nombre')}`;
		const body = `${data.get('mensaje')}\n\n${data.get('nombre')} · ${data.get('correo')}`;
		location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		say('Abriendo tu correo');
	});
};
