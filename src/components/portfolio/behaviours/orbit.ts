/* the orbit diagram animates with native SVG motion; it stands still for people who asked for less motion */
import type { Behaviour } from './context';

export const orbit: Behaviour = ({ $, reduceMotion }) => {
	const svg = $<SVGSVGElement>('[data-k="orbit"]');
	if (svg && reduceMotion) svg.pauseAnimations();
};
