/* the dot portrait inside the hero plate, loaded on demand, and the plate tilting toward the cursor */
import type { Behaviour } from './context';
import { token } from './context';

export const portrait: Behaviour = ({ root, $, reduceMotion }) => {
	const canvas = $<HTMLCanvasElement>('[data-k="cv"]');
	if (canvas) {
		import('../../../features/portrait/dots')
			.then((m) => m.createDotPortrait({
				canvas, src: '/img/retrato.jpg', mask: '/img/retrato-mascara.png',
				ink: token('--fg') || '#EEF2FF', hot: [token('--cyan') || '#5AD3F3', token('--amber') || '#F5B544'], reduce: reduceMotion,
			}))
			.catch(() => {});
	}

	const plate = $<HTMLElement>('[data-tilt]');
	if (!plate || reduceMotion || !matchMedia('(hover: hover)').matches) return;
	root.addEventListener('pointermove', (e) => {
		const r = plate.getBoundingClientRect();
		const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
		const near = Math.abs(dx) < 1.4 && Math.abs(dy) < 1.4;
		plate.style.transform = near ? `perspective(1200px) rotateY(${(-10 + dx * 10).toFixed(2)}deg) rotateX(${(2 - dy * 10).toFixed(2)}deg)` : '';
	});
	document.addEventListener('pointerleave', () => { plate.style.transform = ''; });
};
