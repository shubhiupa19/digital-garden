#!/usr/bin/env node

/**
 * new-note.js
 *
 * Interactive CLI for creating a new note. Run with:
 *   npm run new
 *
 * Prompts for title, topic, stage, and tags, then creates the .mdx file
 * and opens it in your editor. If you choose "Create new topic", it updates
 * all the necessary files automatically.
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const NOTES_DIR = path.join(ROOT, "content", "notes");
const TYPES_FILE = path.join(ROOT, "src", "types", "content.ts");
const CSS_FILE = path.join(ROOT, "src", "app", "globals.css");
const NOTE_CARD_FILE = path.join(ROOT, "src", "components", "NoteCard.tsx");
const FILTER_PANEL_FILE = path.join(ROOT, "src", "components", "FilterPanel.tsx");
const GRAPH_PAGE_FILE = path.join(ROOT, "src", "app", "graph", "page.tsx");

// Preset color palette shown when creating a new topic.
// Already-used colors are filtered out at runtime, so add as many as you like here.
const COLORS = [
  { name: "Cyan",        hex: "#22d3ee" },
  { name: "Purple",      hex: "#a78bfa" },
  { name: "Yellow",      hex: "#fbbf24" },
  { name: "Green",       hex: "#34d399" },
  { name: "Orange",      hex: "#f97316" },
  { name: "Pink",        hex: "#f472b6" },
  { name: "Red",         hex: "#f87171" },
  { name: "Blue",        hex: "#60a5fa" },
  { name: "Teal",        hex: "#2dd4bf" },
  { name: "Indigo",      hex: "#818cf8" },
  { name: "Lime",        hex: "#a3e635" },
  { name: "Amber",       hex: "#fbbf24" },
  { name: "Rose",        hex: "#fb7185" },
  { name: "Sky",         hex: "#38bdf8" },
  { name: "Violet",      hex: "#c084fc" },
  { name: "Emerald",     hex: "#4ade80" },
  { name: "Fuchsia",     hex: "#e879f9" },
  { name: "Coral",       hex: "#fb923c" },
  { name: "Slate blue",  hex: "#6366f1" },
  { name: "Mint",        hex: "#86efac" },
];

const STAGES = [
  { value: "seedling",  label: "🌱 Seedling",  desc: "new idea, rough and incomplete" },
  { value: "budding",   label: "🌿 Budding",   desc: "taking shape, mostly formed" },
  { value: "evergreen", label: "🌳 Evergreen", desc: "polished and well-developed" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Read current topics from TOPIC_CONFIG in types/content.ts */
function getTopics() {
  const raw = fs.readFileSync(TYPES_FILE, "utf-8");
  const block = raw.match(/const TOPIC_CONFIG = \{([\s\S]*?)\} as const/)?.[1] || "";
  return block
    .split("\n")
    // Match both plain keys (history:) and quoted keys ("self-growth":)
    .map((l) => l.match(/^\s+"?([a-z][a-z0-9-]*)"?:/)?.[1])
    .filter(Boolean);
}

/** Get the display label for a topic key */
function getTopicLabel(key) {
  const raw = fs.readFileSync(TYPES_FILE, "utf-8");
  const escaped = key.replace(/-/g, "\\-");
  const m = raw.match(new RegExp(`"?${escaped}"?:\\s*\\{\\s*label:\\s*"([^"]+)"`));
  return m ? m[1] : key.charAt(0).toUpperCase() + key.slice(1);
}

/** Read hex colors already assigned to topics from globals.css */
function getUsedColors() {
  const raw = fs.readFileSync(CSS_FILE, "utf-8");
  const matches = raw.matchAll(/--color-topic-[a-z-]+:\s*(#[0-9a-fA-F]{6})/g);
  return new Set([...matches].map((m) => m[1].toLowerCase()));
}

/** Prompt the user and return their input */
function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ─── Add a new topic across all files ───────────────────────────────────────

function addTopicToCodebase(key, label, hex) {
  // 1. types/content.ts — insert before uncategorized in TOPIC_CONFIG
  let f = fs.readFileSync(TYPES_FILE, "utf-8");
  f = f.replace(
    "  uncategorized: {},",
    `  ${key}: { label: "${label}" },\n  uncategorized: {},`
  );
  fs.writeFileSync(TYPES_FILE, f);

  // 2. globals.css — insert color variable before uncategorized
  f = fs.readFileSync(CSS_FILE, "utf-8");
  f = f.replace(
    "  --color-topic-uncategorized: #9ca3af;",
    `  --color-topic-${key}: ${hex};\n  --color-topic-uncategorized: #9ca3af;`
  );
  fs.writeFileSync(CSS_FILE, f);

  // 3. NoteCard.tsx — insert hover border class before uncategorized
  f = fs.readFileSync(NOTE_CARD_FILE, "utf-8");
  f = f.replace(
    '  uncategorized: "hover:border-topic-uncategorized/40",',
    `  ${key}: "hover:border-topic-${key}/40",\n  uncategorized: "hover:border-topic-uncategorized/40",`
  );
  fs.writeFileSync(NOTE_CARD_FILE, f);

  // 4. FilterPanel.tsx — insert checkbox accent color before uncategorized
  f = fs.readFileSync(FILTER_PANEL_FILE, "utf-8");
  f = f.replace(
    '  uncategorized: "accent-topic-uncategorized",',
    `  ${key}: "accent-topic-${key}",\n  uncategorized: "accent-topic-uncategorized",`
  );
  fs.writeFileSync(FILTER_PANEL_FILE, f);

  // 5. graph/page.tsx — insert legend row before uncategorized
  f = fs.readFileSync(GRAPH_PAGE_FILE, "utf-8");
  f = f.replace(
    `        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-uncategorized" />
          <span className="text-text-secondary">Uncategorized</span>
        </div>`,
    `        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-${key}" />
          <span className="text-text-secondary">${label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-uncategorized" />
          <span className="text-text-secondary">Uncategorized</span>
        </div>`
  );
  fs.writeFileSync(GRAPH_PAGE_FILE, f);
}

// ─── Open file in editor ─────────────────────────────────────────────────────

function openInEditor(filepath) {
  const editors = [
    ["code", `code "${filepath}"`],
    ["cursor", `cursor "${filepath}"`],
    ["open", `open "${filepath}"`],     // macOS fallback
    ["xdg-open", `xdg-open "${filepath}"`], // Linux fallback
  ];
  for (const [cmd, fullCmd] of editors) {
    try {
      execSync(`which ${cmd}`, { stdio: "ignore" });
      execSync(fullCmd, { stdio: "ignore" });
      return;
    } catch {}
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n  🌱  New Note\n");

  // 1. Title
  const title = (await ask(rl, "  Title: ")).trim();
  if (!title) { console.log("  Aborted.\n"); rl.close(); return; }

  // 2. Slug
  const defaultSlug = slugify(title);
  const slugInput = (await ask(rl, `  Slug   (Enter for "${defaultSlug}"): `)).trim();
  const slug = slugInput || defaultSlug;

  // 3. Topic
  const topics = getTopics();
  console.log("\n  Topic:");
  topics.forEach((t, i) => console.log(`    ${i + 1})  ${getTopicLabel(t)}`));
  console.log(`    ${topics.length + 1})  + Create new topic\n`);

  let topic;
  while (true) {
    const input = (await ask(rl, `  Choose (1-${topics.length + 1}): `)).trim();
    const n = parseInt(input);
    if (n >= 1 && n <= topics.length) {
      topic = topics[n - 1];
      break;
    }
    if (n === topics.length + 1) {
      // New topic flow
      const rawKey = (await ask(rl, "\n  Topic key (lowercase, e.g. economics): ")).trim();
      const key = rawKey.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (!key) { console.log("  Invalid key, using uncategorized."); topic = "uncategorized"; break; }

      const defaultLabel = key.charAt(0).toUpperCase() + key.slice(1);
      const labelInput = (await ask(rl, `  Display name (Enter for "${defaultLabel}"): `)).trim();
      const label = labelInput || defaultLabel;

      const usedColors = getUsedColors();
      const availableColors = COLORS.filter((c) => !usedColors.has(c.hex.toLowerCase()));

      console.log("\n  Color:");
      if (availableColors.length > 0) {
        availableColors.forEach((c, i) => console.log(`    ${i + 1})  ${c.name.padEnd(8)}  ${c.hex}`));
        console.log(`    ${availableColors.length + 1})  Custom hex\n`);
      } else {
        console.log("    All preset colors are in use.");
        console.log(`    1)  Custom hex\n`);
      }

      let hex;
      while (true) {
        const maxChoice = availableColors.length > 0 ? availableColors.length + 1 : 1;
        const ci = parseInt((await ask(rl, `  Choose (1-${maxChoice}): `)).trim());
        if (availableColors.length > 0 && ci >= 1 && ci <= availableColors.length) {
          hex = availableColors[ci - 1].hex;
          break;
        }
        if (ci === maxChoice) {
          hex = (await ask(rl, "  Hex color (e.g. #f472b6): ")).trim();
          break;
        }
      }

      addTopicToCodebase(key, label, hex);
      topic = key;
      console.log(`\n  ✓ Added topic "${label}"\n`);
      break;
    }
  }

  // Check for duplicate
  const filepath = path.join(NOTES_DIR, topic, `${slug}.mdx`);
  if (fs.existsSync(filepath)) {
    console.log(`\n  Error: content/notes/${topic}/${slug}.mdx already exists\n`);
    rl.close();
    return;
  }

  // 4. Stage
  console.log("\n  Stage:");
  STAGES.forEach((s, i) => console.log(`    ${i + 1})  ${s.label.padEnd(16)}  ${s.desc}`));
  const stageInput = parseInt((await ask(rl, "\n  Choose (1-3, Enter for seedling): ")).trim());
  const stage = STAGES[(stageInput >= 1 && stageInput <= 3 ? stageInput : 1) - 1].value;

  // 5. Tags
  const tagsRaw = (await ask(rl, "\n  Tags (comma-separated, or Enter to skip): ")).trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : [];

  rl.close();

  // Create the file
  fs.mkdirSync(path.join(NOTES_DIR, topic), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const tagsStr = tags.length > 0 ? `[${tags.join(", ")}]` : "[]";

  fs.writeFileSync(
    filepath,
    `---\ntitle: "${title}"\ndate: ${today}\nstage: ${stage}\ntopic: ${topic}\ntags: ${tagsStr}\nconnections: []\n---\n\nWrite your thoughts here...\n`
  );

  const rel = path.relative(ROOT, filepath);
  console.log(`\n  ✓ Created: ${rel}`);
  console.log("  Opening file...\n");
  openInEditor(filepath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
