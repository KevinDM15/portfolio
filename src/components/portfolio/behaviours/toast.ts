/* one toast for the whole page: show a line, hide it after a moment */

export function createToast(el: HTMLElement | null) {
	let timer: number | undefined;
	return (text: string) => {
		if (!el) return;
		el.textContent = text;
		el.classList.add('on');
		clearTimeout(timer);
		timer = window.setTimeout(() => el.classList.remove('on'), 1800);
	};
}
