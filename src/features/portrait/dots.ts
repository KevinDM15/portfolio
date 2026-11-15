/*
 * The dot portrait: the photo sampled into a grid of dots whose size follows the light on the subject.
 * A person matte keeps the background as a faint texture; the dots flee the cursor and settle back.
 */
type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; h: number; g: number };

export type DotPortraitOptions = {
	canvas: HTMLCanvasElement;
	src: string;
	/** person matte, white = subject */
	mask?: string;
	/** dot colour and the two colours dots flash while pushed */
	ink: string;
	hot: [string, string];
	reduce: boolean;
};

export function createDotPortrait({ canvas, src, mask, ink, hot, reduce }: DotPortraitOptions) {
	let P: Dot[] = [], W = 0, H = 0, ctx: CanvasRenderingContext2D | null = null;
	let settle = 0, steps = 1, last = 0, ready = false, alive = true;
	const mouse = { x: -999, y: -999 };
	const img = new Image(), maskImg = new Image();
	let maskOk = false;

	function build(scatter: boolean) {
		const w = canvas.clientWidth, h = canvas.clientHeight;
		if (!w || !ready) return;
		W = w; H = h;
		const d = Math.min(devicePixelRatio || 1, 2);
		canvas.width = W * d; canvas.height = H * d;
		ctx = canvas.getContext('2d')!;
		ctx.setTransform(d, 0, 0, d, 0, 0);
		const n = Math.round(W / 6.5), s = W / n, rows = Math.ceil(H / s);
		const off = document.createElement('canvas');
		off.width = n; off.height = rows;
		const o = off.getContext('2d', { willReadFrequently: true })!;
		o.imageSmoothingQuality = 'high';
		// crop to the bust, top aligned, keeping the canvas ratio; the matte gets the same crop
		const iw = img.naturalWidth, ih = img.naturalHeight;
		const cw = Math.min(iw, ih) * 0.8, ch = cw * (rows / n);
		o.drawImage(img, (iw - cw) / 2, 0, cw, Math.min(ch, ih), 0, 0, n, rows);
		const px = o.getImageData(0, 0, n, rows).data;
		const M = new Float32Array(n * rows).fill(1);
		if (maskOk) {
			o.clearRect(0, 0, n, rows);
			const mw = maskImg.naturalWidth, mh = maskImg.naturalHeight, mc = Math.min(mw, mh) * 0.8;
			o.drawImage(maskImg, (mw - mc) / 2, 0, mc, Math.min(mc * (rows / n), mh), 0, 0, n, rows);
			const mp = o.getImageData(0, 0, n, rows).data;
			for (let i = 0; i < n * rows; i++) M[i] = mp[i * 4] / 255;
		}
		// luminance with auto levels from the subject only, plus a light unsharp mask for eyes, mouth and beard
		const L = new Float32Array(n * rows), inside: number[] = [];
		for (let i = 0; i < n * rows; i++) {
			L[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
			if (M[i] > 0.5) inside.push(L[i]);
		}
		inside.sort((p, q) => p - q);
		const lo = inside[Math.floor(inside.length * 0.03)] ?? 0, hi = inside[Math.floor(inside.length * 0.97)] ?? 1, span = Math.max(0.05, hi - lo);
		const at = (x: number, y: number) => L[Math.max(0, Math.min(rows - 1, y)) * n + Math.max(0, Math.min(n - 1, x))];
		const inM = (x: number, y: number) => x >= 0 && y >= 0 && x < n && y < rows && M[y * n + x] >= 0.5;
		const dots: Dot[] = [];
		for (let y = 0; y < rows; y++)
			for (let x = 0; x < n; x++) {
				let l = 0.1; // outside the subject: a faint texture of small dots
				if (M[y * n + x] >= 0.5) {
					let blur = 0;
					for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) blur += at(x + i, y + j);
					const c = L[y * n + x];
					const v = Math.max(0, Math.min(1, (c + 0.9 * (c - blur / 9) - lo) / span));
					l = 0.14 + 0.86 * Math.pow(v, 0.9); // light dots on the dark plate: bright skin reads big
				} else if (maskOk && (inM(x - 1, y) || inM(x + 1, y) || inM(x, y - 1) || inM(x, y + 1))) {
					continue; // one empty cell around the silhouette
				}
				const hx = (x + 0.5) * s, hy = (y + 0.5) * s;
				dots.push({ hx, hy, x: scatter ? W / 2 + (Math.random() - 0.5) * W * 1.6 : hx, y: scatter ? H / 2 + (Math.random() - 0.5) * H * 1.6 : hy, vx: 0, vy: 0, r: l * s * 0.56, h: 0, g: Math.floor(Math.random() * 2) });
			}
		P = dots;
		settle = scatter ? 240 : 30;
		draw();
	}

	function active() {
		const near = mouse.x > -200 && mouse.x < W + 200 && mouse.y > -200 && mouse.y < H + 200;
		if (near) settle = 60; else if (settle > 0) settle--;
		return near || settle > 0;
	}

	function draw() {
		if (!ctx) return;
		const R = 90, cold: Dot[] = [], hot0: Dot[] = [], hot1: Dot[] = [];
		for (const p of P) {
			if (!reduce)
				for (let k = 0; k < steps; k++) {
					const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
					if (d2 < R * R) { const dd = Math.sqrt(d2) || 1, f = (1 - dd / R) * 5.5; p.vx += (dx / dd) * f; p.vy += (dy / dd) * f; p.h = 1; }
					p.vx += (p.hx - p.x) * 0.055; p.vy += (p.hy - p.y) * 0.055;
					p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy; p.h *= 0.965;
				}
			(p.h > 0.12 ? (p.g ? hot1 : hot0) : cold).push(p);
		}
		ctx.clearRect(0, 0, W, H);
		const paint = (arr: Dot[], c: string) => {
			ctx!.fillStyle = c; ctx!.beginPath();
			for (const p of arr) { ctx!.moveTo(p.x + p.r, p.y); ctx!.arc(p.x, p.y, p.r, 0, 6.2832); }
			ctx!.fill();
		};
		paint(cold, ink); paint(hot0, hot[0]); paint(hot1, hot[1]);
	}

	function loop() {
		if (!alive) return;
		const now = performance.now();
		steps = Math.max(1, Math.min(40, Math.round((now - (last || now)) / 16.7)));
		last = now;
		const r = canvas.getBoundingClientRect();
		const vis = r.bottom > 0 && r.top < innerHeight && r.width > 0;
		if (vis && ready && !reduce && active()) draw();
		requestAnimationFrame(loop);
	}

	const onMove = (e: PointerEvent) => {
		const r = canvas.getBoundingClientRect(), k = canvas.clientWidth / (r.width || 1);
		mouse.x = (e.clientX - r.left) * k; mouse.y = (e.clientY - r.top) * k;
	};
	const onLeave = () => { mouse.x = mouse.y = -999; };
	addEventListener('pointermove', onMove);
	document.addEventListener('pointerleave', onLeave);
	let pending = mask ? 2 : 1;
	const loaded = () => { if (--pending > 0) return; ready = true; build(!reduce); requestAnimationFrame(loop); };
	img.onload = loaded;
	if (mask) { maskImg.onload = () => { maskOk = true; loaded(); }; maskImg.onerror = loaded; maskImg.src = mask; }
	img.src = src;
	let lastW = 0;
	const ro = new ResizeObserver(() => { const w = canvas.clientWidth; if (ready && Math.abs(w - lastW) > 1) { lastW = w; build(false); } });
	ro.observe(canvas);

	return {
		destroy() { alive = false; ro.disconnect(); removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); },
	};
}
