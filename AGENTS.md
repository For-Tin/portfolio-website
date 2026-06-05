<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 Developer & Agent Guide (Minimalist Portfolio)

This document guides AI coding agents and developers working on this repository.

## 🛠 Tech Stack & Commands
- **Runtime & Package Manager:** **Bun** (located at `C:\Users\stepa\AppData\Local\Microsoft\WinGet\Packages\Oven-sh.Bun_Microsoft.Winget.Source_8wekyb3d8bbwe\bun-windows-x64\bun.exe`).
- **Styling:** **Tailwind CSS v4** (configuration is declared inside `src/app/globals.css` using the `@theme` directive; do not look for `tailwind.config.js`).
- **Testing:** **Vitest** + **React Testing Library** + **JSDOM**.
- **Animations:** **Framer Motion**.

### 💻 Command Reference
- Run local dev server: `bun run dev`
- Run unit tests: `bun run test`
- Watch unit tests: `bun run test:watch`
- Compile production build: `bun run build`

---

## 🎨 Design System & Custom Animations
The app implements Apple-style minimalism with smooth micro-interactions.

- **Color Tokens:**
  - Light theme: background `#ffffff`, card `#f5f5f7`, text `#1d1d1f`, accent blue `#0066cc`.
  - Dark theme: background `#000000`, card `#1d1d1f`, text `#f5f5f7`, accent blue `#2997ff`.
- **Custom Components:**
  - `<ThemeToggle />` - Rotating icon switch for light/dark themes.
  - `<Navbar />` - Sticky top bar with `backdrop-blur-lg` and scroll-based shrink.
  - `<CardTilt />` - 3D card tilt on hover using spring dynamics with a cursor-tracking light glare overlay.
  - `<ScrollReveal />` - Fades and slides elements upward upon entering view, using Apple's custom timing curve `[0.16, 1, 0.3, 1]`.

---

## 🧪 Testing Guidelines
- All utility functions and React components should have accompanying `*.test.ts` or `*.test.tsx` files.
- Tests use `vitest` globals (`describe`, `it`, `expect`, `vi`).
- Global mocks for Next.js fonts, `next-themes`, and `framer-motion` are set up in `vitest.setup.ts`. Refer to it before writing custom component tests.
