#!/usr/bin/env node

/**
 * set-stage.js
 *
 * Change the maturity stage of an existing note. Run with:
 *   npm run stage
 *   npm run stage -- crypto/new-to-crypto   (jump straight to stage picker)
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const NOTES_DIR = path.join(ROOT, "content", "notes");

const STAGES = [
  { value: "seedling",  label: "🌱 Seedling",  desc: "new idea, rough and incomplete" },
  { value: "budding",   label: "🌿 Budding",   desc: "taking shape, mostly formed" },
  { value: "evergreen", label: "🌳 Evergreen", desc: "polished and well-developed" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** Parse just the frontmatter fields we care about from an mdx file. */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const block = m[1];
  const get = (key) => {
    const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
  };
  return {
    title: get("title"),
    stage: get("stage"),
    topic: get("topic"),
  };
}

/** Replace the `stage:` line in frontmatter without touching anything else. */
function setStageInFile(filepath, newStage) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const updated = raw.replace(/^(stage:\s*)\S+$/m, `$1${newStage}`);
  fs.writeFileSync(filepath, updated);
}

/** Collect all notes as { slug, title, stage, topic, filepath } */
function getAllNotes() {
  const notes = [];
  const topics = fs.readdirSync(NOTES_DIR).filter((d) =>
    fs.statSync(path.join(NOTES_DIR, d)).isDirectory()
  );
  for (const topic of topics) {
    const dir = path.join(NOTES_DIR, topic);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filepath = path.join(dir, file);
      const raw = fs.readFileSync(filepath, "utf-8");
      const fm = parseFrontmatter(raw);
      const slug = `${topic}/${file.replace(/\.mdx$/, "")}`;
      notes.push({ slug, filepath, ...fm });
    }
  }
  // Sort: by topic then title
  return notes.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n  ✏️   Set Note Stage\n");

  const notes = getAllNotes();
  if (notes.length === 0) {
    console.log("  No notes found.\n");
    rl.close();
    return;
  }

  let note;

  // If a slug was passed as a CLI arg, find it directly
  const argSlug = process.argv[2];
  if (argSlug) {
    note = notes.find((n) => n.slug === argSlug);
    if (!note) {
      console.log(`  Note not found: ${argSlug}\n`);
      rl.close();
      return;
    }
  } else {
    // Step 1: pick topic
    const topics = [...new Set(notes.map((n) => n.topic))].sort();
    console.log("  Topic:\n");
    topics.forEach((t, i) => {
      const count = notes.filter((n) => n.topic === t).length;
      console.log(`    ${i + 1})  ${t}  (${count})`);
    });
    console.log();

    let chosenTopic;
    while (true) {
      const input = (await ask(rl, `  Choose topic (1-${topics.length}): `)).trim();
      const n = parseInt(input);
      if (n >= 1 && n <= topics.length) { chosenTopic = topics[n - 1]; break; }
      console.log(`  Please enter a number between 1 and ${topics.length}.`);
    }

    // Step 2: pick note within that topic
    const stageEmoji = { seedling: "🌱", budding: "🌿", evergreen: "🌳" };
    const topicNotes = notes.filter((n) => n.topic === chosenTopic);
    console.log(`\n  Notes in ${chosenTopic}:\n`);
    topicNotes.forEach((n, i) => {
      const emoji = stageEmoji[n.stage] ?? "  ";
      const idx   = String(i + 1).padStart(2);
      const title = (n.title || n.slug).slice(0, 55);
      console.log(`    ${idx})  ${emoji}  ${title}`);
    });
    console.log();

    let chosen;
    while (true) {
      const input = (await ask(rl, `  Choose note (1-${topicNotes.length}): `)).trim();
      const n = parseInt(input);
      if (n >= 1 && n <= topicNotes.length) { chosen = n - 1; break; }
      console.log(`  Please enter a number between 1 and ${topicNotes.length}.`);
    }
    note = topicNotes[chosen];
  }

  const currentEmoji = { seedling: "🌱", budding: "🌿", evergreen: "🌳" }[note.stage] ?? "";
  console.log(`\n  Note: ${note.title || note.slug}`);
  console.log(`  Current stage: ${currentEmoji}  ${note.stage}\n`);

  // Show stage options, excluding the current one
  const choices = STAGES.filter((s) => s.value !== note.stage);
  choices.forEach((s, i) => {
    console.log(`    ${i + 1})  ${s.label.padEnd(18)}  ${s.desc}`);
  });
  console.log();

  let newStage;
  while (true) {
    const input = (await ask(rl, `  New stage (1-${choices.length}): `)).trim();
    const n = parseInt(input);
    if (n >= 1 && n <= choices.length) { newStage = choices[n - 1].value; break; }
    console.log(`  Please enter a number between 1 and ${choices.length}.`);
  }

  rl.close();

  setStageInFile(note.filepath, newStage);

  const newEmoji = { seedling: "🌱", budding: "🌿", evergreen: "🌳" }[newStage];
  console.log(`\n  ✓ ${note.slug}  →  ${newEmoji} ${newStage}`);

  try {
    execSync(`git -C "${ROOT}" add "${note.filepath}"`, { stdio: "ignore" });
    execSync(`git -C "${ROOT}" commit -m "stage: ${note.slug} → ${newStage}"`, { stdio: "ignore" });
    execSync(`git -C "${ROOT}" push`, { stdio: "inherit" });
    console.log("  ✓ pushed\n");
  } catch (e) {
    console.log(`  ✗ git error: ${e.message.trim()}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
