import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getCacheInvalidationKey, getPlugins } from "./utils/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");
const pagesDir = resolve(srcDir, "pages");

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProduction = !isDev;

  return {
    resolve: {
      alias: {
        "@root": rootDir,
        "@src": srcDir,
        "@assets": resolve(srcDir, "assets"),
        "@pages": pagesDir,
      },
    },
    define: {
      chrome: "chrome",
    },
    plugins: [...getPlugins(isDev), react()],
    publicDir: resolve(rootDir, "public"),
    build: {
      outDir: resolve(rootDir, "dist"),
      /** Can slow down build speed. */
      // sourcemap: isDev,
      minify: isProduction,
      modulePreload: false,
      reportCompressedSize: isProduction,
      emptyOutDir: !isDev,
      rollupOptions: {
        input: {
          contentUI: resolve(pagesDir, "content", "ui", "index.js"),
          contentUIInjected: resolve(pagesDir, "content", "ui", "injected.css"),
          background: resolve(pagesDir, "background", "index.js"),
          content: resolve(pagesDir, "content", "index.js"),
          contentStyle: resolve(pagesDir, "content", "style.scss"),
          popup: resolve(pagesDir, "popup", "index.html"),
        },
        output: {
          entryFileNames: "src/pages/[name]/index.js",
          chunkFileNames: isDev
            ? "assets/js/[name].js"
            : "assets/js/[name].[hash].js",
          assetFileNames: (assetInfo) => {
            const { name } = path.parse(assetInfo.name);
            const assetFileName =
              name === "contentStyle"
                ? `${name}${getCacheInvalidationKey()}`
                : name;
            return `assets/[ext]/${assetFileName}.chunk.[ext]`;
          },
        },
      },
    },
  };
});
