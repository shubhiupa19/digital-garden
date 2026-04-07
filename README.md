# Digital Garden

A personal knowledge base built with Next.js and MDX. Notes live as plain text
files, connect to each other through tags and manual links, and are visualized
as an interactive graph.

---

## Quick start

```bash
npm install        # install dependencies
npm run dev        # start local dev server at localhost:3000
npm run new        # interactive prompt to create a new note
npm run build      # build for production (outputs to out/)
```

---

## How it works — the mental model

The whole system has three layers:

```
content/          ← you write here (plain .mdx files)
    ↓
src/lib/          ← reads and parses content, no UI
    ↓
src/app/          ← turns parsed data into pages
src/components/   ↗
```

**Content** is just files. A note is a `.mdx` file with some metadata at the
top (called frontmatter) and your writing below it. Nothing special.

**Lib** (`src/lib/`) reads those files and hands structured data to the rest of
the app. If you ever want to change how content is stored — different folder
structure, a database, a CMS — this is the only layer you'd touch.

**App** (`src/app/`) uses Next.js file-based routing. Each folder in `src/app/`
becomes a URL. The lib functions fetch data, and the components render it.

The whole site is **statically exported** — `npm run build` generates plain
HTML files with no server needed. It deploys directly to GitHub Pages.

---

## File structure

```
digital-garden/
│
├── content/                    ← ALL your writing lives here
│   ├── notes/
│   │   ├── crypto/             ← one folder per topic
│   │   ├── psychology/
│   │   ├── philosophy/
│   │   ├── technology/
│   │   ├── history/
│   │   └── uncategorized/
│   ├── log/                    ← dated learning log entries (YYYY-MM-DD.mdx)
│   ├── interests.md            ← shown on the home page
│   ├── questions.md            ← the "Still Figuring Out" page
│   └── changelog.md            ← updated automatically by the pre-push hook
│
├── src/
│   ├── types/
│   │   └── content.ts          ← single source of truth: topics, stages, types
│   │
│   ├── lib/
│   │   ├── content.ts          ← reads files, parses frontmatter, returns data
│   │   ├── graph.ts            ← builds the node/link structure for the graph
│   │   └── search.ts           ← builds the search index, scores results
│   │
│   ├── components/
│   │   ├── Navigation.tsx      ← sticky header nav
│   │   ├── Footer.tsx          ← simple footer
│   │   ├── NoteCard.tsx        ← card shown in the notes grid
│   │   ├── MaturityBadge.tsx   ← 🌱/🌿/🌳 badge
│   │   ├── TopicPill.tsx       ← colored topic label
│   │   ├── TagPill.tsx         ← clickable tag chip
│   │   ├── ConnectionsList.tsx ← "Connected Notes" section on note pages
│   │   ├── SearchBar.tsx       ← search input with dropdown results
│   │   ├── FilterPanel.tsx     ← sidebar filters on the notes page
│   │   ├── NotesPageClient.tsx ← client boundary for the notes page
│   │   ├── GraphVisualization.tsx ← canvas-based force-directed graph
│   │   └── GraphWrapper.tsx    ← adds router navigation to the graph
│   │
│   └── app/                    ← Next.js pages (folder name = URL segment)
│       ├── layout.tsx          ← root HTML shell: fonts, nav, footer
│       ├── page.tsx            ← home page  →  /
│       ├── notes/
│       │   ├── page.tsx        ← all notes  →  /notes
│       │   └── [...slug]/
│       │       └── page.tsx    ← individual note  →  /notes/topic/slug
│       ├── graph/page.tsx      ← knowledge graph  →  /graph
│       ├── log/page.tsx        ← learning log  →  /log
│       ├── tags/page.tsx       ← tag index  →  /tags
│       ├── changelog/page.tsx  ← changelog  →  /changelog
│       ├── questions/page.tsx  ← open questions  →  /questions
│       ├── globals.css         ← theme colors, typography, prose styles
│       ├── sitemap.ts          ← auto-generates /sitemap.xml for SEO
│       └── robots.ts           ← auto-generates /robots.txt for SEO
│
└── scripts/
    ├── new-note.js             ← interactive CLI: npm run new
    ├── draft-log.js            ← auto-generates log entries on pre-push
    └── validate-connections.js ← checks for broken note links
```

---

## The content system

### Note files

Every note is a `.mdx` file. MDX is Markdown with the ability to embed
React components — but you don't need to use that. Regular Markdown works
perfectly fine.

A note lives at `content/notes/<topic>/<slug>.mdx`. The slug becomes part of
the URL: `content/notes/history/babri-masjid.mdx` → `/notes/history/babri-masjid`.

### Frontmatter

The block between the `---` markers at the top of each file is called
**frontmatter**. It's metadata about the note — the app reads it to know how
to display and connect the note. Everything after the second `---` is your
actual content.

```yaml
---
title: "The Title Shown on the Page"
date: 2026-04-07

# How developed is this note?
#   seedling  = new idea, rough and incomplete
#   budding   = taking shape, mostly formed
#   evergreen = polished and well-developed
stage: seedling

# Which topic does this belong to?
# Options: crypto | psychology | philosophy | technology | history | uncategorized
topic: history

# Keywords — notes sharing 2+ tags are shown as related automatically
tags: [india, history, religion]

# Optional: manually link to other notes by their file path (no .mdx extension)
# Example: connections: [crypto/bitcoin-basics, philosophy/stoicism]
connections: []
---

Your note content here...
```

### Topics

Topics are the top-level buckets. Each note belongs to exactly one.
They're defined in `src/types/content.ts` as `TOPIC_CONFIG` — that's
the single source of truth that everything else reads from.

Current topics: `crypto`, `psychology`, `philosophy`, `technology`,
`history`, `uncategorized`.

To add a new topic, run `npm run new` and choose "Create new topic". The
script updates all 5 files that need changing automatically.

### Maturity stages

| Stage | Emoji | Meaning | SEO priority |
|-------|-------|---------|-------------|
| `seedling` | 🌱 | New idea, rough and incomplete | 0.6 |
| `budding` | 🌿 | Taking shape, mostly formed | 0.7 |
| `evergreen` | 🌳 | Polished and well-developed | 0.8 |

Update a note's stage as it matures. Evergreen notes also get `changeFrequency: monthly`
in the sitemap (telling search engines they change less often).

### Tags

Tags are free-form keywords. Unlike topics (one per note, predefined), you can
have as many tags as you like and invent new ones on the fly.

Tags serve two purposes:
1. **Discovery** — the `/tags` page groups all notes by shared tags
2. **Auto-connections** — if two notes share 2 or more tags, they're
   automatically shown as related on each note's page (no config needed)

Tags are always stored lowercase — writing `India` or `INDIA` in frontmatter
is normalized to `india` at parse time.

---

## How connections work

There are two kinds of connections:

**Manual connections** — you explicitly list slugs in `connections: []`:
```yaml
connections: [crypto/bitcoin-basics, philosophy/stoicism]
```
Connections are bidirectional: if note A lists note B, both pages show each
other under "Linked directly." You only need to add it to one side.

**Auto-connections** — discovered automatically. If two notes share 2 or more
tags, they appear under "Related by shared tags" on each other's pages.

Both kinds of connections are visualized in the graph. Node size reflects
connection count — more-connected notes appear as larger circles.

You can check for broken manual connections (slugs that don't exist) with:
```bash
npm run validate
```

---

## How routing works

Next.js turns the `src/app/` folder structure directly into URLs:

```
src/app/page.tsx                    →  /
src/app/notes/page.tsx              →  /notes
src/app/notes/[...slug]/page.tsx    →  /notes/*  (any path depth)
src/app/graph/page.tsx              →  /graph
```

The `[...slug]` is a "catch-all" segment — it matches any path under `/notes/`
regardless of depth. When you visit `/notes/history/babri-masjid`, Next.js
calls the page with `slug = ["history", "babri-masjid"]`, which the page joins
to `"history/babri-masjid"` and uses to find the file.

Since the site is statically exported, `generateStaticParams()` in the note
page tells Next.js all the slugs to pre-render at build time so every note
exists as a ready-made `.html` file.

---

## Server vs. client components

Next.js has two kinds of components:

**Server components** (the default — no special marker needed) run only at
build time. They can read files and fetch data but can't respond to user
interaction. Most pages and display components are server components.

**Client components** (marked with `"use client"` at the top of the file)
run in the browser. They handle clicks, state, and browser APIs — but can't
read files directly.

The pattern used throughout this codebase: a server page fetches data and
passes it as props to a client component that handles the interactive parts.
For example, `src/app/notes/page.tsx` (server) fetches all notes and passes
them to `NotesPageClient` (client) which handles the filter UI.

---

## Search

The search index is built once at build time. `src/app/page.tsx` calls
`buildSearchIndex()` and writes the result to `public/search-index.json`.
The `SearchBar` component fetches that file at runtime and runs fuzzy matching
entirely in the browser — no server or API needed.

Scoring per query term: title match = 10 pts, tag match = 5 pts, content
excerpt match = 2 pts. Results are sorted by score, top 10 shown.

---

## Scripts reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server at `localhost:3000` |
| `npm run build` | Build static site into `out/` for deployment |
| `npm run new` | Interactive prompt: title, topic, stage, tags → creates `.mdx` file |
| `npm run validate` | Check all `connections: []` entries point to real notes |
| `npm run draft-log` | Generate a log entry from notes created/updated since last log |
| `npm run format` | Auto-format all `.mdx` and `.md` files with Prettier |

### The pre-push hook

`.husky/pre-push` runs `draft-log.js` automatically every time you `git push`.
It scans which notes changed since the last log entry and writes a draft
`content/log/YYYY-MM-DD.mdx` with reflection prompts. It also updates
`changelog.md` with bullet points for new/updated notes. If nothing changed, it
skips silently. If a log for today already exists, it skips to avoid overwriting.

---

## Adding a new topic

Run `npm run new` and choose "Create new topic". The script asks for a key,
display name, and color, then updates all 5 files:

| File | What gets added |
|------|----------------|
| `src/types/content.ts` | Key in `TOPIC_CONFIG` |
| `src/app/globals.css` | CSS color variable `--color-topic-<key>` |
| `src/components/NoteCard.tsx` | Hover border class |
| `src/components/FilterPanel.tsx` | Checkbox accent color |
| `src/app/graph/page.tsx` | Legend row |

Why 5 files? Tailwind CSS requires class names to appear as complete literal
strings in the source — it can't detect dynamically constructed strings like
`bg-topic-${key}`. Each file that uses topic-specific styles needs its own
hardcoded map.

---

## Deployment

The site deploys to GitHub Pages at `shubhiupadhyay.github.io/digital-garden`.

```bash
npm run build   # generates static files in out/
```

`next.config.ts` sets `basePath: "/digital-garden"` in production so all routes
and asset paths are correctly prefixed. In development `basePath` is empty, so
everything works at `localhost:3000` without any prefix.
