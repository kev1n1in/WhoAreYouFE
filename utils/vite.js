import makeManifest from "./plugins/make-manifest";
import inlineVitePreloadScript from "./plugins/inline-vite-preload-script";

export const getPlugins = () => [
  makeManifest({ getCacheInvalidationKey }),
  regenerateCacheInvalidationKey(),
  inlineVitePreloadScript(),
];

const cacheInvalidationKeyRef = { current: generateKey() };

export function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}

function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey() {
  return `${Date.now().toFixed()}`;
}
