import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// Pages are prerendered (static, fast). Only /api/* runs on the server.
export default defineConfig({
  site: "https://www.artmegraphics.com",
  output: "static",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  vite: { build: { assetsInlineLimit: 4096 } }
});
