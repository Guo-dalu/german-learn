# Deutsch! — German Learning Site

## Project Overview

An open source, static German learning website built with React + Vite.
Hosted on GitHub Pages. No backend, no user accounts.
Colorful, playful, mobile-first design. Fun over formal.
Supports two UI languages: English (`en`) and Chinese Simplified (`zh`).

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (no component library) |
| Routing | React Router v7 |
| Markdown | react-markdown v10 |
| i18n | react-i18next v16 / i18next v25 |
| Linting | ESLint v9 (flat config) |
| State | React useState / useReducer |
| Persistence | localStorage |
| Hosting | GitHub Pages |

No antd. No shadcn. No Zustand. Keep dependencies minimal.

## Repository Structure

```
/
├── CLAUDE.md                  ← this file
├── README.md
├── LICENSE                    ← MIT (code)
├── index.html
├── vite.config.ts
├── eslint.config.ts           ← ESLint v9 flat config
├── postcss.config.js          ← uses @tailwindcss/postcss (Tailwind v4)
├── src/
│   ├── index.css              ← Tailwind v4 entry: @import "tailwindcss"
│   ├── main.tsx
│   ├── App.tsx
│   ├── i18n.ts                ← react-i18next setup
│   ├── locales/
│   │   ├── en.json            ← English UI strings
│   │   └── zh.json            ← Chinese UI strings
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   ├── WordHighlight.tsx
│   │   └── exercises/
│   │       ├── FillInBlank.tsx
│   │       ├── MultipleChoice.tsx
│   │       └── Matching.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── VocabularyPage.tsx
│   │   ├── GrammarPage.tsx
│   │   └── ExercisePage.tsx
│   ├── hooks/
│   │   └── useProgress.ts     ← localStorage progress hook
│   └── types/
│       └── content.ts         ← shared TypeScript types
└── content/
    ├── vocabulary/
    │   ├── food.md             ← English explanation
    │   ├── food.zh.md          ← Chinese explanation
    │   └── food.json           ← exercises (shared across languages)
    ├── grammar/
    │   ├── articles.md
    │   ├── articles.zh.md
    │   └── articles.json
    └── LICENSE                 ← CC BY 4.0 (content)
```

## Internationalization (i18n)

### UI Language

Powered by `react-i18next`. Language stored in localStorage key `lang`.
Default: `en`. Supported: `en`, `zh`.

Language switcher in nav — toggles between EN / 中文.

All UI strings must use `t('key')` — never hardcode English strings in components.

#### `src/locales/en.json`
```json
{
  "nav": {
    "vocabulary": "Vocabulary",
    "grammar": "Grammar",
    "exercises": "Exercises"
  },
  "exercise": {
    "fillIn": "Fill in the blank",
    "multipleChoice": "Choose the correct answer",
    "matching": "Match the pairs",
    "reveal": "Reveal",
    "correct": "✓ Correct!",
    "wrong": "✗ Try again...",
    "richtig": "✓ Richtig! (Correct!)"
  },
  "home": {
    "tagline": "Learn German the fun way",
    "subtitle": "Colorful lessons · Interactive exercises · Real sentences"
  }
}
```

#### `src/locales/zh.json`
```json
{
  "nav": {
    "vocabulary": "词汇",
    "grammar": "语法",
    "exercises": "练习"
  },
  "exercise": {
    "fillIn": "填空",
    "multipleChoice": "选择正确答案",
    "matching": "配对",
    "reveal": "显示答案",
    "correct": "✓ 正确！",
    "wrong": "✗ 再试一次...",
    "richtig": "✓ Richtig!（正确！）"
  },
  "home": {
    "tagline": "用有趣的方式学德语",
    "subtitle": "彩色课程 · 互动练习 · 真实例句"
  }
}
```

### Content Language

Separate `.md` files per language, paired by filename convention:

```
food.md      ← English
food.zh.md   ← Chinese
food.json    ← exercises (shared, language-agnostic)
```

When rendering a content page, load `{topic}.{lang}.md` if it exists,
fall back to `{topic}.md` if the translation is not yet available.

### Frontmatter

```yaml
---
title: "Food Vocabulary"        # translated per file
tags: ["A1", "food", "nouns"]   # always English, shared
---
```

Tags are always English — used as filter keys, not display text.

## Content Format

### Markdown (`.md` / `.zh.md`) — reading & explanation

Frontmatter required (see above). Inline word coloring convention:
- Nouns → `.noun` class (red)
- Verbs → `.verb` class (teal)
- Adjectives → `.adj` class (blue)

### JSON (`.json`) — interactive exercises
Shared across languages. `hint`, `question`, `options` use `{ en, zh }` objects.

```json
{
  "topic": "food",
  "tags": ["A1", "food"],
  "exercises": [
    {
      "type": "fill-in",
      "sentence": "das ___ ist kalt",
      "answer": "Wasser",
      "hint": { "en": "water", "zh": "水" }
    },
    {
      "type": "multiple-choice",
      "question": { "en": "What is 'die Milch'?", "zh": "'die Milch' 是什么意思？" },
      "options": [
        { "en": "water",  "zh": "水"   },
        { "en": "milk",   "zh": "牛奶" },
        { "en": "bread",  "zh": "面包" },
        { "en": "cheese", "zh": "奶酪" }
      ],
      "answer": 1
    },
    {
      "type": "matching",
      "pairs": [
        { "german": "das Brot",  "en": "bread",  "zh": "面包" },
        { "german": "der Käse", "en": "cheese", "zh": "奶酪" }
      ]
    }
  ]
}
```

Exercise types: `fill-in`, `multiple-choice`, `matching`.
Render multilingual fields using current `lang` from i18n context.

## Design System

Reference: `german-demo-responsive.html` in repo root (visual reference only).

### Fonts
- Display / headings: **Fredoka One**
- Body: **Nunito** (400, 600, 700, 800)

### Themes
Two themes: `light` and `dark`. Toggle via `data-theme` on `<html>`.

#### Light
```
--bg: #FFF9F0   --bg2: #FFF3E0   --card: #FFFFFF
--text: #2D1B00  --text2: #6B4C2A  --border: #FFD8A8
```

#### Dark
```
--bg: #1A1025   --bg2: #231535   --card: #2D1B45
--text: #F5EEFF  --text2: #C4A8E8  --border: #4A2D7A
```

#### Accents
```
--accent1: #FF6B6B   (red    — nouns)
--accent2: #4ECDC4   (teal   — verbs)
--accent3: #FFE66D   (yellow — decorative)
--accent4: #A855F7   (purple — primary actions, dark: #C084FC)
--accent5: #3B82F6   (blue   — adjectives,      dark: #60A5FA)
```

### Card Style
- Border: 2px solid `--border`
- Shadow: `4px 4px 0px var(--border)` (offset, not blurred)
- Border radius: 16px
- Hover: translate(-2px, -2px), shadow → 6px

### Word Highlighting
Italic + colored underline on hover. Nouns → accent1, Verbs → accent2, Adjectives → accent5.

### Responsive
- Mobile-first, single column → two columns at `md:`
- Nav: links visible at `md:+`, hamburger drawer on mobile
- Font sizes use `clamp()` for fluid scaling

## Tooling

### Tailwind v4
- No `tailwind.config.ts` — deleted, content detection is automatic.
- PostCSS uses `@tailwindcss/postcss` (includes autoprefixer).
- CSS entry: `src/index.css` with `@import "tailwindcss"`, imported in `main.tsx`.

### ESLint
- Flat config (`eslint.config.ts`) using `defineConfig` from `eslint/config` (requires ESLint ≥9.22).
- Plugins: `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks` (via `configs.flat`), `eslint-plugin-import`.
- Run: `npm run lint` → `eslint src --fix && tsc --noEmit`

## localStorage Keys

```
theme              → "light" | "dark"
lang               → "en" | "zh"
progress:{topic}   → { correct: number, total: number }
```

## Routing

```
/                  → Home (tag browser, featured topics)
/vocabulary/:topic → Markdown explanation + exercises
/grammar/:topic    → Markdown explanation + exercises
/exercises         → All exercises, filterable by tag
```

## Content Guidelines

- German must be accurate — double-check grammar rules
- Tags always in English, consistent:
  - Levels: `A1`, `A2`, `B1`, `B2`
  - Topics: `food`, `travel`, `home`, `work`, `numbers`, `time`, `family`
  - Grammar: `articles`, `cases`, `verbs`, `adjectives`, `plurals`
- Each `.md`: 3–8 example sentences minimum
- Each `.json`: 5–10 exercises minimum
- `.zh.md` files are optional — fall back to `.md` if missing
- All `hint`, `question`, `options` in `.json` must include both `en` and `zh`

## License

- Code: MIT
- Content (`/content`): CC BY 4.0
