/* the HUD on the portrait shows the viewport the page is being read in */
import type { Behaviour } from './context';

export const hud: Behaviour = ({ $ }) => {
	const readout = $<HTMLElement>('[data-k="vp"]');
	if (!readout) return;
	const update = () => { readout.textContent = `${innerWidth}×${innerHeight}`; };
	update();
	addEventListener('resize', update, { passive: true });
};
