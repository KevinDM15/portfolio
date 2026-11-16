/* what every behaviour receives: the landing root, scoped query helpers, the motion preference and the toast */

export type Context = {
	root: HTMLElement;
	$: <T extends Element>(selector: string) => T | null;
	$$: <T extends Element>(selector: string) => T[];
	reduceMotion: boolean;
	say: (text: string) => void;
};

export type Behaviour = (ctx: Context) => void;

/** a CSS colour token from :root, so behaviours follow the palette */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
