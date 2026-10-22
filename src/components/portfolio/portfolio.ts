type ThemeName = 'dark' | 'light';
type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; h: number; g: number };

const EMAIL = 'kevindiazm.14@gmail.com';
const SKEW = 'skewY(-6deg) rotate(-1.5deg) ';
const LINE = '1px solid var(--line)';

const PALETTE = {
	dark: { bg: '#0F0F11', surface: '#18181B', fg: '#EFEEE9', muted: '#9C9CA4', accent: '#F2602B', c2: '#F2B134', c3: '#5DD39E', on2: '#0F0F11', on3: '#0F0F11' },
	light: { bg: '#EFEEE9', surface: '#E4E3DC', fg: '#0F0F11', muted: '#5D5D66', accent: '#D4470E', c2: '#B97A00', c3: '#2F9E68', on2: '#FFFFFF', on3: '#FFFFFF' },
};
const DEFAULT_THEME: ThemeName = 'light';
const THEME_KEY = 'kd-theme';

const savedTheme = (): ThemeName | null => {
	try {
		const v = localStorage.getItem(THEME_KEY);
		return v === 'dark' || v === 'light' ? v : null;
	} catch {
		return null;
	}
};
const saveTheme = (t: ThemeName) => {
	try {
		localStorage.setItem(THEME_KEY, t);
	} catch {}
};

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
const themeVars = (t: ThemeName) => {
	const s = PALETTE[t];
	const dk = t === 'dark';
	return {
		'--bg': s.bg,
		'--surface': s.surface,
		'--fg': s.fg,
		'--muted': s.muted,
		'--line': `rgba(${rgb(s.fg)},${dk ? 0.11 : 0.12})`,
		'--line-strong': `rgba(${rgb(s.fg)},${dk ? 0.28 : 0.32})`,
		'--accent': s.accent,
		'--c1': s.accent,
		'--c2': s.c2,
		'--c3': s.c3,
		'--c2-on': s.on2,
		'--c3-on': s.on3,
		'--grain': dk ? '.07' : '.12',
	};
};

export function initPortfolio() {
	const root = document.querySelector<HTMLElement>('[data-kd]');
	const wrap = root?.querySelector<HTMLElement>('[data-k="wrap"]');
	const cv = root?.querySelector<HTMLCanvasElement>('[data-k="cv"]');
	if (!root || !wrap || !cv) return;
	if (root.dataset.ready) return;
	root.dataset.ready = '1';

	const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel);
	const $$ = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

	const orbEl = $<HTMLElement>('[data-k="orb"]');
	const marqEl = $<HTMLElement>('[data-k="marq"]');
	const stEl = $<HTMLElement>('[data-k="st"]');
	const ringEl = $<SVGElement>('[data-k="ring"]');
	const themeEl = $<HTMLElement>('[data-k="theme"]');
	const rowsEl = $<HTMLElement>('[data-k="rows"]');
	const secEl = $<SVGElement>('[data-k="sec"]');
	const progEl = $<HTMLElement>('[data-k="progress"]');
	const colsEl = $<HTMLElement>('[data-k="cols"]');
	const toastEl = $<HTMLElement>('[data-k="toast"]');
	const hhEl = $<SVGElement>('[data-k="hh"]');
	const mmEl = $<SVGElement>('[data-k="mm"]');
	const rows = rowsEl ? Array.from(rowsEl.children) as HTMLElement[] : [];
	const rvEls = $$<HTMLElement>('[data-rv]');
	const parEls = $$<HTMLElement>('[data-par]');
	const words: HTMLElement[] = [];
	if (stEl && !reduce) {
		const wrapWords = (node: Node) => {
			Array.from(node.childNodes).forEach((c) => {
				if (c.nodeType === Node.ELEMENT_NODE) return wrapWords(c);
				if (c.nodeType !== Node.TEXT_NODE || !c.textContent?.trim()) return;
				const frag = document.createDocumentFragment();
				c.textContent.split(/(\s+)/).forEach((part) => {
					if (!part) return;
					if (/^\s+$/.test(part)) return frag.append(part);
					const span = document.createElement('span');
					span.textContent = part;
					span.style.cssText = 'display:inline-block; will-change:opacity,transform';
					words.push(span);
					frag.append(span);
				});
				c.replaceWith(frag);
			});
		};
		wrapWords(stEl);
	}

	const frames = $$<HTMLElement>('[data-frame]');
	const navLinks = $$<HTMLElement>('[data-nav]');

	const st = { w: 1280, cur: 0, nav: '', time: '--:--' };
	let dark = DEFAULT_THEME === 'dark';
	let inkC = '#0F0F11';
	let hotC = '#D4470E';
	let hotSet = ['#D4470E', '#B97A00', '#2F9E68'];
	let ready = false;
	let pinY: number | null = null;
	let mAnim: Animation | undefined;
	let toastTimer: number | undefined;

	/* ---------- layout (container width) ---------- */
	const setVars = (vars: Record<string, string>) => Object.entries(vars).forEach(([k, v]) => wrap.style.setProperty(k, v));

	function applyLayout() {
		const { w } = st;
		const n = w < 760, m = w < 860, l = w < 1080, xs = w < 600;
		const L: Record<string, string> = {
			orbPos: n ? 'relative' : 'absolute',
			orbRight: n ? 'auto' : 'var(--g)',
			orbMargin: n ? '0 auto' : 'auto 0',
			orbW: n ? 'min(100%, 380px)' : 'min(46cqw, 580px)',
			orbTop: n ? 'auto' : '0px',
			orbBottom: n ? 'auto' : '0px',
			heroMin: n ? '0px' : 'max(760px, min(92svh, 980px))',
			'pn-l': n ? 'auto' : '3%',
			'pn-r': n ? '0px' : 'auto',
			'pn-t': 'auto',
			'pn-b': n ? '-64px' : '-14%',
			figCol: n ? 'auto' : l ? '2 / -1' : 'auto',
			figMt: l ? '48px' : '0px',
			frInset: m ? '16% 3% 5% 3%' : '6% 4% 14% 10%',
			cPr: m ? '0px' : '28px',
			availFlex: n ? '1 1 100%' : '0 0 auto',
			leadCols: n ? 'minmax(0,1fr)' : l ? '140px minmax(0,1fr)' : '140px minmax(0,1fr) minmax(300px,440px)',
			pjCols: m ? 'minmax(0,1fr)' : 'minmax(0,1.05fr) minmax(0,1fr)',
			pjGap: m ? '0px' : 'clamp(24px,5cqw,80px)',
			stageTop: m ? '76px' : 'calc(64px + 7vh)',
			stageH: m ? '330px' : 'min(64vh, 560px)',
			stageOrder: m ? '-1' : '0',
			stageBorder: m ? LINE : '0',
			rowPad: m ? '26px' : 'clamp(28px, 6.2vh, 76px)',
			xpCols: m ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,7fr)',
			xpPos: m ? 'static' : 'sticky',
			itemCols: m ? 'minmax(0,1fr)' : '150px minmax(0,1fr)',
			cHeroDir: m ? 'column' : 'row',
			cHeroAlign: m ? 'flex-start' : 'center',
			cCols: m ? 'minmax(0,1fr)' : '1.1fr 1.3fr .9fr',
			sfTopDir: xs ? 'column' : 'row',
			sfTopAlign: xs ? 'flex-start' : 'flex-end',
			sfCols: xs ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)',
			sfBarDir: xs ? 'column' : 'row',
			sfBarAlign: xs ? 'flex-start' : 'center',
		};
		const vars: Record<string, string> = {};
		for (const [k, v] of Object.entries(L)) vars[`--L-${k}`] = v;
		const cc = (i: number) => (m ? { bl: '0', bt: LINE, pl: '0px' } : { bl: i ? LINE : '0', bt: '0', pl: i ? '28px' : '0px' });
		const sc = (i: number) =>
			!l ? { bl: i ? LINE : '0', bt: '0', pl: i ? '26px' : '0px' }
			: !xs ? { bl: i % 2 ? LINE : '0', bt: i > 1 ? LINE : '0', pl: i % 2 ? '18px' : '0px' }
			: { bl: '0', bt: i ? LINE : '0', pl: '0px' };
		[0, 1, 2].forEach((i) => Object.entries(cc(i)).forEach(([k, v]) => (vars[`--cc${i}-${k}`] = v)));
		[0, 1].forEach((i) => Object.entries(sc(i)).forEach(([k, v]) => (vars[`--sc${i}-${k}`] = v)));
		setVars(vars);

		const show: Record<string, boolean> = { nav: !n, clock: !n, mailNote: !m, upNote: !l };
		$$<HTMLElement>('[data-if]').forEach((el) => {
			el.style.display = show[el.dataset.if as string] ? '' : 'none';
		});

		if (colsEl) {
			const nc = n ? 4 : 12, cw = Math.min(1480, w), left = (w - cw) / 2 + 16, span = cw - 32;
			colsEl.replaceChildren(
				...Array.from({ length: nc + 1 }, (_, i) => {
					const el = document.createElement('i');
					el.style.cssText = `position:absolute; top:0; bottom:0; width:1px; background:var(--line); left:${left + (span * i) / nc}px`;
					return el;
				}),
			);
		}
	}

	function applyProjects() {
		rows.forEach((li, i) => {
			const b = li.firstElementChild as HTMLElement;
			const on = i === st.cur;
			b.style.opacity = on ? '1' : '.4';
			b.style.paddingLeft = on ? '18px' : '0px';
			b.setAttribute('aria-pressed', String(on));
		});
		frames.forEach((f, i) => {
			const on = i === st.cur, back = i === (st.cur + 3) % 4;
			f.style.transform = SKEW + (on ? 'translateX(0)' : back ? 'translate(-7%,6%)' : 'translateX(10%)');
			f.style.opacity = on ? '1' : back ? '.35' : '0';
			f.style.zIndex = on ? '2' : back ? '1' : '0';
		});
	}

	function applyNav() {
		navLinks.forEach((a) => a.classList.toggle('on', a.dataset.nav === st.nav));
	}

	/* ---------- clock ---------- */
	function tick() {
		st.time = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' }).format(new Date());
		$$<HTMLElement>('[data-time]').forEach((e) => {
			e.textContent = st.time;
		});
		const [hh, mm] = (st.time.match(/\d+/g) || [0, 0]).map(Number);
		hhEl?.style.setProperty('transform', `rotate(${(hh % 12) * 30 + mm * 0.5}deg)`);
		mmEl?.style.setProperty('transform', `rotate(${mm * 6}deg)`);
	}

	/* ---------- theme ---------- */
	function applyTheme(t: ThemeName) {
		const vars = themeVars(t);
		Object.entries(vars).forEach(([k, v]) => root!.style.setProperty(k, v));
		dark = t === 'dark';
		root!.dataset.t = t;
		themeEl?.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
		inkC = vars['--fg'];
		hotC = vars['--accent'];
		hotSet = [vars['--c1'], vars['--c2'], vars['--c3']];
		// keep the browser chrome (mobile status bar, overscroll) in sync with the theme
		const bg = PALETTE[t].bg;
		document.documentElement.style.backgroundColor = bg;
		document.documentElement.style.colorScheme = t;
		document.body.style.backgroundColor = bg;
		let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.name = 'theme-color';
			document.head.appendChild(meta);
		}
		meta.content = bg;
		if (ready) buildDots(false);
	}

	function toggleTheme() {
		const next: ThemeName = dark ? 'light' : 'dark';
		saveTheme(next);
		const vt = (document as any).startViewTransition as ((cb: () => void) => { ready: Promise<void> }) | undefined;
		if (!vt || reduce || !themeEl) return applyTheme(next);
		const r = themeEl.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
		const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
		(document as any)
			.startViewTransition(() => applyTheme(next))
			.ready.then(() => {
				document.documentElement.animate(
					{ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
					{ duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' } as KeyframeAnimationOptions,
				);
			})
			.catch(() => {});
	}

	/* ---------- dot portrait ---------- */
	let P: Dot[] = [];
	let W = 0, H = 0;
	let ctx: CanvasRenderingContext2D | null = null;
	let steps = 1;
	const mouse = { x: -999, y: -999 };
	const img = new Image();

	function buildDots(scatter: boolean) {
		if (!ready) return;
		const w = cv!.clientWidth, h = cv!.clientHeight;
		if (!w) return;
		W = w; H = h;
		const d = Math.min(devicePixelRatio || 1, 2);
		cv!.width = W * d; cv!.height = H * d;
		ctx = cv!.getContext('2d')!;
		ctx.setTransform(d, 0, 0, d, 0, 0);
		const n = Math.round(W / 9), s = W / n;
		const off = document.createElement('canvas');
		off.width = off.height = n;
		const o = off.getContext('2d')!;
		o.drawImage(img, 0, 0, n, n);
		const px = o.getImageData(0, 0, n, n).data, inv = !dark, dots: Dot[] = [];
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
				const hx = (x + 0.5) * s, hy = (y + 0.5) * s;
				dots.push({
					hx, hy,
					x: scatter ? W / 2 + (Math.random() - 0.5) * W * 1.6 : hx,
					y: scatter ? H / 2 + (Math.random() - 0.5) * H * 1.6 : hy,
					vx: 0, vy: 0, r: l * s * (inv ? 0.56 : 0.58), h: 0, g: Math.floor(Math.random() * 3),
				});
			}
		P = dots;
		draw();
	}

	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, W, H);
		const R = 90, cold: Dot[] = [], hot: Dot[] = [];
		for (const p of P) {
			if (!reduce)
				for (let s = 0; s < steps; s++) {
					const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
					if (d2 < R * R) {
						const dd = Math.sqrt(d2) || 1, f = (1 - dd / R) * 5.5;
						p.vx += (dx / dd) * f; p.vy += (dy / dd) * f; p.h = 1;
					}
					p.vx += (p.hx - p.x) * 0.055; p.vy += (p.hy - p.y) * 0.055;
					p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy; p.h *= 0.965;
				}
			(p.h > 0.12 ? hot : cold).push(p);
		}
		const paint = (arr: Dot[], c: string) => {
			ctx!.fillStyle = c;
			ctx!.beginPath();
			arr.forEach((p) => { ctx!.moveTo(p.x + p.r, p.y); ctx!.arc(p.x, p.y, p.r, 0, 6.2832); });
			ctx!.fill();
		};
		paint(cold, inkC);
		hotSet.forEach((c, g) => paint(hot.filter((p) => p.g === g), c));
	}

	/* ---------- notes, bars ---------- */
	let nio: IntersectionObserver | undefined;
	function setupNotes() {
		nio?.disconnect();
		nio = new IntersectionObserver(
			(es) => es.forEach((e) => {
				if (!e.isIntersecting) return;
				((e.target as any)._anims || []).forEach((a: Animation) => a.play());
				nio!.unobserve(e.target);
			}),
			{ rootMargin: '0px 0px -8% 0px' },
		);
		$$<HTMLElement>('[data-note]').forEach((n) => {
			const d = n.closest('[data-screen-label="01 Hero"]') ? 1500 : 0;
			const a: Animation[] = [];
			n.querySelectorAll('[data-t]').forEach((t) => a.push(t.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: d, fill: 'both' })));
			n.querySelectorAll('[data-ink]').forEach((p) => a.push(p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: d + 150, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' })));
			a.forEach((x) => x.pause());
			(n as any)._anims = a;
			nio!.observe(n);
		});
		$$<HTMLElement>('[data-bar]').forEach((b) => {
			const a = b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1100, delay: (+(b.dataset.bar || 0)) * 140, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
			a.pause();
			(b as any)._anims = [a];
			nio!.observe(b);
		});
	}

	/* ---------- header progress line ---------- */
	const ACCENT: Record<string, string> = { sobre: '--c3', proyectos: '--c2' };

	/* ---------- scroll ---------- */
	function scrollFx() {
		const vh = innerHeight, y = scrollY;
		const ease = (x: number) => 1 - Math.pow(1 - x, 3);
		const prog = (top: number, from: number, span: number) => ease(Math.max(0, Math.min(1, (vh * from - top) / (vh * span))));
		if (!reduce) {
			// each word fades in as it rises into the reading zone, so text is fully readable by mid-screen
			const tops = words.map((w) => w.getBoundingClientRect().top);
			words.forEach((w, i) => {
				const p = prog(tops[i], 0.95, 0.3);
				w.style.opacity = String(0.12 + 0.88 * p);
				w.style.transform = `translateY(${((1 - p) * 0.28).toFixed(3)}em)`;
			});
			rvEls.forEach((el) => {
				const p = prog(el.getBoundingClientRect().top, 0.96, 0.18);
				el.style.opacity = String(p);
				el.style.transform = `translateY(${((1 - p) * 26).toFixed(1)}px)`;
			});
			parEls.forEach((el) => {
				const r = el.getBoundingClientRect();
				el.style.transform = `translateY(${((vh / 2 - (r.top + r.height / 2)) * 0.09).toFixed(1)}px)`;
			});
		}
		if (pinY != null && Math.abs(scrollY - pinY) > 200) pinY = null;
		if (pinY == null)
			for (let i = 0; i < rows.length; i++) {
				const r = rows[i].getBoundingClientRect();
				if (r.top < vh * 0.58 && r.bottom > vh * 0.58) {
					if (st.cur !== i) { st.cur = i; applyProjects(); }
					break;
				}
			}
		// status bar: current section, scroll percentage and a progress line tinted with the section accent
		// the current section is the last one whose top has passed the middle of the screen
		let cur = 'inicio';
		['sobre', 'proyectos', 'experiencia', 'contacto'].forEach((id) => {
			const el = wrap!.querySelector('#' + id);
			if (el && el.getBoundingClientRect().top < vh / 2) cur = id;
		});
		if (cur !== st.nav) {
			st.nav = cur;
			applyNav();
			if (progEl) progEl.style.background = `var(${ACCENT[cur] ?? '--c1'})`;
		}
		const max = document.documentElement.scrollHeight - vh;
		const p = max > 0 ? Math.max(0, Math.min(1, y / max)) : 0;
		if (progEl) progEl.style.transform = `scaleX(${p.toFixed(4)})`;
	}

	/* ---------- toast, confetti, copy ---------- */
	function say(msg: string) {
		if (!toastEl) return;
		clearTimeout(toastTimer);
		toastEl.textContent = msg;
		toastEl.style.opacity = '1';
		toastEl.style.transform = 'translate(-50%, 0)';
		toastTimer = window.setTimeout(() => {
			toastEl.style.opacity = '0';
			toastEl.style.transform = 'translate(-50%, 24px)';
		}, 1900);
	}

	function burst(x: number, y: number) {
		if (reduce) return;
		const cs = getComputedStyle(root!);
		const cl = ['--c1', '--c2', '--c3'].map((v) => cs.getPropertyValue(v).trim() || '#D4470E').concat('#0F0F11', '#F2C9A7');
		for (let i = 0; i < 38; i++) {
			const c = document.createElement('i'), w = 6 + Math.random() * 8;
			c.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${w}px;height:${w * 0.5}px;background:${cl[i % 5]};z-index:80;pointer-events:none;`;
			document.body.appendChild(c);
			const dx = (Math.random() - 0.5) * 560, up = 90 + Math.random() * 240, fall = 380 + Math.random() * 220, rot = Math.random() * 720;
			c.animate(
				[
					{ transform: 'translate(0,0) rotate(0)', opacity: 1, easing: 'cubic-bezier(.2,.7,.3,1)' },
					{ transform: `translate(${dx}px,${-up}px) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.28, easing: 'cubic-bezier(.5,0,.9,.6)' },
					{ transform: `translate(${dx * 1.1}px,${fall - up}px) rotate(${rot}deg)`, opacity: 0 },
				],
				{ duration: 1800 },
			).onfinish = () => c.remove();
		}
	}

	function copy(e: MouseEvent) {
		const x = e.clientX, y = e.clientY;
		const ok = () => { say('Correo copiado'); burst(x, y); };
		const fail = () => { say('Copia: ' + EMAIL); burst(x, y); };
		try { navigator.clipboard.writeText(EMAIL).then(ok, fail); } catch { fail(); }
	}

	/* ---------- wiring ---------- */
	root.addEventListener('pointermove', (e) => {
		const t = (e.target as Element).closest<HTMLElement>('[data-glow]');
		if (t) {
			const r = t.getBoundingClientRect();
			t.style.setProperty('--mx', e.clientX - r.left + 'px');
			t.style.setProperty('--my', e.clientY - r.top + 'px');
		}
		const mg = (e.target as Element).closest<HTMLElement>('[data-magnet]');
		if (mg && !reduce) {
			const r = mg.getBoundingClientRect();
			mg.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
		}
	});
	$$<HTMLElement>('[data-magnet]').forEach((el) => el.addEventListener('pointerleave', () => (el.style.transform = '')));
	$$<HTMLElement>('[data-copy]').forEach((el) => el.addEventListener('click', copy as EventListener));
	$$<HTMLElement>('[data-act]').forEach((el) => {
		const set = () => {
			pinY = scrollY;
			const i = +(el.dataset.act || 0);
			if (st.cur !== i) { st.cur = i; applyProjects(); }
		};
		['mouseenter', 'focus', 'click'].forEach((ev) => el.addEventListener(ev, set));
	});
	const mh = $<HTMLElement>('[data-marq-host]');
	mh?.addEventListener('mouseenter', () => mAnim?.pause());
	mh?.addEventListener('mouseleave', () => mAnim?.play());
	themeEl?.addEventListener('click', toggleTheme);

	new ResizeObserver((e) => {
		const w = Math.round(e[0].contentRect.width);
		if (Math.abs(w - st.w) > 1) { st.w = w; applyLayout(); buildDots(false); }
	}).observe(wrap);
	st.w = Math.round(wrap.clientWidth) || 1280;
	applyLayout();
	applyTheme(savedTheme() ?? DEFAULT_THEME);
	applyProjects();
	tick();
	setInterval(tick, 20000);

	if (!reduce) {
		mAnim = marqEl?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 38000, iterations: Infinity });
		ringEl?.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 18000, iterations: Infinity });
		$$<HTMLElement>('[data-ln]').forEach((el, i) =>
			el.animate([{ transform: 'translateY(108%)' }, { transform: 'translateY(0)' }], { duration: 1250, delay: 100 + i * 120, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }),
		);
		orbEl?.animate([{ transform: 'scale(.86)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 1600, delay: 200, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
		setupNotes();
		$$<SVGElement>('[data-pk]').forEach((c, i) => {
			const dx = +(c.dataset.dx || 0), dy = +(c.dataset.dy || 0);
			c.animate(
				[
					{ transform: 'translate(0px,0px)', opacity: 0 },
					{ opacity: 1, offset: 0.15 },
					{ opacity: 1, offset: 0.85 },
					{ transform: `translate(${dx}px,${dy}px)`, opacity: 0 },
				],
				{ duration: 2600, delay: i * 650, iterations: Infinity, direction: c.dataset.rev ? 'reverse' : 'normal', easing: 'cubic-bezier(.6,0,.4,1)' },
			);
		});
	}
	if (secEl) {
		const d = new Date(), a0 = (d.getSeconds() + d.getMilliseconds() / 1000) * 6;
		if (reduce) secEl.style.transform = `rotate(${a0}deg)`;
		else secEl.animate([{ transform: `rotate(${a0}deg)` }, { transform: `rotate(${a0 + 360}deg)` }], { duration: 60000, iterations: Infinity });
	}

	img.onload = () => { ready = true; buildDots(!reduce); };
	img.src = '/img/retrato.jpg';
	addEventListener('pointermove', (e) => {
		const r = cv.getBoundingClientRect(), k = cv.clientWidth / (r.width || 1);
		mouse.x = (e.clientX - r.left) * k;
		mouse.y = (e.clientY - r.top) * k;
	});
	document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });

	let last = 0;
	const loop = () => {
		const now = performance.now();
		steps = Math.max(1, Math.min(40, Math.round((now - (last || now)) / 16.7)));
		last = now;
		const cr = cv.getBoundingClientRect();
		const vis = cr.bottom > 0 && cr.top < innerHeight && cr.width > 0;
		if (vis && ready && !reduce) draw();
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);

	addEventListener('scroll', scrollFx, { passive: true });
	scrollFx();
}
