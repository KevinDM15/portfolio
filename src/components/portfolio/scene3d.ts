import * as THREE from 'three';

/*
 * One particle scene for the whole page. A fixed full-viewport canvas holds the dots of the
 * portrait; as the page scrolls they travel to the section in view and take its shape:
 * the face in the hero, the "YO" diagram in Sobre mí, the timeline bars in Experiencia and a
 * ring around the copy button in Contacto. Between anchors they drift in a slow flow field.
 * All coordinates are viewport CSS pixels (y down), read from the DOM rects every frame.
 */

export type SceneColors = { ink: string; hot: [string, string] };

type Anchors = {
	face: HTMLElement; // the hero portrait box
	diagram: HTMLElement; // the square box that holds the agent diagram
	bars: HTMLElement[]; // the timeline bars, in order
	button: HTMLElement; // the round "copiar correo" button
};

type Slot = { x: number; y: number; r: number; accent: number };

const VERT = /* glsl */ `
	attribute float aSize;
	attribute float aHot;
	attribute float aGroup;
	attribute float aAccent;
	uniform float uDpr;
	uniform vec3 uInk;
	uniform vec3 uHot0;
	uniform vec3 uHot1;
	uniform vec3 uTint;
	varying vec3 vColor;
	void main() {
		vec3 hot = aGroup < 0.5 ? uHot0 : uHot1;
		vec3 base = mix(uInk, uTint, aAccent);
		vColor = mix(base, hot, aHot);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = max(1.0, aSize * 2.0 * uDpr);
	}
`;

const FRAG = /* glsl */ `
	precision mediump float;
	varying vec3 vColor;
	void main() {
		float d = length(gl_PointCoord - 0.5);
		if (d > 0.5) discard;
		gl_FragColor = vec4(vColor, smoothstep(0.5, 0.38, d));
	}
`;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// the timeline bars animate with scaleX, so read their layout box instead of the transformed one
function layoutRect(el: HTMLElement) {
	const pr = (el.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? { left: 0, top: 0 };
	return { left: pr.left + el.offsetLeft, top: pr.top + el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
}
const smooth = (v: number) => { const x = clamp01(v); return x * x * (3 - 2 * x); };

export function createScene3D(canvas: HTMLCanvasElement, img: HTMLImageElement, anchors: Anchors, reduce: boolean) {
	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
	} catch {
		return null;
	}
	const dpr = Math.min(devicePixelRatio || 1, 2);
	renderer.setPixelRatio(dpr);
	renderer.setClearColor(0x000000, 0);
	const scene = new THREE.Scene();
	// y grows downward, like the DOM
	const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
	camera.position.z = 5;
	const material = new THREE.ShaderMaterial({
		vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
		uniforms: {
			uDpr: { value: dpr },
			uInk: { value: new THREE.Color('#0F0F11') },
			uHot0: { value: new THREE.Color('#D4470E') },
			uHot1: { value: new THREE.Color('#2F9E68') },
			uTint: { value: new THREE.Color('#D4470E') },
		},
	});
	let points: THREE.Points | null = null;

	let VW = 0, VH = 0, N = 0;
	let pos: Float32Array, vel: Float32Array, size: Float32Array, hot: Float32Array, accent: Float32Array, delay: Float32Array;
	// face samples relative to the portrait box (0..1 of its size) and the other shapes in unit space
	let face: Slot[] = [], diagram: Slot[] = [], bars: Slot[][] = [], ring: Slot[] = [];
	let dark = false;
	const mouse = { x: -9999, y: -9999 };
	let burstAt: { x: number; y: number; t: number } | null = null;
	let t0 = performance.now();
	let dirty = true;

	function sampleFace(boxW: number, boxH: number, darkTheme: boolean): Slot[] {
		const n = Math.round(boxW / 9), s = 1 / n;
		const off = document.createElement('canvas');
		off.width = off.height = n;
		const o = off.getContext('2d')!;
		o.drawImage(img, 0, 0, n, n);
		const px = o.getImageData(0, 0, n, n).data, inv = !darkTheme, out: Slot[] = [];
		const dot = boxW / n;
		for (let y = 0; y < n; y++)
			for (let x = 0; x < n; x++) {
				const i = (y * n + x) * 4;
				let l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
				if (inv) {
					l = 1 - l;
					l = Math.pow(clamp01((l - 0.14) / 0.66), 1.1);
				} else {
					const vx = x / n - 0.5, vy = y / n - 0.5, fade = 1 - Math.min(1, Math.pow(Math.hypot(vx, vy) * 1.55, 3)) * 0.85;
					l = Math.pow(clamp01((l - 0.06) / 0.46), 0.62) * fade;
				}
				if (l < 0.08) continue;
				out.push({ x: (x + 0.5) * s, y: (y + 0.5) * s, r: l * dot * (inv ? 0.56 : 0.58), accent: 0 });
			}
		return out;
	}

	function shuffle<T>(a: T[]) {
		for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
		return a;
	}

	// the agent diagram in unit space of its square box (center .5,.5); radii follow the SVG (viewBox 480 wide)
	function makeDiagram(count: number): Slot[] {
		const k = 0.92 / 480, rOut = 160 * k, rIn = 100 * k, rDisc = 56 * k, sq = 7 * k;
		const out: Slot[] = [];
		const nDisc = Math.round(count * 0.34), nOut = Math.round(count * 0.22), nIn = Math.round(count * 0.16), nSp = Math.round(count * 0.14), nSq = count - nDisc - nOut - nIn - nSp;
		const axes = [[0, -1], [1, 0], [0, 1], [-1, 0]];
		for (let i = 0; i < nDisc; i++) { const a = Math.random() * 6.2832, rr = Math.sqrt(Math.random()) * rDisc; out.push({ x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr, r: 2.1, accent: 1 }); }
		for (let i = 0; i < nOut; i++) { const seg = Math.floor(Math.random() * 24) * 2, a = ((seg + Math.random()) / 48) * 6.2832; out.push({ x: 0.5 + Math.cos(a) * rOut, y: 0.5 + Math.sin(a) * rOut, r: 1.6, accent: 0 }); }
		for (let i = 0; i < nIn; i++) { const a = Math.random() * 6.2832; out.push({ x: 0.5 + Math.cos(a) * rIn, y: 0.5 + Math.sin(a) * rIn, r: 1.8, accent: 0 }); }
		for (let i = 0; i < nSp; i++) { const [cx, cy] = axes[i % 4], t = rDisc + Math.random() * (rOut - rDisc); out.push({ x: 0.5 + cx * t, y: 0.5 + cy * t, r: 1.6, accent: 0 }); }
		for (let i = 0; i < nSq; i++) { const [cx, cy] = axes[i % 4]; out.push({ x: 0.5 + cx * rOut + (Math.random() - 0.5) * sq * 2, y: 0.5 + cy * rOut + (Math.random() - 0.5) * sq * 2, r: 1.5, accent: 0 }); }
		return shuffle(out);
	}

	// timeline: each bar gets dots in proportion to its width; unit space per bar (0..1 inside the bar rect)
	function makeBars(count: number, widths: number[]): Slot[][] {
		const total = widths.reduce((a, b) => a + b, 0) || 1;
		// exactly `count` slots in total, at least 40 per bar so short jobs still read as a bar
		const per = widths.map((w) => Math.max(40, Math.floor((count * w) / total)));
		let extra = count - per.reduce((a, b) => a + b, 0);
		for (let k = per.length - 1; extra !== 0 && k >= 0; k--) { const d = extra > 0 ? extra : Math.max(-(per[k] - 40), extra); per[k] += d; extra -= d; }
		const out: Slot[][] = per.map((n, b) => {
			const s: Slot[] = [];
			for (let i = 0; i < n; i++) s.push({ x: Math.random(), y: 0.15 + Math.random() * 0.7, r: 1.7, accent: b < 2 ? 1 : 0 });
			return s;
		});
		return out;
	}

	// a ring of dots around the copy button, in units of the button box (0..1), a little outside its edge
	function makeRing(count: number): Slot[] {
		const out: Slot[] = [];
		for (let i = 0; i < count; i++) { const a = Math.random() * 6.2832, rr = 0.56 + Math.random() * 0.07; out.push({ x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr, r: 1.7, accent: 1 }); }
		return shuffle(out);
	}

	function build() {
		VW = innerWidth; VH = innerHeight;
		renderer.setSize(VW, VH, false);
		camera.left = 0; camera.right = VW; camera.top = 0; camera.bottom = VH;
		camera.updateProjectionMatrix();
		const fb = anchors.face.getBoundingClientRect();
		face = sampleFace(fb.width, fb.height, dark);
		N = face.length;
		diagram = makeDiagram(N);
		bars = makeBars(N, anchors.bars.map((b) => b.offsetWidth));
		ring = makeRing(N);
		const keep = points && pos && pos.length === N * 3;
		if (!keep) {
			pos = new Float32Array(N * 3); vel = new Float32Array(N * 3); hot = new Float32Array(N); accent = new Float32Array(N); delay = new Float32Array(N);
			size = new Float32Array(N);
			const group = new Float32Array(N);
			for (let i = 0; i < N; i++) {
				pos[i * 3] = fb.left + face[i].x * fb.width + (Math.random() - 0.5) * VW * 0.8;
				pos[i * 3 + 1] = fb.top + face[i].y * fb.height + (Math.random() - 0.5) * VH * 0.8;
				size[i] = face[i].r; group[i] = Math.random() < 0.5 ? 0 : 1; delay[i] = Math.random();
			}
			const geo = new THREE.BufferGeometry();
			geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
			geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
			geo.setAttribute('aHot', new THREE.BufferAttribute(hot, 1));
			geo.setAttribute('aGroup', new THREE.BufferAttribute(group, 1));
			geo.setAttribute('aAccent', new THREE.BufferAttribute(accent, 1));
			if (points) { scene.remove(points); points.geometry.dispose(); }
			points = new THREE.Points(geo, material);
			points.frustumCulled = false;
			scene.add(points);
		}
		dirty = true;
	}

	// how much an anchor pulls, from its position relative to the viewport center
	// full pull while the anchor sits in the middle band of the screen, fading out toward the edges
	function weight(r: { top: number; height: number }, span = 0.62) {
		const cy = r.top + r.height / 2;
		const d = Math.abs(cy - VH / 2) / VH;
		return smooth(1 - clamp01((d - 0.12) / (span - 0.12)));
	}

	function step(steps: number, now: number) {
		if (!points) return;
		const t = (now - t0) / 1000;
		const fb = anchors.face.getBoundingClientRect(), db = anchors.diagram.getBoundingClientRect(), bb = anchors.button.getBoundingClientRect();
		const barRects = anchors.bars.map(layoutRect);
		const barsBox = barRects.reduce((acc, r) => ({ top: Math.min(acc.top, r.top), bottom: Math.max(acc.bottom, r.top + r.height) }), { top: Infinity, bottom: -Infinity });
		const wFace = weight(fb, 0.75), wDia = weight(db), wBars = weight({ top: barsBox.top, height: barsBox.bottom - barsBox.top }, 0.7), wRing = weight(bb, 0.6);
		// the face only lets go once you have really left the hero
		// as long as some anchor leads, the shape stays crisp; the drift only takes over between sections
		const sumRaw = wFace + wDia + wBars + wRing;
		const free = clamp01(1 - sumRaw / 0.6);
		const norm = sumRaw > 1e-4 ? (1 - free) / sumRaw : 0;
		const wf = wFace * norm, wd = wDia * norm, wb = wBars * norm, wr = wRing * norm;
		// section tint: green while the diagram leads, terracotta otherwise
		material.uniforms.uTint.value.copy(wd > Math.max(wf, wb, wr) ? material.uniforms.uHot1.value : material.uniforms.uHot0.value);
		const R = 90;
		let bi = 0, bCount = bars.map((b) => b.length), bOff = bCount.map((_, k) => bCount.slice(0, k).reduce((a, c) => a + c, 0));
		for (let i = 0; i < N; i++) {
			// per-dot stagger on each pull so shapes ripple in
			const st = (w: number) => smooth((w - delay[i] * 0.3) / 0.7);
			const sf = st(wf), sd = st(wd), sb = st(wb), sr = st(wr);
			const sumS = sf + sd + sb + sr;
			const f = face[i], d = diagram[i];
			// pick this dot's bar slot by index ranges
			while (bi < bCount.length - 1 && i >= bOff[bi + 1]) bi++;
			const bSlot = bars[bi][Math.min(i - bOff[bi], bars[bi].length - 1)];
			const br = barRects[bi];
			const g = ring[i];
			let tx = 0, ty = 0, ts = 0, ta = 0;
			tx += sf * (fb.left + f.x * fb.width); ty += sf * (fb.top + f.y * fb.height); ts += sf * f.r;
			tx += sd * (db.left + d.x * db.width); ty += sd * (db.top + d.y * db.height); ts += sd * d.r; ta += sd * d.accent;
			tx += sb * (br.left + bSlot.x * br.width); ty += sb * (br.top + bSlot.y * br.height); ts += sb * bSlot.r; ta += sb * bSlot.accent;
			tx += sr * (bb.left + (g.x - 0.5) * bb.width * 2 + bb.width / 2); ty += sr * (bb.top + (g.y - 0.5) * bb.height * 2 + bb.height / 2); ts += sr * g.r; ta += sr * g.accent;
			const x0 = pos[i * 3], y0 = pos[i * 3 + 1];
			const rest = Math.max(0, 1 - sumS);
			if (rest > 0) {
				// slow flow field for the travelling dots, with a soft pull toward the middle of the screen
				const fx = Math.sin(y0 * 0.004 + t * 0.35 + delay[i] * 6.28) * 60 + (VW / 2 - x0) * 0.02;
				const fy = Math.cos(x0 * 0.004 + t * 0.3) * 60 + (VH / 2 - y0) * 0.02;
				tx += rest * (x0 + fx); ty += rest * (y0 + fy); ts += rest * 2.0;
			}
			if (sumS > 1) { tx /= sumS; ty /= sumS; ts /= sumS; ta /= sumS; }
			size[i] = ts; accent[i] = Math.min(1, ta);
			if (reduce) { pos[i * 3] = tx; pos[i * 3 + 1] = ty; continue; }
			let x = x0, y = y0, vx = vel[i * 3], vy = vel[i * 3 + 1], h = hot[i];
			for (let s = 0; s < steps; s++) {
				const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
				if (d2 < R * R) { const dd = Math.sqrt(d2) || 1, fo = (1 - dd / R) * 5.5; vx += (dx / dd) * fo; vy += (dy / dd) * fo; h = 1; }
				if (burstAt) {
					const bx = x - burstAt.x, by = y - burstAt.y, b2 = bx * bx + by * by;
					if (b2 < 220 * 220) { const dd = Math.sqrt(b2) || 1, fo = (1 - dd / 220) * 14; vx += (bx / dd) * fo; vy += (by / dd) * fo; h = 1; }
				}
				const k = rest > 0.5 ? 0.02 : 0.055;
				vx += (tx - x) * k; vy += (ty - y) * k;
				vx *= 0.82; vy *= 0.82; x += vx; y += vy; h *= 0.965;
			}
			if (x !== x || y !== y) { x = tx; y = ty; vx = vy = 0; }
			pos[i * 3] = x; pos[i * 3 + 1] = y; vel[i * 3] = vx; vel[i * 3 + 1] = vy; hot[i] = h;
		}
		if (burstAt && now - burstAt.t > 120) burstAt = null;
		const geo = points.geometry;
		geo.attributes.position.needsUpdate = true;
		geo.attributes.aSize.needsUpdate = true;
		geo.attributes.aHot.needsUpdate = true;
		geo.attributes.aAccent.needsUpdate = true;
	}

	return {
		build,
		setTheme(isDark: boolean) { dark = isDark; },
		setColors(c: SceneColors) {
			material.uniforms.uInk.value.set(c.ink);
			material.uniforms.uHot0.value.set(c.hot[0]);
			material.uniforms.uHot1.value.set(c.hot[1]);
			dirty = true;
		},
		setMouse(x: number, y: number) { mouse.x = x; mouse.y = y; },
		clearMouse() { mouse.x = mouse.y = -9999; },
		burst(x: number, y: number) { burstAt = { x, y, t: performance.now() }; },
		frame(steps: number, now: number) {
			if (!points) return;
			step(steps, now);
			renderer.render(scene, camera);
			dirty = false;
		},
		stats() {
			let inside = 0, nan = 0;
			for (let i = 0; i < N; i++) { const x = pos[i * 3], y = pos[i * 3 + 1]; if (x !== x || y !== y) nan++; else if (x >= 0 && x <= VW && y >= 0 && y <= VH) inside++; }
			const bad = (arr: Slot[]) => arr.filter((s) => !s || s.x !== s.x || s.y !== s.y || s.r !== s.r).length;
			return { N, inside, nan, VW, VH, faceBad: bad(face), diaBad: bad(diagram), ringBad: bad(ring), barsLen: bars.map((b) => b.length), barsBad: bars.map(bad), sizeNaN: Array.from(size).filter((v) => v !== v).length, sample: [pos[0], pos[1], size[0], hot[0], accent[0]] };
		},
		dispose() { renderer.dispose(); points?.geometry.dispose(); material.dispose(); },
	};
}
