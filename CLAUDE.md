# Deutsch! — German Learning Site

Static German learning site. React + Vite, GitHub Pages, no backend.
Colorful, mobile-first. UI in English (`en`) and Chinese Simplified (`zh`).

## Working Style

Bring judgment, not just execution. Push back when something's off. When a decision is unclear, offer options with a recommendation — think with me, not just for me.

Keep answer concise and clear.

## Tech Stack

| Layer       | Choice                                 |
| ----------- | -------------------------------------- |
| Framework   | React 19 + TypeScript                  |
| Build tool  | Vite 7                                 |
| Styling     | Tailwind CSS v4 (no component library) |
| Routing     | React Router v7                        |
| Markdown    | react-markdown v10                     |
| i18n        | react-i18next v16 / i18next v25        |
| State       | React useState / useReducer            |
| Persistence | localStorage                           |

No antd. No shadcn. No Zustand. Keep dependencies minimal.

## Repository Structure

```
src/
├── index.css              ← Tailwind v4 entry + CSS vars
├── i18n.ts
├── locales/en.json, zh.json
├── components/
│   ├── Card.tsx, Tag.tsx, WordHighlight.tsx
│   └── exercises/FillInBlank.tsx, MultipleChoice.tsx, Matching.tsx
├── pages/Home.tsx, VocabularyPage.tsx, GrammarPage.tsx, ExercisePage.tsx
├── hooks/useProgress.ts   ← localStorage progress hook
├── utils/content.ts       ← parseFrontmatter + content helpers
├── constants/index.ts     ← STORAGE_KEYS, GENDER_COLOR, GENDER_LABEL, DEFAULT_LANG
└── types/content.ts       ← shared TypeScript types
content/
├── meta.json                                              ← topic metadata: emoji, tags, wordCount, title {en,zh}
├── vocabulary/{topic}/index.md, index.zh.md, index.json  ← words + dialogue + phrasebook + exercises
├── grammar/{topic}/index.md, index.zh.md, index.json     ← rules + examples + exercises
├── reference/{name}.json                                  ← lookup tables, no exercises
└── reading/{title}.md, {title}.zh.md                     ← graded stories B1+, no exercises
```

## Code Conventions

- **Shared functions** → `src/utils/`; **shared constants** → `src/constants/index.ts`
- Before writing a helper, check `src/utils/content.ts` and `src/constants/index.ts` — reuse what exists, don't duplicate. DRY PRINCIPLE!
- Never hardcode localStorage key strings — always use `STORAGE_KEYS`

### Adding a new topic

1. Create `content/{section}/{slug}/index.md`, `index.zh.md`, `index.json`
2. **Always update `content/meta.json`** — add `{ emoji, tags, wordCount, title: { en, zh } }` derived from the JSON file. Read the JSON to get the correct `emoji`, `tags`, and word count.
3. Index pages, sidebar, and exercises pick it up automatically

## Styling Conventions

**Tailwind v4 tokens** — CSS vars in `src/index.css` (`:root` + `[data-theme="dark"]`), mapped via `@theme inline`:

- `var(--bg)` → `bg-bg`, `var(--card)` → `bg-card`, `var(--text)` → `text-text`
- `var(--accent1..5)` → `text-accent1..5`, `var(--border)` → `border-border`
- `'Fredoka One'` → `font-display`, `'Nunito'` → `font-body`

**Rules:**

1. No hardcoded hex/rgba in TSX — always use CSS variables. Add new tokens to `:root` + `@theme inline`.
2. Visual patterns live in components, not CSS classes. `Card.tsx` = card shell; `Tag.tsx` = tag pill. `index.css` only for: base/reset, CSS vars, `.word-highlight`, `.prose-content`, `.float`.
3. Prefer Tailwind utilities over `style={{}}`. Use standard scale (e.g. `leading-none`, `tracking-wider`). `style={{}}` only for truly runtime-dynamic values (e.g. state-driven bg/border switching between multiple CSS vars). `clamp()` stays as `text-[clamp(...)]`.
4. Never use `style={{ color: GENDER_COLOR[x] }}` — use `GENDER_CLASS` from `src/constants/index.ts` which maps gender → Tailwind class (`text-accent1/2/5`). For any new color-class mapping, add a `*_CLASS` constant alongside the `*_COLOR` one and use the class version in TSX.

## Internationalization (i18n)

**UI strings:** `react-i18next`, stored in `src/locales/`. Always use `t('key')` — never hardcode strings. See `en.json` / `zh.json` for existing keys.

**Content files:** Per-language `.md`, shared `.json` for exercises.

```
{topic}.md      ← English
{topic}.zh.md   ← Chinese (optional, falls back to .md)
{topic}.json    ← exercises (language-agnostic)
```

**Frontmatter:**

```yaml
---
title: 'Food Vocabulary' # translated per file
tags: ['A1', 'food', 'nouns'] # always English
---
```

## Content Format

See `CONTENT.md` for the full content authoring spec.

**Markdown** — frontmatter required. Word classes: `.noun` (red), `.verb` (teal), `.adj` (blue).

**Vocabulary JSON** — sections: `words`, `dialogues`, `phrasebook`, `exercises`. Multilingual fields use `{ en, zh }` objects. Exercise types: `fill-in`, `multiple-choice`, `matching`. See `content/vocabulary/food.json` for a full example.

## Design System

**Fonts:** `Fredoka One` (display), `Nunito` (body). All color tokens and theme vars defined in `src/index.css`.

**Card:** `border: 2px solid --border`, `box-shadow: 4px 4px 0px var(--border)`, `border-radius: 16px`. Hover: translate(-2px,-2px), shadow→6px.

**Responsive:** Mobile-first, single→two columns at `md:`. Nav hamburger on mobile. `clamp()` for fluid font sizes.

## localStorage Keys

```
theme              → "light" | "dark"
lang               → "en" | "zh"
progress:{topic}   → { correct: number, total: number }
```

## Routing

```
/                  → Home
/vocabulary/:topic → Markdown + exercises
/grammar/:topic    → Markdown + exercises
/exercises         → All exercises, filterable by tag
```

## Content Guidelines

- German must be accurate
- Tags always English: levels `A1`–`B2`; topics `food`, `travel`, `home`, `work`, `numbers`, `time`, `family`; grammar `articles`, `cases`, `verbs`, `adjectives`, `plurals`
- Word list: min 20 words per topic; all multilingual fields (`en`, `zh`) required
- All `question`, `options` in `.json` must include both `en` and `zh`
- See `CONTENT.md` for full authoring rules (exercise constraints, phrasebook format, etc.)

## Tooling

- **Lint:** `npm run lint` → `eslint src --fix && tsc --noEmit`
- **Tailwind v4:** no `tailwind.config.ts`; PostCSS via `@tailwindcss/postcss`
