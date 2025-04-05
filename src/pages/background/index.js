/* global chrome */
import { handleMessage } from "./utils/messageHandler.js";
import { setupTabListeners } from "./utils/tabManager.js";

chrome.runtime.onMessage.addListener(handleMessage);

setupTabListeners();

console.log("background.js is ready.");
console.log("listening for messages...");
