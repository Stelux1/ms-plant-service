import { defineConfig } from "vite";

// Plain static site. index.html lives in site/; everything in site/public/
// (images, CSS, JS, 404, robots, sitemap) is copied to dist/ unchanged.
export default defineConfig({
  root: "site",
  publicDir: "public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
