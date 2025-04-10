import * as fs from "fs";
import * as path from "path";
import ManifestParser from "../manifest-parser";
import url from "url";
import * as process from "process";

const { resolve } = path;

const rootDir = resolve(__dirname, "..", "..");
const distDir = resolve(rootDir, "dist");
const manifestFile = resolve(rootDir, "manifest.js");

// 添加 colorLog 函數
function colorLog(message, type) {
  const color =
    type === "success"
      ? "\x1b[32m%s\x1b[0m"
      : type === "info"
      ? "\x1b[34m%s\x1b[0m"
      : type === "error"
      ? "\x1b[31m%s\x1b[0m"
      : type === "warning"
      ? "\x1b[33m%s\x1b[0m"
      : "\x1b[0m%s\x1b[0m";
  console.log(color, message);
}

const getManifestWithCacheBurst = () => {
  const withCacheBurst = (path) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === "win32") {
    return import(withCacheBurst(url.pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
};

export default function makeManifest(config) {
  function makeManifest(manifest, to, cacheKey) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");
    if (cacheKey && manifest.content_scripts) {
      // Naming change for cache invalidation
      manifest.content_scripts.forEach((script) => {
        script.css &&= script.css.map((css) => css.replace("<KEY>", cacheKey));
      });
    }

    fs.writeFileSync(
      manifestPath,
      ManifestParser.convertManifestToString(manifest)
    );

    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }

  return {
    name: "make-manifest",
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const invalidationKey = config?.getCacheInvalidationKey?.();
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, distDir, invalidationKey);
    },
  };
}
