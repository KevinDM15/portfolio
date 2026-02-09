# Kevin Díaz - Portfolio

Personal portfolio showcasing my work as a Full-Stack Developer from Barranquilla, Colombia.

## 🚀 Built With

- **[Astro](https://astro.build)** - Static Site Generator with Islands Architecture
- **[React 19](https://react.dev)** - UI Components (Terminal, Navigation)
- **[UnoCSS](https://unocss.dev)** - Utility-first CSS with Dark Mode
- **[GSAP](https://greensock.com/gsap/)** - Smooth Animations
- **[TypeScript](https://www.typescriptlang.org)** - Type Safety

## 📋 Features

- ⚡ Lightning-fast SSG performance
- 🌓 Dark/Light mode with smooth transitions
- 📱 Fully responsive mobile design
- 🎨 Custom glassmorphism UI components
- 📝 Content managed via Markdown (Astro Content Collections)
- ♿ Accessible navigation with keyboard support
- 🚀 Automated Vercel deployments via GitHub Actions

## 🛠️ Project Structure

```
portfolio-kevin/
├── src/
│   ├── components/
│   │   ├── sections/      # Main page sections
│   │   ├── ui/            # Reusable UI components
│   │   └── Terminal/      # Interactive terminal
│   ├── content/           # Markdown content
│   │   ├── about/
│   │   ├── experience/
│   │   └── projects/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── types/
├── .github/
│   └── workflows/         # CI/CD pipelines
└── public/
```

## 🧞 Commands

All commands are run from the root of the project:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally |

## 🎨 Theme System

The portfolio uses a hybrid CSS variables + UnoCSS dark mode system:

- Theme switching via `[data-theme]` attribute
- CSS variables defined in `src/styles/global.css`
- UnoCSS utilities with `dark:` and `light:` variants
- Zero JavaScript re-renders on theme changes

## 📝 Content Management

Content is managed using Astro Content Collections with Zod validation:

```bash
# Add new experience
src/content/experience/04-new-job.md

# Add new project
src/content/projects/05-new-project.md
```

Content is type-safe and validated at build time.

## 🚀 Deployment

This portfolio is automatically deployed to Vercel on every push to `main`:

- Production: Automatic deployment from `main` branch
- Preview: Automatic preview URLs for pull requests
- Powered by GitHub Actions workflow

## 📦 Requirements

- Node.js >= 22.0.0
- pnpm >= 8.0.0

## 📄 License

This project is personal portfolio code. Feel free to use it as inspiration, but please don't copy it directly.

## 📬 Contact

- **GitHub**: [@KevinDM15](https://github.com/KevinDM15)
- **Location**: Barranquilla, Colombia
- **Portfolio**: [Portfolio](https://portfolio-kevin-dev.vercel.app/)

---

**Built with passion in Barranquilla 🌊**
