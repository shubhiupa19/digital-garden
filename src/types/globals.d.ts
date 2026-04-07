// Tells TypeScript to accept CSS file imports as side-effects (no exported value).
// Without this, `import './globals.css'` in layout.tsx causes a type error because
// TypeScript doesn't know how to handle non-JS/TS file imports.
declare module "*.css";
