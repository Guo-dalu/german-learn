# Deutsch!

An open-source, static German learning site built with React + Vite, deployed on GitHub Pages. UI in English and Chinese (Simplified). Both the content and the code were written through vibe coding.

## Features

- Vocabulary topics with words, dialogues, and phrasebook — bilingual (EN/ZH)
- Grammar lessons with rules, examples, and exercises
- Interactive exercises: fill-in-the-blank, multiple choice, matching
- Progress tracking via localStorage
- Light/dark theme, mobile-first responsive layout
- i18n UI in English and Chinese Simplified

## Tech Stack

- **React 19 + TypeScript** — component framework
- **Vite 7** — build tool
- **Tailwind CSS v4** — styling (no component library)
- **React Router v7** — routing
- **react-i18next** — UI internationalization
- No backend, no database — fully static

## Content Structure

```
content/
├── vocabulary/{topic}.md / {topic}.zh.md / {topic}.json
├── grammar/{topic}.md / {topic}.zh.md / {topic}.json
├── reference/{name}.json
└── reading/{title}.md / {title}.zh.md
```

Markdown files use frontmatter for title/tags. JSON files hold exercises and structured data (words, dialogues, phrasebook).

## Getting Started

```bash
npm install
npm run dev
```

Lint:

```bash
npm run lint
```


## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/vocabulary/:topic` | Vocabulary lesson + exercises |
| `/grammar/:topic` | Grammar lesson + exercises |
| `/exercises` | All exercises, filterable by tag |

## License

MIT
