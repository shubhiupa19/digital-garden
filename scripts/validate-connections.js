#!/usr/bin/env node

/**
 * validate-connections.js
 *
 * Checks that all connections referenced in note frontmatter
 * point to notes that actually exist. Exits with code 1 if
 * any broken connections are found, so CI can catch them.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { globSync } = require("glob");

const NOTES_DIR = path.join(__dirname, "..", "content", "notes");

function main() {
  const files = globSync("**/*.mdx", { cwd: NOTES_DIR });
  const slugs = new Set(files.map((f) => f.replace(/\.mdx$/, "")));

  let broken = 0;

  for (const file of files) {
    const filepath = path.join(NOTES_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data } = matter(raw);
    const connections = Array.isArray(data.connections) ? data.connections : [];
    const noteSlug = file.replace(/\.mdx$/, "");

    for (const conn of connections) {
      if (!slugs.has(conn)) {
        console.log(`  ✗ ${noteSlug} → ${conn} (not found)`);
        broken++;
      }
    }
  }

  if (broken > 0) {
    console.log("");
    console.log(`  ${broken} broken connection(s) found.`);
    console.log("  Fix them in the note frontmatter or create the missing notes.");
    process.exit(1);
  } else {
    console.log(`  ✓ All connections valid (${files.length} notes checked).`);
  }
}

main();
