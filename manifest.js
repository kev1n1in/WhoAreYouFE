import fs from "node:fs";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const manifest = {
  manifest_version: 3,

  name: "WhoAreYou",
  version: packageJson.version,
  description: "Web3 Address detection tool",
  permissions: ["storage", "sidePanel", "scripting", "activeTab", "tabs"],
  host_permissions: ["<all_urls>"],
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "logo_128.png",
  },

  icons: {
    128: "logo_128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      run_at: "document_end",
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "assets/statue.png",
        "assets/js/*.js",
        "assets/css/*.css",
        "logo_128.png",
        "assets/*",
      ],
      matches: ["*://*/*", "file:///*"],
    },
  ],
};

export default manifest;
