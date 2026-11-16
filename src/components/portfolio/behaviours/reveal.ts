/* plates settle flat when they come into view, once */
import type { Behaviour } from './context';

export const reveal: Behaviour = ({ $$ }) => {
	const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		(entry.target as HTMLElement).dataset.in = '1';
		observer.unobserve(entry.target);
	}), { rootMargin: '0px 0px -14% 0px' });
	$$<HTMLElement>('[data-reveal]').forEach((el) => observer.observe(el));
};
