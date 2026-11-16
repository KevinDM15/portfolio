/* Barranquilla time: every [data-time] shows hh:mm and the analogue hands turn */
import type { Behaviour } from './context';

export const clock: Behaviour = ({ $, $$ }) => {
	const labels = $$<HTMLElement>('[data-time]');
	const hours = $<SVGLineElement>('[data-k="hh"]'), minutes = $<SVGLineElement>('[data-k="mm"]'), seconds = $<SVGGElement>('[data-k="sec"]');
	const format = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

	function tick() {
		const parts = format.formatToParts(new Date());
		const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
		const h = part('hour') % 24, m = part('minute'), s = part('second');
		const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
		labels.forEach((el) => { if (el.textContent !== label) el.textContent = label; });
		hours?.setAttribute('transform', `rotate(${(h % 12) * 30 + m * 0.5} 50 50)`);
		minutes?.setAttribute('transform', `rotate(${m * 6 + s * 0.1} 50 50)`);
		seconds?.setAttribute('transform', `rotate(${s * 6} 50 50)`);
	}
	tick();
	setInterval(tick, 1000);
};
