import { createRoot } from "react-dom/client";
import App from "@pages/content/ui/app";
import injectedStyle from "./injected.css?inline";

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";

document.body.append(root);

const rootIntoShadow = document.createElement("div");
rootIntoShadow.id = "shadow-root";

const shadowRoot = root.attachShadow({ mode: "open" });
shadowRoot.appendChild(rootIntoShadow);

/** Inject styles into shadow dom */
const styleElement = document.createElement("style");
styleElement.innerHTML = injectedStyle;
shadowRoot.appendChild(styleElement);

createRoot(rootIntoShadow).render(<App />);
