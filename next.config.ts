import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// In production (GitHub Pages), all routes live under /digital-garden.
// In dev, basePath is empty so routes work at localhost:3000/notes/... etc.
const basePath = isProd ? "/digital-garden" : "";

const nextConfig: NextConfig = {
  // Static export: Next.js generates plain HTML/CSS/JS files with no server.
  // `npm run build` writes everything to the `out/` directory.
  // This is what makes GitHub Pages deployment work.
  output: "export",
  basePath,
  reactStrictMode: true,
  images: {
    // Required for static export — Next.js image optimization needs a server.
    unoptimized: true,
  },
  env: {
    // Exposes basePath to client-side code (e.g. SearchBar uses it to fetch
    // /search-index.json at the correct path in both dev and production).
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
