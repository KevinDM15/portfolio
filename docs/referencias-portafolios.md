# Referencias: portafolios de desarrolladores reconocidos

Recopilatorio hecho el 15 de noviembre de 2026 con Playwright a 1440×900. Las capturas quedaron en `.playwright-mcp/ref/` (no se versionan). El objetivo es extraer ideas concretas que encajen con la landing actual (mapa de red, azul noche, Geist, placas biseladas, cierre en claro) sin romper las reglas ya decididas: nada de enumeración, nada de bordes a la izquierda, nada de emojis, registro profesional de desarrollador.

## Lo que se vio

| Sitio | Qué lo hace reconocible | Captura |
|---|---|---|
| brittanychiang.com | Columna izquierda fija (nombre, nav, redes) y contenido que desplaza a la derecha. Experiencia como lista: periodo a la izquierda, cargo · empresa con enlace externo, descripción corta y chips de stack. Enlace "View Full Résumé". Foco de luz que sigue al cursor sobre el fondo. | chiang-1, chiang-2 |
| rauno.me | Carrusel horizontal de tarjetas enormes con tipografía gigante y un indicador tipo regla arriba. Cada tarjeta es un proyecto. | rauno-1, rauno-2 |
| joshwcomeau.com | Ilustración de cabecera, chips de categorías, lista "Popular content" con flechas, toggles de sonido y tema. | comeau-1, comeau-2 |
| maximeheckel.com | Fondo de plano técnico (rejilla isométrica) con anotaciones en mono alrededor del logo 3D: hash del commit, coordenadas de cámara, escala. Nav en píldora centrada. | heckel-1, heckel-2 |
| antfu.me | Bio como filas de hechos con chips con logo: "Working at [Vercel] / [Nuxt]", "Creator of [...]", "Core team of [...]". Todo escaneable en cinco segundos. | antfu-1 |
| emilkowal.ski | Mínimo absoluto. Bloque "Today" con qué hace ahora. Proyectos como nombre + una línea. | emil-1, emil-2 |
| leerob.com | Bio con conmutador "Default / Long". Listas con fecha alineada a la derecha. Ilustración lateral. | leerob-1 |
| bruno-simon.com | Juego 3D con carro, "click to start" y sonido. La referencia del portafolio jugable. | bruno-1 |
| dennissnellenberg.com | Foto a sangre, nombre en marquesina gigante en el pie del hero, píldora "Located in the Netherlands" con globo girando. | dennis-1, dennis-2 |
| cassie.codes | Cerrado con una nota de despedida sobre un fondo generativo. | cassie-1 |
| jhey.dev | Pegatinas y gráficos sueltos, líneas de estado en vivo (clima, ciudad, música), pie con "REV 5638D21 · VIEWPORT 1440×900". Lista "Latest" con iconos. | jhey-1 |
| lynnandtonic.com | Índice con puntos guía (label ....... valor) y número de versión "v. XIX": rediseña cada año. | lynn-1 |
| paco.me | Nombre + una frase, tres columnas (Building / Projects / Writing) con nombre y una línea cada uno, bloque "Now". | paco-1 |
| ryanmulligan.dev | Galería inclinada de miniaturas con control "unskew"; datos del último deploy (fecha, clima, canción). | mulligan-1 |
| robbowen.digital | Autorretrato ilustrado con tramas, botón "Hire me", "Let's work together." con texto y botón. | bowen-1, bowen-2 |

## Dónde está flojo lo nuestro

- Inicio: no dice qué hace Kevin ahora mismo ni ofrece el CV; la placa del retrato tiene una sola etiqueta (`kevin.local`).
- Sobre mí: el bloque es correcto pero no se escanea en cinco segundos; las empresas no aparecen hasta Experiencia.
- Proyectos: solo un "próximamente". Es la sección más débil frente a cualquiera de las referencias.
- Experiencia: las empresas no enlazan a nada y las descripciones son largas; formación e idiomas son listas planas.
- Pie: no hay rastro técnico del sitio (versión, commit, deploy), algo que casi todos los sitios de desarrolladores muestran.

## Ideas a replicar, por sección

### Inicio

- Anotaciones técnicas alrededor de la placa del retrato, en mono y a baja opacidad, como las de Maxime Heckel y el pie de Jhey: `rev c6fff8d`, `deploy 15 nov 2026`, `Barranquilla 17:25 UTC−5` en vivo, `1440×900`. El commit y la fecha salen de las variables de Vercel en build (`VERCEL_GIT_COMMIT_SHA`). Encaja con el HUD de traceroute que ya existe.
- Acción secundaria "Ver CV" junto a "Escríbeme", como el "View Full Résumé" de Chiang. Requiere un PDF en `public/`.

### Sobre mí

- Bio corta / larga con un conmutador, como "Default / Long" de Lee Robinson. La corta es el statement actual; la larga son los dos párrafos del contexto.
- Filas de hechos con chips con logo, como Antfu: "Ahora con" CUC y El Sol; "Antes en" Rocket Code, Wawandco, Koombea; "Stack" con los iconos que ya tenemos. Los logos de las empresas se pueden resolver por favicon o por iniciales en un tile.
- Bloque "Ahora", como el "Today" de Emil y el "Now" de Paco: una línea mantenida a mano con el foco actual y la fecha de actualización.

### Proyectos

- Mientras no haya casos de estudio, lista "Construyendo" al estilo Paco y Emil: nombre + una línea + enlace al repositorio. Candidatos reales: este portafolio (mapa de red con PixiJS), el asistente con Groq, y lo que Kevin quiera exponer de GitHub.
- Cuando existan casos, tira horizontal de placas grandes como Rauno, con el paquete de red recorriéndolas.

### Experiencia

- Nombre de empresa enlazado a su sitio con un tile de icono externo, como en Chiang (sin flecha pegada al texto).
- Descripciones recortadas a dos líneas con "ver más" por placa; el chart de años ya resume el recorrido.
- Formación e idiomas con puntos guía entre el nombre y el año, como el índice de Lynn Fisher, sin numerales.

### Contacto y pie

- Lectura técnica en el pie: `kevindev.co v3 · rev c6fff8d · desplegado 15 nov 2026`, como Jhey, Mulligan y la versión de Lynn. Mismo origen de datos que las anotaciones del hero.
- Mantener "¿Tienes una idea? Hablemos." y el correo que se copia: ya cumple lo que hace Robb Owen con "Let's work together".

## Descartado a propósito

- Marquesina con el nombre (Dennis): recurso muy repetido.
- Foco de luz que sigue al cursor (Chiang): la red ya responde al cursor en el retrato.
- Sonido (Comeau, Bruno): no aporta a un reclutador leyendo en dos minutos.
- Galería inclinada (Mulligan): no hay miniaturas que mostrar todavía.
- Fondo de plano técnico (Heckel): se parece demasiado a la red actual y competiría con ella.
