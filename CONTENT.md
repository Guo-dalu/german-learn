# Content Authoring Guide

## Directory Overview

```
content/
├── vocabulary/   words + dialogue + phrasebook + exercises
├── grammar/      rules + examples + exercises
├── reference/    lookup tables only, no exercises
└── reading/      graded stories B1+, no exercises
```

---

## vocabulary/

Each topic = `{topic}.md` + `{topic}.zh.md` + `{topic}.json`

### Page sections (in order)

1. **Header** — title, tags, emoji
2. **Word List** — all words with article · plural · translation
3. **Dialogue** — 2–3 real-life scenes, vocab highlighted by gender color, ElevenLabs audio
4. **Phrasebook** — 4–6 directly usable phrases from this topic
5. **Language Notes** — max 4 bullet points (from `.md` body)
6. **Exercises** — matching → fill-in → multiple-choice

### Word list rules

- **20–50 words** per topic — scope drives the count. Narrow topics sit near 20; broad ones (travel, health) near 40+.
- Each word must have: `german`, `article`, `gender`, `plural`, `en`, `zh`, `level`, `tags`
- `gender`: `"masculine"` | `"feminine"` | `"neuter"`
- `level`: `"A1"` | `"A2"` | `"B1"` | `"B2"`
- `tags`: sub-category labels (e.g. `["drink"]`, `["fruit", "food"]`)

### Dialogue rules

- **2–3 scenes per topic** — breadth drives the count. Each scene must cover a distinct sub-situation.
- `highlighted_words`: bare nouns (no article) that appear in dialogue lines — colored by gender
- `audio`: ElevenLabs file reference (optional, placeholder ok)
- Lines should use realistic, natural German

### Phrasebook rules

- 4–6 phrases directly usable in real situations
- Each phrase: `{ "german": "...", "en": "...", "zh": "..." }`
- Prefer phrases that extend the topic's vocabulary naturally

### Exercise rules

- **matching**: 5–8 pairs, mix of levels
- **fill-in**: no hints; sentences must be **new** (not copied from dialogue); answer is a single German word
- **multiple-choice**: must present genuine challenge — grammar correction, odd-one-out, plural forms, or reading comprehension; avoid trivial vocabulary recall
- All `question` and `options` fields: `{ "en": "...", "zh": "..." }` objects

### JSON structure

```json
{
  "topic": "food",
  "tags": ["A1", "food", "nouns"],
  "emoji": "🍳",
  "words": [ ... ],
  "dialogues": [ ... ],
  "phrasebook": [
    { "german": "Ich hätte gern ...", "en": "I would like ...", "zh": "我想要……" }
  ],
  "exercises": [ ... ]
}
```

---

## grammar/

Each topic lives in its own folder: `{topic}/{topic}.md` + `{topic}/{topic}.zh.md` + `{topic}/{topic}.json`

### Page sections (in order)

1. **Header** — title, tags, emoji (from JSON)
2. **Grammar content** — the `.md` body rendered as prose with tables
3. **Exercises** — matching → fill-in → multiple-choice

### Markdown rules

- Frontmatter: `title`, `tags` (no `emoji` or `wordCount` needed — emoji lives in JSON)
- Use `##` headings (not `#`) — the page title comes from frontmatter
- Lead with the core principle in plain language before tables
- Tables for declension/conjugation patterns — bold the changing part (e.g. `**den**`)
- End with a **Common Mistakes** section using ❌ / ✅ pairs
- Max ~60 lines — stay dense and scannable, not encyclopedic
- `.zh.md` is a full Chinese translation: headings, prose, table headers, examples all in Chinese

### Exercise rules

- **matching**: 5–8 pairs mapping a German form to its grammar label + meaning
- **fill-in**: sentence with `___`; answer is the exact German word/ending; no hints; sentences must illustrate the rule being taught
- **multiple-choice**: test genuine grammar decisions — wrong case, wrong gender, spot-the-error; options as `{ "en": "...", "zh": "..." }`
- Aim for ~10 exercises total (1 matching + 5–6 fill-ins + 3–4 multiple-choice)

### JSON structure

```json
{
  "topic": "adjective-endings",
  "emoji": "✏️",
  "tags": ["B1", "adjectives", "grammar"],
  "exercises": [
    { "type": "matching", "pairs": [ { "german": "der strenge ___", "en": "Lehrer (nom, definite)", "zh": "Lehrer（主格，定冠词）" } ] },
    { "type": "fill-in", "sentence": "Sie trägt einen lang___ Mantel.", "answer": "en" },
    { "type": "multiple-choice", "question": { "en": "Which is correct?", "zh": "哪句正确？" }, "options": [ { "en": "Ich suche eine billige Wohnung.", "zh": "Ich suche eine billige Wohnung." } ], "answer": 0 }
  ]
}
```

No `words`, `dialogues`, or `phrasebook` keys.

---

## reference/

Pure lookup — **no exercises**. Dense JSON lists.

Files:
- `top-100-verbs.json`
- `top-100-adjectives.json`
- `common-phrases.json`

No `.md` files; no exercises array. Rendered as a searchable table.

---

## reading/

Graded stories, **B1+**. Longer text, **no exercises**.

Each story = `{title}.md` + `{title}.zh.md`

- Tagged by level: `B1` or `B2`
- Frontmatter: `title`, `tags`, `level`
- Aim for 300–600 words per story
- Natural narrative German; vocabulary within level

---

## General Rules

- German must be accurate and natural
- Tags always in English
- Level tags: `A1`, `A2`, `B1`, `B2`
- Topic tags: `food`, `travel`, `home`, `work`, `numbers`, `time`, `family`
- Grammar tags: `articles`, `cases`, `verbs`, `adjectives`, `plurals`

---

## AI Content Generation

To generate a new topic with an AI agent, provide these files as context:

**For vocabulary:**
- `CONTENT.md` (this file)
- `content/vocabulary/food.md`
- `content/vocabulary/food.zh.md`
- `content/vocabulary/food.json`

**For grammar:**
- `CONTENT.md` (this file)
- `content/grammar/adjective-endings/adjective-endings.md`
- `content/grammar/adjective-endings/adjective-endings.zh.md`
- `content/grammar/adjective-endings/adjective-endings.json`

Then prompt:

```
Using the spec in CONTENT.md and the example files as reference, create a new
[vocabulary / grammar] topic: "{topic}" at level {A1/A2/B1}.

Produce 3 files: {topic}.md, {topic}.zh.md, {topic}.json inside content/[vocabulary|grammar]/{topic}/.
Follow the exact structure of the example. Double-check all German for accuracy.
Remember to update content/meta.json with the new entry.
```

The spec + one complete example is sufficient context. No other files needed.
