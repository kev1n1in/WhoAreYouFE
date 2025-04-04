/* global chrome */
import { handleMessage } from "./utils/messageHandler.js";

chrome.runtime.onMessage.addListener(handleMessage);

console.log("background.js is ready.");
console.log("listening for messages...");
