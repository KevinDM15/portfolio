import * as THREE from 'three';

/*
 * Full-page light pass behind the content: slow noise "clouds" plus a diagonal sweep,
 * tinted with the accent of the section in view. Transparent canvas, half resolution.
 * Light theme = warm light and soft shadows on the paper; dark theme = a faint glow.
 */

const VERT = /* glsl */ `
	void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
	precision mediump float;
	uniform vec2 uRes;
	uniform float uTime;
	uniform vec3 uTint;
	uniform float uDark;
	uniform float uStrength;

	float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
	float noise(vec2 p) {
		vec2 i = floor(p), f = fract(p);
		f = f * f * (3.0 - 2.0 * f);
		return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
	}
	float fbm(vec2 p) {
		float v = 0.0, a = 0.5;
		for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
		return v;
	}

	void main() {
		vec2 uv = gl_FragCoord.xy / uRes;
		vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
		float t = uTime;
		// drifting soft patches, like light through a window
		float n = fbm(p * 1.3 + vec2(t * 0.018, -t * 0.011));
		// a wide diagonal band that crosses the page roughly every 50 seconds
		float d = uv.x * 0.65 + uv.y * 0.35;
		float band = 1.0 - smoothstep(0.0, 0.42, abs(fract(t * 0.02) * 1.8 - 0.4 - d));
		float light = smoothstep(0.38, 0.92, n * 0.65 + band * 0.45);
		float shade = (1.0 - uDark) * smoothstep(0.52, 0.22, n) * 0.5;
		vec3 lightCol = mix(vec3(1.0), uTint, mix(0.45, 0.85, uDark));
		vec3 shadeCol = uTint * 0.35;
		vec3 col = lightCol * light + shadeCol * shade;
		float a = (light + shade) * uStrength;
		gl_FragColor = vec4(col, a);
	}
`;

export function createBackground3D(canvas: HTMLCanvasElement, reduce: boolean) {
	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
	} catch {
		return null;
	}
	renderer.setPixelRatio(0.5);
	renderer.setClearColor(0x000000, 0);
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	const material = new THREE.ShaderMaterial({
		vertexShader: VERT,
		fragmentShader: FRAG,
		transparent: true,
		depthWrite: false,
		depthTest: false,
		uniforms: {
			uRes: { value: new THREE.Vector2(1, 1) },
			uTime: { value: 0 },
			uTint: { value: new THREE.Color('#D4470E') },
			uDark: { value: 0 },
			uStrength: { value: 0.1 },
		},
	});
	scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

	const tintFrom = new THREE.Color('#D4470E'), tintTo = new THREE.Color('#D4470E');
	let tintMix = 1, dirty = true;
	const t0 = performance.now();

	function resize() {
		const w = canvas.clientWidth, h = canvas.clientHeight;
		if (!w || !h) return;
		renderer.setSize(w, h, false);
		material.uniforms.uRes.value.set(canvas.width, canvas.height);
		dirty = true;
	}

	return {
		resize,
		setTheme(dark: boolean) {
			material.uniforms.uDark.value = dark ? 1 : 0;
			material.uniforms.uStrength.value = dark ? 0.085 : 0.11;
			dirty = true;
		},
		setAccent(hexColor: string) {
			tintFrom.copy(material.uniforms.uTint.value);
			tintTo.set(hexColor);
			tintMix = 0;
		},
		frame(now: number) {
			if (tintMix < 1) {
				tintMix = Math.min(1, tintMix + 0.025);
				material.uniforms.uTint.value.copy(tintFrom).lerp(tintTo, tintMix);
				dirty = true;
			}
			if (reduce) {
				if (!dirty) return;
				material.uniforms.uTime.value = 8;
			} else {
				material.uniforms.uTime.value = (now - t0) / 1000;
			}
			renderer.render(scene, camera);
			dirty = false;
		},
		dispose() { renderer.dispose(); material.dispose(); },
	};
}
