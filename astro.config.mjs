import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import netlify from "@astrojs/netlify";

// Pages are prerendered (static, fast). Only /api/* runs on the server.
// On Netlify (preview hosting) the API runs as Netlify Functions; elsewhere as a Node server.
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || "https://www.artmegraphics.com",
  output: "static",
  adapter: process.env.NETLIFY ? netlify() : node({ mode: "standalone" }),
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  vite: { build: { assetsInlineLimit: 4096 } }
});
