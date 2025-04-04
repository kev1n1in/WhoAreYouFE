class ManifestParser {
  constructor() {}

  static convertManifestToString(manifest) {
    if (process.env.__FIREFOX__) {
      manifest = this.convertToFirefoxCompatibleManifest(manifest);
    }
    return JSON.stringify(manifest, null, 2);
  }

  static convertToFirefoxCompatibleManifest(manifest) {
    const manifestCopy = {
      ...manifest,
    };

    manifestCopy.background = {
      scripts: [manifest.background?.service_worker],
      type: "module",
    };
    manifestCopy.options_ui = {
      page: manifest.options_page,
      browser_style: false,
    };
    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'",
    };
    delete manifestCopy.options_page;
    return manifestCopy;
  }
}

export default ManifestParser;
