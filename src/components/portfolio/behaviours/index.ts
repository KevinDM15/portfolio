/* the landing's behaviours, each in its own module, started once against the landing root */
import type { Behaviour, Context } from './context';
import { createToast } from './toast';
import { clock } from './clock';
import { copyEmail } from './copy-email';
import { contactForm } from './contact-form';
import { hud } from './hud';
import { clamp } from './clamp';
import { orbit } from './orbit';
import { reveal } from './reveal';
import { portrait } from './portrait';
import { header } from './header';
import { network } from './network';

const behaviours: Behaviour[] = [clock, copyEmail, contactForm, hud, clamp, orbit, reveal, portrait, header, network];

export function initPortfolio() {
	const root = document.querySelector<HTMLElement>('[data-kd]');
	if (!root || root.dataset.ready) return;
	root.dataset.ready = '1';
	const ctx: Context = {
		root,
		$: (selector) => root.querySelector(selector),
		$$: (selector) => Array.from(root.querySelectorAll(selector)),
		reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
		say: createToast(root.querySelector('[data-k="toast"]')),
	};
	behaviours.forEach((start) => start(ctx));
}
