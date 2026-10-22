# Kevin Díaz · Portafolio

Portafolio personal de Kevin Díaz, desarrollador full-stack en Barranquilla, Colombia. Una sola página con retrato de puntos interactivo, tema claro y oscuro, y un asistente de IA que responde con los datos de mi hoja de vida.

**Sitio:** https://kevindev.co

| Claro | Oscuro |
|---|---|
| ![Hero en tema claro](docs/screenshots/hero-claro.png) | ![Hero en tema oscuro](docs/screenshots/hero-oscuro.png) |

![Sección Sobre mí](docs/screenshots/sobre-mi.png)

## Hecho con

| Capa | Tecnología |
|---|---|
| Framework | [Astro](https://astro.build) 6, generación estática con islas |
| Interfaz interactiva | [React](https://react.dev) 19 (chatbot) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org) |
| Estilos | CSS propio con variables de tema; [UnoCSS](https://unocss.dev) en las páginas internas |
| Animación | Web Animations API y canvas; [GSAP](https://gsap.com) en las secciones antiguas |
| Tipografías | Barlow Condensed, Instrument Serif, DM Mono y Reenie Beanie |
| Chatbot | [Groq](https://groq.com) con `openai/gpt-oss-20b`, expuesto en `/api/chat` |
| Despliegue | [Vercel](https://vercel.com) con GitHub Actions |

## Características

- Tema claro y oscuro con transición circular; el color del navegador en móvil sigue al tema.
- Retrato hecho de puntos que se apartan del cursor.
- Paleta de terracota, mostaza y verde, con un acento propio por sección.
- Diseño adaptable según el ancho del contenedor.
- Respeta `prefers-reduced-motion`.
- Chatbot con respuestas en streaming y sugerencias de seguimiento.

## Estructura

```
src/
├── components/
│   ├── portfolio/     # Página principal: Portfolio.astro, portfolio.ts, portfolio.css
│   └── islands/       # ChatBot.tsx
├── features/chatbot/  # Hook, API cliente y componentes del chat
└── pages/             # index, páginas internas y api/chat.ts
public/                # Fuentes, imágenes y CV
docs/screenshots/      # Capturas de este README
```

## Contacto

- GitHub: [@KevinDM15](https://github.com/KevinDM15)
- LinkedIn: [kevindm14](https://www.linkedin.com/in/kevindm14/)
- Correo: kevindiazm.14@gmail.com

## Licencia

Código de portafolio personal. Puedes usarlo como inspiración, pero no lo copies tal cual.
