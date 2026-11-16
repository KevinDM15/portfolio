/*
 * The living map behind the page, loaded on demand: the star travels through the section waypoints, the bar shows
 * the traceroute readout, and a spotlight switches on behind the section the star is reading from.
 */
import type { Behaviour } from './context';
import { SECTIONS } from '../data';

const LABELS: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.node, s.label.toLowerCase()]));
const TARGETS: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.node, s.target]));

export const network: Behaviour = ({ $, $$, reduceMotion }) => {
	const canvas = $<HTMLCanvasElement>('[data-k="net"]');
	const trace = $<HTMLElement>('[data-k="trace"]');
	const waypoints = $$<HTMLElement>('[data-node]');
	if (!canvas || waypoints.length < 2) return;

	import('../../../features/network/scene').then((m) => m.createNetwork({
		canvas,
		reduce: reduceMotion,
		nodes: waypoints.map((el) => ({ id: el.dataset.node!, label: LABELS[el.dataset.node!] ?? el.dataset.node!, el })),
		onStatus: ({ hops, ms, text }) => {
			if (!trace) return;
			const count = Object.assign(document.createElement('b'), { textContent: `${hops} ${hops === 1 ? 'salto' : 'saltos'} · ${ms} ms` });
			trace.replaceChildren(count, ` ${text}`);
		},
		onActive: (id) => {
			$$<HTMLElement>('[data-foco]').forEach((el) => delete el.dataset.foco);
			const section = TARGETS[id] && $<HTMLElement>(TARGETS[id]);
			if (section) section.dataset.foco = '1';
		},
	})).catch(() => {});
};
