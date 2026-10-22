import * as THREE from 'three';

/*
 * Dot portrait rendered with Three.js points.
 * Same sampling as the 2D version, plus depth from luminance, a cursor tilt and
 * a scroll-driven morph into the "YO" agent-flow diagram used in "Sobre mí".
 * Coordinates stay in CSS pixels (orthographic camera) so the physics match the 2D path.
 */

export type PortraitColors = { ink: string; hot: [string, string] };

type Options = {
	canvas: HTMLCanvasElement;
	img: HTMLImageElement;
	reduce: boolean;
};

const VERT = /* glsl */ `
	attribute float aSize;
	attribute float aHot;
	attribute float aGroup;
	attribute float aDisc;
	uniform float uDpr;
	uniform float uMorph;
	uniform vec3 uInk;
	uniform vec3 uHot0;
	uniform vec3 uHot1;
	varying vec3 vColor;
	void main() {
		vec3 hot = aGroup < 0.5 ? uHot0 : uHot1;
		vec3 base = mix(uInk, uHot1, aDisc * uMorph);
		vColor = mix(base, hot, aHot);
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mv;
		gl_PointSize = max(1.0, aSize * 2.0 * uDpr);
	}
`;

const FRAG = /* glsl */ `
	precision mediump float;
	varying vec3 vColor;
	void main() {
		float d = length(gl_PointCoord - 0.5);
		if (d > 0.5) discard;
		float a = smoothstep(0.5, 0.38, d);
		gl_FragColor = vec4(vColor, a);
	}
`;

const hex = (h: string) => new THREE.Color(h);

export function createPortrait3D({ canvas, img, reduce }: Options) {
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
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
	camera.position.z = 1000;
	const group = new THREE.Group();
	scene.add(group);

	const material = new THREE.ShaderMaterial({
		vertexShader: VERT,
		fragmentShader: FRAG,
		transparent: true,
		depthWrite: false,
		uniforms: {
			uDpr: { value: dpr },
			uMorph: { value: 0 },
			uInk: { value: hex('#0F0F11') },
			uHot0: { value: hex('#D4470E') },
			uHot1: { value: hex('#2F9E68') },
		},
	});
	let points: THREE.Points | null = null;

	// simulation state, in CSS px centered at the canvas middle (y up)
	let W = 0, H = 0, N = 0;
	let pos: Float32Array, home: Float32Array, target: Float32Array, vel: Float32Array;
	let sizeHome: Float32Array, sizeTarget: Float32Array, size: Float32Array, hot: Float32Array, delay: Float32Array;
	const mouse = { x: -9999, y: -9999, tx: 0, ty: 0 };
	let morph = 0, morphShown = -1;
	let dark = false;
	let dirty = true;

	function sample(darkTheme: boolean) {
		const n = Math.round(W / 9), s = W / n;
		const off = document.createElement('canvas');
		off.width = off.height = n;
		const o = off.getContext('2d')!;
		o.drawImage(img, 0, 0, n, n);
		const px = o.getImageData(0, 0, n, n).data, inv = !darkTheme;
		const out: { x: number; y: number; z: number; r: number }[] = [];
		for (let y = 0; y < n; y++)
			for (let x = 0; x < n; x++) {
				const i = (y * n + x) * 4;
				let l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
				if (inv) {
					l = 1 - l;
					l = Math.pow(Math.max(0, Math.min(1, (l - 0.14) / 0.66)), 1.1);
				} else {
					const vx = x / n - 0.5, vy = y / n - 0.5, fade = 1 - Math.min(1, Math.pow(Math.hypot(vx, vy) * 1.55, 3)) * 0.85;
					l = Math.pow(Math.max(0, Math.min(1, (l - 0.06) / 0.46)), 0.62) * fade;
				}
				if (l < 0.08) continue;
				// brighter dots sit closer to the viewer, which gives the tilt its parallax
				out.push({ x: (x + 0.5) * s - W / 2, y: H / 2 - (y + 0.5) * s, z: (l - 0.5) * W * 0.35, r: l * s * (inv ? 0.56 : 0.58) });
			}
		return out;
	}

	// the "YO" diagram: dashed outer ring, inner ring, filled center disc, four spokes and four squares
	function diagramTargets(count: number) {
		const S = Math.min(W, H), k = S / 440;
		const rOut = 160 * k, rIn = 100 * k, rDisc = 56 * k, sq = 7 * k;
		const pts: { x: number; y: number; r: number; disc: number }[] = [];
		const push = (x: number, y: number, r: number, disc = 0) => pts.push({ x, y, r, disc });
		const nDisc = Math.round(count * 0.42), nOut = Math.round(count * 0.2), nIn = Math.round(count * 0.14), nSp = Math.round(count * 0.14);
		const nSq = count - nDisc - nOut - nIn - nSp;
		for (let i = 0; i < nDisc; i++) {
			const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * rDisc;
			push(Math.cos(a) * rr, Math.sin(a) * rr, 2.6 * k + 1, 1);
		}
		for (let i = 0; i < nOut; i++) {
			// 48 segments, half of them drawn = the dashed stroke
			const seg = Math.floor(Math.random() * 24) * 2, a = ((seg + Math.random()) / 48) * Math.PI * 2;
			push(Math.cos(a) * rOut, Math.sin(a) * rOut, 1.6 * k + 1);
		}
		for (let i = 0; i < nIn; i++) {
			const a = Math.random() * Math.PI * 2;
			push(Math.cos(a) * rIn, Math.sin(a) * rIn, 1.8 * k + 1);
		}
		for (let i = 0; i < nSp; i++) {
			const axis = i % 4, t = rDisc + Math.random() * (rOut - rDisc);
			const [cx, cy] = [[0, 1], [1, 0], [0, -1], [-1, 0]][axis];
			push(cx * t, cy * t, 1.6 * k + 1);
		}
		for (let i = 0; i < nSq; i++) {
			const axis = i % 4;
			const [cx, cy] = [[0, 1], [1, 0], [0, -1], [-1, 0]][axis];
			push(cx * rOut + (Math.random() - 0.5) * sq * 2, cy * rOut + (Math.random() - 0.5) * sq * 2, 2.4 * k + 1);
		}
		// shuffle so dots travel from everywhere to everywhere
		for (let i = pts.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pts[i], pts[j]] = [pts[j], pts[i]];
		}
		return pts;
	}

	function build(scatter: boolean) {
		const dots = sample(dark);
		N = dots.length;
		pos = new Float32Array(N * 3); home = new Float32Array(N * 3); target = new Float32Array(N * 3); vel = new Float32Array(N * 3);
		sizeHome = new Float32Array(N); sizeTarget = new Float32Array(N); size = new Float32Array(N); hot = new Float32Array(N); delay = new Float32Array(N);
		const group01 = new Float32Array(N), disc = new Float32Array(N);
		const dia = diagramTargets(N);
		for (let i = 0; i < N; i++) {
			const d = dots[i], t = dia[i];
			home[i * 3] = d.x; home[i * 3 + 1] = d.y; home[i * 3 + 2] = d.z;
			target[i * 3] = t.x; target[i * 3 + 1] = t.y; target[i * 3 + 2] = 0;
			pos[i * 3] = scatter ? (Math.random() - 0.5) * W * 1.6 : d.x;
			pos[i * 3 + 1] = scatter ? (Math.random() - 0.5) * H * 1.6 : d.y;
			pos[i * 3 + 2] = d.z;
			sizeHome[i] = d.r; sizeTarget[i] = t.r; size[i] = d.r;
			group01[i] = Math.random() < 0.5 ? 0 : 1;
			disc[i] = t.disc;
			delay[i] = Math.random();
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		geo.setAttribute('aHot', new THREE.BufferAttribute(hot, 1));
		geo.setAttribute('aGroup', new THREE.BufferAttribute(group01, 1));
		geo.setAttribute('aDisc', new THREE.BufferAttribute(disc, 1));
		if (points) { group.remove(points); points.geometry.dispose(); }
		points = new THREE.Points(geo, material);
		points.frustumCulled = false;
		group.add(points);
		morphShown = -1;
		dirty = true;
	}

	function resize() {
		W = canvas.clientWidth; H = canvas.clientHeight;
		if (!W) return false;
		renderer.setSize(W, H, false);
		camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
		camera.updateProjectionMatrix();
		return true;
	}

	const ease = (x: number) => x * x * (3 - 2 * x);

	function step(steps: number) {
		if (!points) return;
		const R = 90;
		const m = ease(morph);
		for (let i = 0; i < N; i++) {
			// per-dot stagger so the morph ripples instead of snapping
			const md = ease(Math.max(0, Math.min(1, (m - delay[i] * 0.35) / 0.65)));
			const hx = home[i * 3] + (target[i * 3] - home[i * 3]) * md;
			const hy = home[i * 3 + 1] + (target[i * 3 + 1] - home[i * 3 + 1]) * md;
			const hz = home[i * 3 + 2] * (1 - md);
			size[i] = sizeHome[i] + (sizeTarget[i] - sizeHome[i]) * md;
			if (reduce) {
				pos[i * 3] = hx; pos[i * 3 + 1] = hy; pos[i * 3 + 2] = hz;
				continue;
			}
			let x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2], vx = vel[i * 3], vy = vel[i * 3 + 1], vz = vel[i * 3 + 2], h = hot[i];
			for (let s = 0; s < steps; s++) {
				const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
				if (d2 < R * R) {
					const dd = Math.sqrt(d2) || 1, f = (1 - dd / R) * 5.5;
					vx += (dx / dd) * f; vy += (dy / dd) * f; h = 1;
				}
				vx += (hx - x) * 0.055; vy += (hy - y) * 0.055; vz += (hz - z) * 0.055;
				vx *= 0.82; vy *= 0.82; vz *= 0.82; x += vx; y += vy; z += vz; h *= 0.965;
			}
			pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz; hot[i] = h;
		}
		const g = points.geometry;
		g.attributes.position.needsUpdate = true;
		g.attributes.aSize.needsUpdate = true;
		g.attributes.aHot.needsUpdate = true;
		// tilt toward the cursor; the z spread turns it into parallax
		const tx = reduce ? 0 : mouse.tx * 0.14, ty = reduce ? 0 : mouse.ty * 0.14;
		group.rotation.y += (tx - group.rotation.y) * 0.06;
		group.rotation.x += (ty - group.rotation.x) * 0.06;
		material.uniforms.uMorph.value = m;
	}

	return {
		resize,
		build,
		setTheme(isDark: boolean) { dark = isDark; },
		setColors(c: PortraitColors) {
			material.uniforms.uInk.value = hex(c.ink);
			material.uniforms.uHot0.value = hex(c.hot[0]);
			material.uniforms.uHot1.value = hex(c.hot[1]);
			dirty = true;
		},
		setMouse(cssX: number, cssY: number) {
			mouse.x = cssX - W / 2; mouse.y = H / 2 - cssY;
			mouse.tx = Math.max(-1, Math.min(1, mouse.x / (W / 2)));
			mouse.ty = Math.max(-1, Math.min(1, -mouse.y / (H / 2)));
		},
		clearMouse() { mouse.x = mouse.y = -9999; mouse.tx = mouse.ty = 0; },
		setMorph(v: number) { morph = Math.max(0, Math.min(1, v)); },
		// returns true when a frame was drawn
		frame(steps: number) {
			if (!points) return false;
			if (reduce && !dirty && morph === morphShown) return false;
			step(steps);
			renderer.render(scene, camera);
			morphShown = morph; dirty = false;
			return true;
		},
		dispose() { renderer.dispose(); points?.geometry.dispose(); material.dispose(); },
	};
}
