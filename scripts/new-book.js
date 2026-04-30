#!/usr/bin/env node

/**
 * new-book.js
 *
 * Interactive CLI for adding a book to the Bookshelf.
 * Run with:
 *   npm run new-book
 *
 * Prompts for title, author, ISBN, and an optional personal note,
 * then appends the entry to the BOOKS array in Bookshelf.tsx.
 * The gradient is picked automatically by cycling through a pool.
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const BOOKSHELF_FILE = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "Bookshelf.tsx"
);

// Same gradient pool as the hand-coded entries — cycle through them infinitely.
const GRADIENTS = [
  "linear-gradient(135deg, #5C4033, #8B6914)",
  "linear-gradient(135deg, #2C3E50, #4A6FA5)",
  "linear-gradient(135deg, #6B3A5D, #A0527E)",
  "linear-gradient(135deg, #3D5A3E, #6B8F6B)",
  "linear-gradient(135deg, #8B4513, #CD853F)",
  "linear-gradient(135deg, #4A3728, #7A5C48)",
  "linear-gradient(135deg, #2E4057, #5D7EA0)",
  "linear-gradient(135deg, #6B4226, #B87333)",
  "linear-gradient(135deg, #1A3A2A, #4A7C59)",
  "linear-gradient(135deg, #3B2F5E, #7B5EA7)",
  "linear-gradient(135deg, #5E2A2A, #A05050)",
  "linear-gradient(135deg, #2A3E5E, #4A6A8A)",
];

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** Count how many books are currently in the BOOKS array. */
function countExistingBooks(source) {
  const matches = source.match(/isbn: "/g);
  return matches ? matches.length : 0;
}

/** Pick the next gradient by cycling through the pool. */
function pickGradient(bookCount) {
  return GRADIENTS[bookCount % GRADIENTS.length];
}

/** Escape quotes in a string for safe embedding in a JS template literal. */
function escapeQuotes(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Build the source block for a new book entry. */
function buildEntry({ title, author, isbn, note, gradient }) {
  const lines = [
    "  {",
    `    title: "${escapeQuotes(title)}",`,
    `    author: "${escapeQuotes(author)}",`,
    `    isbn: "${isbn}",`,
    `    gradient: "${gradient}",`,
  ];
  if (note) {
    lines.push(`    note: "${escapeQuotes(note)}",`);
  }
  lines.push("  },");
  return lines.join("\n");
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n  📚  Add a Book to the Shelf\n");

  const title = (await ask(rl, "  Title: ")).trim();
  if (!title) {
    console.log("  Aborted.\n");
    rl.close();
    return;
  }

  const author = (await ask(rl, "  Author: ")).trim();
  const isbn = (await ask(rl, "  ISBN (13-digit, or Enter to skip): ")).trim().replace(/[-\s]/g, "");
  const note = (await ask(rl, "  Your note / opinion (or Enter to skip): ")).trim();

  rl.close();

  // Read the existing file
  const source = fs.readFileSync(BOOKSHELF_FILE, "utf-8");

  // Pick gradient based on how many books already exist
  const bookCount = countExistingBooks(source);
  const gradient = pickGradient(bookCount);

  // Build the entry and insert it before the closing `];` of the BOOKS array
  const entry = buildEntry({ title, author, isbn, note, gradient });

  const updated = source.replace(
    /^(\s*)\];(\s*\ntype TooltipState)/m,
    `${entry}\n];\n$2`
  );

  if (updated === source) {
    console.error("\n  Error: could not find the end of the BOOKS array in Bookshelf.tsx");
    console.error("  Make sure the array ends with a line containing only `];`\n");
    process.exit(1);
  }

  fs.writeFileSync(BOOKSHELF_FILE, updated);

  console.log(`\n  ✓ Added "${title}" by ${author}`);
  console.log(`    Gradient: ${gradient}`);
  if (!isbn) console.log("    No ISBN — gradient fallback will always show.");
  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
