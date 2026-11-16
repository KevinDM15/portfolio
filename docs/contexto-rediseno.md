# Contexto del portafolio de Kevin Díaz

Documento de contexto para rediseñar la landing desde cero. Describe quién es Kevin, qué contenido tiene que mostrar la página, con qué está construida y qué reglas y preferencias ya están decididas. No describe ningún diseño: el visual se parte de cero.

## Quién es

- Kevin Díaz, desarrollador de software full-stack, Barranquilla, Colombia.
- Más de seis años construyendo productos digitales (desde 2018).
- Hoy trabaja con agentes de IA como con un equipo: él entiende el problema, escribe la especificación con criterios comprobables, delega tareas pequeñas y acotadas, verifica y entrega. "Personas deciden, agentes ejecutan."
- Disponible para nuevos proyectos (freelance).
- Sitio en producción: https://kevindev.co. Repositorio: https://github.com/KevinDM15/portfolio.

## Objetivo de la página

Una sola landing que un reclutador o cliente pueda leer en dos minutos y que al mismo tiempo tenga personalidad propia, relacionada con tecnología y programación. Debe funcionar bien en móvil con un dedo. Idioma de la interfaz: español neutro.

## Contenido que debe existir

### Inicio

- Nombre: Kevin Díaz.
- Rol: Desarrollador de software full-stack.
- Frase actual: "Construyo software que el equipo puede mantener. Hoy lo hago con agentes de IA." (se puede reescribir).
- Descripción: "Desarrollador full-stack en Barranquilla. APIs, apps web y móviles, con una arquitectura que aguanta el paso del tiempo."
- Llamado a la acción: escribirle (lleva a contacto).
- Estado: (la línea "Disponible para nuevos proyectos" se retiró del hero en nov 2026).
- Retrato: `public/img/retrato.jpg` (busto, fondo de interior). Existe una máscara de la silueta en `public/img/retrato-mascara.png` (blanco = persona) por si se quiere recortar.

### Tecnologías

React, Next.js, React Native, TypeScript, NestJS, Go, Python, PostgreSQL, AWS, GCP, LLMs, arquitectura hexagonal.

### Sobre mí

- Statement: "Llevo más de seis años construyendo productos digitales. Hoy decido el rumbo y los agentes ejecutan."
- Párrafos:
  - "Casi nada lo resuelvo solo. Trabajo con agentes de IA como con un equipo: cada uno recibe una tarea pequeña, un alcance claro y un criterio para saber cuándo terminó."
  - "Todo empieza por entender el problema y escribir qué se espera, con criterios que se puedan comprobar. Esa especificación es la fuente de verdad: los agentes la leen y yo la defiendo."
- Datos: 2018 (primer empleo como desarrollador) · 5 (empresas y clientes, del backend al frontend) · Yo + IA (personas deciden, agentes ejecutan).
- Diagrama del flujo de trabajo: Kevin al centro; alrededor, entender → delegar → verificar → entregar; los agentes en la órbita interior.

### Proyectos

Todavía no hay casos de estudio publicados. La sección es un libro mayor de trabajo entregado: cinco filas (proyecto, para quién, stack, año) que se despliegan con lo que hizo Kevin, cuatro de sus empleos y este portafolio en código abierto. Cada proyecto lleva un esquema de arquitectura dibujado desde datos (cajas y enlaces, `Schematic.astro`) en una placa fija junto al libro mayor en escritorio y dentro de la fila en móvil. Los datos viven en el array `work` de `data.ts`.

### Experiencia (2018 — hoy)

Texto de recorrido: "Del JavaScript de 2018 al Next.js, React Native y las integraciones con IA de hoy, pasando por Go, NestJS y AWS. Siempre en equipos que entregan."

| Periodo | Empresa | Rol | Qué hizo | Stack |
|---|---|---|---|---|
| Jun 2026 — hoy | Universidad de la Costa | Desarrollador full-stack · Freelance | Aplicaciones web con Vite y React; arquitecturas y planes técnicos; migración progresiva de módulos legacy (PHP, JavaScript, jQuery) a React en el frontend y Python serverless en el backend. | React, Vite, Python, Serverless |
| Ene 2026 — hoy | El Sol Neighborhood Educational Center | Desarrollador full-stack · Freelance | Apps web y móviles con Next.js, React y React Native; interfaces multiplataforma centradas en rendimiento, usabilidad y consistencia; arquitecturas y planes técnicos; Scrum. | Next.js, React, React Native |
| Oct 2023 — Jul 2026 | The Rocket Code | Desarrollador full-stack · Freelance | Optimización de aplicaciones cliente; APIs con NestJS, PostgreSQL y AWS bajo arquitectura hexagonal; integración de LLMs por API para automatizar procesos; componentes reutilizables con React, MaterialUI, Redux y Next.js. | Next.js, React, NestJS, PostgreSQL, AWS, LLMs |
| Ago 2020 — Abr 2023 | Wawandco | Desarrollador full-stack | Código nativo en Go con SOLID, Clean Code y MVC; servicios backend y funciones serverless en GCP; reducción de deuda técnica; migración de librerías. | Go, GCP, Cloud Functions, Firestore |
| Ago — Dic 2018 | Koombea | Desarrollador full-stack | Aplicaciones web con JavaScript, HTML y CSS. | JavaScript |

Formación: Técnico en Programación de Software (SENA, 2017 — 2018) · Técnico en Mantenimiento de Sistemas Informáticos (UniBarranquilla, 2019 — 2021) · Tecnólogo en Gestión de Sistemas Informáticos (UniBarranquilla, 2022 — hoy) · Scrum Developer (Kleer, 2023).

Idiomas: Español nativo · Inglés básico.

### Contacto

- Titular actual: "¿Tienes una idea? Hablemos."
- Correo: kevindiazm.14@gmail.com (botón que copia al portapapeles y muestra "Correo copiado").
- Canales: GitHub /KevinDM15 · LinkedIn /in/kevindm14 · Teléfono +57 300 232 9174.
- En qué puede ayudar: APIs y backend (NestJS, Go, PostgreSQL, AWS) · Web y móvil (React, Next.js, React Native) · Arquitectura limpia (hexagonal, SOLID) · IA aplicada (LLMs, Anthropic, OpenAI).
- Hora local de Barranquilla (UTC−5), reloj en vivo.

### Pie

"Gracias por la visita." · Kevin Díaz · Desarrollador full-stack · Barranquilla, CO · © 2026 · volver arriba.

### Chatbot

Asistente flotante que responde preguntas sobre Kevin con su CV como contexto. Ya existe y debe conservarse; solo cambia su piel.

## Con qué está construido

- Astro 6 (SSG, adaptador Vercel), pnpm obligatorio, TypeScript estricto.
- React 19 solo como isla para el chatbot (`src/components/islands/ChatBot.tsx`, lógica en `src/features/chatbot/`: hooks, componentes, API, estilos en `chatbot.css`). Lee los tokens de color del contenedor raíz `[data-kd]`: `--bg`, `--surface`, `--fg`, `--muted`, `--line`, `--line-strong`, `--accent`.
- Endpoint `src/pages/api/chat.ts` contra Groq (modelo `openai/gpt-oss-20b`); la clave vive en `.env` / `.env.local`, nunca en el repo.
- La landing vive en `src/components/portfolio/`: `Portfolio.astro` compone, `data.ts` tiene el contenido, `sections/` una pieza por sección, `behaviours/` un módulo por comportamiento y `styles/` una hoja por sección. Los iconos son componentes en `src/components/icons/`. Se monta desde `src/pages/index.astro`. Es libre de reescribirse por completo.
- Hay una escena WebGL con PixiJS 8 en `src/features/network/scene.ts` (mapa de red detrás del contenido y una estrella que baja con el scroll por la columna de anclas, del hero al cierre, donde aterriza). Se puede reutilizar, reducir o eliminar; no es un requisito del rediseño.
- UnoCSS está instalado solo por su reset. Inyecta un reset y utilidades globales: nombres de clase como `ring`, `where` o `row` pueden recibir estilos inesperados; usar nombres con prefijo propio.
- Fuentes autoalojadas en `public/fonts/` (Geist y Geist Mono). Se pueden cambiar; las fuentes de Google se descargan como woff2 latin y se sirven desde ahí.
- Otros assets: `public/svg/favicon.svg`, los iconos de tecnologías en `public/svg/tech/` y el CV en `public/CV_KEVIN_ES.pdf`.
- Verificación habitual: `pnpm build` y revisión con Playwright a 1440 y 390 de ancho. No hay pruebas unitarias.

## Reglas y preferencias ya decididas

Estas reglas vienen de decisiones explícitas de Kevin y aplican a cualquier rediseño.

- Nada genérico ni de plantilla. Se han rechazado: diseño plano "de periódico" (líneas finas, columnas, etiquetas en mayúsculas), paleta crema con terracota, verde fósforo tipo terminal hacker, chips o pastillas con punto, formas orgánicas tipo burbuja, tipografía ancha tipo Syne, estética de videojuego o ciencia ficción (fuentes techno, biseles grandes, líneas de escaneo, suelos en perspectiva, halos de neón).
- Nunca enumeración en la interfaz: nada de 01/02/03, pasos numerados ni navegación numerada. Fechas y años sí.
- Nunca bordes de acento a la izquierda (barras laterales en tarjetas, citas o líneas de tiempo).
- Nada de emojis; iconos en SVG.
- Copy en español neutro, sin regionalismos.
- Profundidad y materia: Kevin ha pedido que no se vea plano ni "todo cuadrado", pero tampoco redondeado por defecto. Las últimas iteraciones que le gustaron tenían contraste fuerte, un cierre de página en claro con olas, iconos en los listados y un registro "profesional de desarrollador".
- Colores vivos pero contenidos. Kevin descartó el azul noche con cian por verse como "diseño genérico de IA". Paleta elegida (nov 2026): "hielo", gris casi negro (#101214) de base, blanco hielo (#DDE6EA) para la red y las anclas, amarillo (#FFD166) para acciones, y un bloque claro gris muy suave (#F4F6F7) al final. Todo vive en tokens en `:root` de portfolio.css.
- Solo tema oscuro de base en la última etapa; un tema claro no es obligatorio.
- Móvil con un dedo: nada que dependa de teclado o precisión.
- Reclutadores primero: la información tiene que poder leerse sin jugar ni descubrir nada.
- Rendimiento: sitio estático, JavaScript mínimo fuera del chatbot y, si se conserva, la escena WebGL cargada bajo demanda.
- Respetar `prefers-reduced-motion`.

## Flujo de trabajo del repositorio

- Rama principal `main` protegida; el trabajo va en ramas y entra por pull request.
- Nunca crear PR, mergear ni subir ramas sin que Kevin lo pida en ese momento.
- Commits con Conventional Commits, sin firmas de IA.
- El estado actual del rediseño en curso está en la rama local `feat/network-landing`; `main` tiene la versión anterior publicada.
