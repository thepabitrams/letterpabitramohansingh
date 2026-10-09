# letter/

Core letter rendering, variants, animations, and patterns.

---

## Purpose

Two rendering targets:

1. Live app — React + Motion + Tailwind
2. Downloaded HTML — Plain HTML + CSS + vanilla JS

Both must look identical. This folder holds every variant, animation, and pattern that supports both.

---

## Folder Map

```
letter/
├── background/          Colors + motion animations
├── button/              Button styles + animations
├── effect/              Particle effects (hearts, snow, etc.)
├── message-box/         Message box styles + animations
├── text/                Typography variants + animations
├── patterns/            Two-choice, one-choice, note-only
├── editor/              Editor UI (live app only)
└── tokens/              Shared constants (colors, shapes, sizes)
```

---

## The `standalone` Pattern

Every variant can have two render paths:

1. `component` — React (live app)
2. `standalone` — Vanilla (downloaded HTML)

Downloaded HTML cannot run React. It needs plain CSS or vanilla JS. `standalone` holds that code.

### When It Is Needed

Both conditions must be true:

- The variant renders in the downloaded HTML
- The variant uses React, Motion, or a custom font

### When It Is Not Needed

- Only sets a Tailwind `className`, OR
- Not rendered in the downloaded HTML

---

## Files WITH `standalone` (14)

| Folder | Files | Reason |
|---|---|---|
| `effect/variants/` | hearts, confetti, snow, fireworks, none | React `motion.div` |
| `text/variants/` | romantic, modern, handwritten | Google Fonts URL |
| `text/animations/` | fade, slide, typewriter, none | Motion + custom JS |
| `background/animations/` | parallax, static | Motion |

---

## Files WITHOUT `standalone`

| Folder | Files | Reason |
|---|---|---|
| `background/variants/` | pink, blue, mint, dark, warm | Tailwind className only |
| `message-box/variants/` | romantic, minimal, vintage | Tailwind className only |
| `message-box/animations/` | fade, slide, none | Motion config only |
| `button/variants/` | solid, outline | Tailwind className only |
| `button/animations/` | pulse, bounce, glow, shake, none, runaway, blast | Buttons not in downloaded HTML |
| `effect/animations/` | fast, medium, slow | Speed numbers only |
| `tokens/` | colors, shapes, sizes, speeds, index | Constants only |

---

## Adding a New Variant

Create the file inside the correct variants folder. Follow the standard shape:

```ts
export default {
  id: 'unique-id',
  name: 'Display Name',
  component: () => ( /* React */ ),
  standalone: {
    script: `...vanilla code...`,
  },
}
```

Auto-loaded by `index.ts`. No other changes.

### Examples

- New effect: `effect/variants/stars.tsx` — needs `standalone.script`
- New background: `background/variants/lavender.ts` — no `standalone`
- New font: `text/variants/playfair.ts` — needs `standalone.fontUrl` + `fontFamilyCss`

For new fonts, also add one line to `src/index.css`:

```css
@theme {
  --font-playfair: 'Playfair Display', Georgia, serif;
}
```

Vite plugin handles all `<link>` and `<style>` injection automatically.

---

## Golden Rule

Before writing manual CSS or JS, ask:

> Can this be loaded from a CDN?

- Yes — Use the CDN (Motion, Google Fonts, Tailwind)
- No — Write standalone script

---

## Never Touch

When adding a new variant, do not edit:

- `index.ts` — auto-loader for each folder
- `src/core/lib/export/html/` — HTML orchestrator
- `vite.config.ts` — font auto-injection plugin

Create the new file. Done.

---

*Last updated: 2026-10-10*