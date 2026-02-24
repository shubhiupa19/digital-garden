#!/usr/bin/env node

/**
 * draft-log.js
 *
 * Generates a reflective learning log draft from notes that were
 * added or updated since the last log entry. Designed to run
 * automatically on pre-push, or manually via `npm run draft-log`.
 *
 * - Finds the most recent log entry date
 * - Collects notes created or updated after that date
 * - Writes a draft .mdx log file with note references and reflection prompts
 * - Skips silently if there's nothing new (no empty logs created)
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { globSync } = require("glob");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const NOTES_DIR = path.join(CONTENT_DIR, "notes");
const LOG_DIR = path.join(CONTENT_DIR, "log");
const CHANGELOG_FILE = path.join(CONTENT_DIR, "changelog.md");

function getLastLogDate() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    return null;
  }

  const logs = globSync("*.mdx", { cwd: LOG_DIR })
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort()
    .reverse();

  return logs.length > 0 ? logs[0] : null;
}

function getRecentNotes(sinceDate) {
  const files = globSync("**/*.mdx", { cwd: NOTES_DIR });
  const newNotes = [];
  const updatedNotes = [];

  for (const file of files) {
    const filepath = path.join(NOTES_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    // Skip notes that are just the template placeholder
    if (content.trim() === "Write your thoughts here...") continue;

    const slug = file.replace(/\.mdx$/, "");
    const noteDate = data.date ? String(data.date).slice(0, 10) : null;
    const updatedDate = data.updated ? String(data.updated).slice(0, 10) : null;

    if (!noteDate) continue;

    const isNew = !sinceDate || noteDate > sinceDate;
    const isUpdated =
      !isNew && updatedDate && (!sinceDate || updatedDate > sinceDate);

    if (isNew) {
      newNotes.push({
        slug,
        title: data.title,
        stage: data.stage,
        topic: data.topic,
        tags: data.tags || [],
        connections: data.connections || [],
        date: noteDate,
      });
    } else if (isUpdated) {
      updatedNotes.push({
        slug,
        title: data.title,
        stage: data.stage,
        topic: data.topic,
        tags: data.tags || [],
        connections: data.connections || [],
        date: noteDate,
        updated: updatedDate,
      });
    }
  }

  // Sort by date, newest first
  newNotes.sort((a, b) => b.date.localeCompare(a.date));
  updatedNotes.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));

  return { newNotes, updatedNotes };
}

function stageLabel(stage) {
  const labels = { seedling: "seedling", budding: "budding", evergreen: "evergreen" };
  return labels[stage] || stage;
}

function buildDraft(newNotes, updatedNotes, today) {
  const lines = [];

  lines.push("---");
  lines.push(`date: ${today}`);
  lines.push("---");
  lines.push("");

  // Summary of what changed
  if (newNotes.length > 0) {
    for (const note of newNotes) {
      lines.push(
        `Started a new ${stageLabel(note.stage)} on **${note.title}** (${note.topic}).`
      );

      if (note.connections.length > 0) {
        lines.push(
          `It connects to ${note.connections.map((c) => `*${c.split("/").pop().replace(/-/g, " ")}*`).join(", ")}.`
        );
      }

      if (note.tags.length > 0) {
        lines.push(`Tags: ${note.tags.join(", ")}.`);
      }

      lines.push("");
    }
  }

  if (updatedNotes.length > 0) {
    for (const note of updatedNotes) {
      lines.push(
        `Revisited **${note.title}** — now a ${stageLabel(note.stage)}.`
      );
      lines.push("");
    }
  }

  // Reflection prompts (JSX comments for MDX compatibility)
  lines.push("{/* What surprised you? What connected that you didn't expect? */}");
  lines.push("");
  lines.push("{/* What are you still unsure about? */}");
  lines.push("");

  return lines.join("\n");
}

function updateChangelog(newNotes, updatedNotes, today) {
  if (!fs.existsSync(CHANGELOG_FILE)) return;

  const raw = fs.readFileSync(CHANGELOG_FILE, "utf-8");

  // Don't add a duplicate entry for today
  if (raw.includes(`## ${today}`)) {
    console.log(`  Changelog already has an entry for ${today}, skipping.`);
    return;
  }

  const bullets = [];

  for (const note of newNotes) {
    bullets.push(`- Published new note: "${note.title}"`);
  }

  for (const note of updatedNotes) {
    bullets.push(`- Updated note: "${note.title}" (now ${note.stage})`);
  }

  if (bullets.length === 0) return;

  const entry = `\n## ${today}\n\n${bullets.join("\n")}\n`;

  // Insert after the frontmatter (---)
  const parts = raw.split(/^---\s*$/m);
  // parts[0] is before first ---, parts[1] is frontmatter, parts[2] is content
  if (parts.length >= 3) {
    const updated = `${parts[0]}---${parts[1]}---\n${entry}${parts[2]}`;
    fs.writeFileSync(CHANGELOG_FILE, updated, "utf-8");
    console.log(`  Changelog updated with ${bullets.length} item(s) for ${today}.`);
  }
}

function main() {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Don't overwrite if a draft for today already exists
  const todayFile = path.join(LOG_DIR, `${today}.mdx`);
  if (fs.existsSync(todayFile)) {
    console.log(`  Log entry for ${today} already exists, skipping draft.`);
    return;
  }

  const lastLogDate = getLastLogDate();
  const { newNotes, updatedNotes } = getRecentNotes(lastLogDate);

  // Nothing new — skip silently
  if (newNotes.length === 0 && updatedNotes.length === 0) {
    console.log("  No new or updated notes since last log. Skipping draft.");
    return;
  }

  const draft = buildDraft(newNotes, updatedNotes, today);

  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  fs.writeFileSync(todayFile, draft, "utf-8");

  // Also update the changelog
  updateChangelog(newNotes, updatedNotes, today);

  console.log("");
  console.log(`  Draft log created: content/log/${today}.mdx`);
  console.log(`  ${newNotes.length} new note(s), ${updatedNotes.length} updated note(s)`);
  console.log("  Edit the draft to add your reflections before pushing.");
  console.log("");
}

main();
