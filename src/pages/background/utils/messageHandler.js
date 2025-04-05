/* global chrome */

import {
  tabContentScriptStatus,
  sendTabMessage,
  triggerListening,
  fetchAddressData,
  fetchInteractions,
} from "./tabManager.js";

export function handleMessage(request, sender, sendResponse) {
  const tabId = sender?.tab?.id;

  switch (request.action) {
    case "hideModal":
      if (tabId) {
        sendTabMessage(tabId, { action: "hideModal" });
        sendResponse({ received: true });
      }
      break;

    case "resendMessage":
      if (request.originalMessage) {
        console.log("處理重發的消息:", request.originalMessage.action);
        if (tabId) {
          sendTabMessage(tabId, request.originalMessage);
        }
        sendResponse({ received: true });
      }
      break;

    case "contentScriptReady":
      if (tabId) {
        tabContentScriptStatus[tabId] = {
          ready: true,
          mounted: false,
          fullyReady: false,
        };
        sendResponse({ received: true });
      }
      break;

    case "contentScriptPartiallyReady":
      if (tabId) {
        if (!tabContentScriptStatus[tabId]) {
          tabContentScriptStatus[tabId] = {
            ready: true,
            vueMounted: false,
            fullyReady: false,
            partiallyReady: true,
          };
        } else {
          tabContentScriptStatus[tabId].partiallyReady = true;
        }
        sendResponse({ received: true });
      }
      break;

    case "appMounted":
      if (tabId) {
        console.log(`標籤頁 ${tabId} 的App.vue已掛載`);
        if (tabContentScriptStatus[tabId]) {
          tabContentScriptStatus[tabId].vueMounted = true;
        } else {
          tabContentScriptStatus[tabId] = {
            ready: true,
            vueMounted: true,
            fullyReady: false,
          };
        }
        sendResponse({ received: true });
      }
      break;

    case "contentScriptFullyReady":
      if (tabId) {
        console.log(`標籤頁 ${tabId} 的content script已完全就緒`);
        tabContentScriptStatus[tabId] = {
          ready: true,
          vueMounted: true,
          fullyReady: true,
        };
        sendResponse({ received: true });
      }
      break;

    case "popupClicked":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
          console.error("未找到活動標籤頁");
          return;
        }

        const activeTabId = tabs[0].id;
        // 檢查content script的狀態
        const contentScriptStatus = tabContentScriptStatus[activeTabId] || {
          ready: false,
          vueMounted: false,
          fullyReady: false,
        };
        console.log(`當前標籤頁的content script狀態:`, contentScriptStatus);

        // 不論狀態如何，都直接嘗試顯示Modal
        triggerListening(activeTabId);
      });
      break;

    case "showModalFromContent":
      // 轉發給當前標籤頁的content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          sendTabMessage(tabs[0].id, { action: "showModal" });
        }
      });
      break;

    case "addressFoundFromContent":
      // 轉發給當前標籤頁的content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          sendTabMessage(tabs[0].id, {
            action: "updateAddress",
            address: request.address,
          });
        }
      });
      break;

    case "addressEvent":
      // Forward the address event message to the content script
      if (request.address && request.eventType) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs.length > 0) {
              sendTabMessage(tabs[0].id, {
                action: "addressEvent",
                address: request.address,
                eventType: request.eventType,
              });
            }
          }
        );
      }
      sendResponse({ status: "received" });
      break;

    case "fetchAddressData":
      if (request.address) {
        console.log(
          "Background script received request to fetch address data:",
          request.address
        );
        fetchAddressData(request.address)
          .then((data) => {
            // 詳細記錄獲取到的數據
            console.log("fetchAddressData 返回的原始數據:", data);
            console.log(
              "數據類型:",
              typeof data,
              Array.isArray(data) ? "是數組" : "不是數組"
            );
            if (Array.isArray(data)) {
              console.log("數組長度:", data.length);
              if (data.length > 0) {
                console.log("第一個元素:", data[0]);
              }
            }

            // Send the fetched data back to the content script if needed
            if (tabId) {
              console.log(
                "發送 addressDataFetched 消息到 content script, 數據:",
                data
              );
              sendTabMessage(tabId, {
                action: "addressDataFetched",
                address: request.address,
                data: data,
              });
            }
            sendResponse({ status: "success", data: data });
          })
          .catch((error) => {
            console.error("Error in fetchAddressData:", error);
            sendResponse({ status: "error", error: error.message });
          });

        fetchInteractions(request.address, request.selfAddress)
          .then((data) => {
            console.log("Interactions data response:", data);
            // Send the interactions data back to the content script
            if (tabId) {
              sendTabMessage(tabId, {
                action: "interactionsDataFetched",
                address: request.address,
                data: data,
              });
            }
          })
          .catch((error) => {
            console.error("Error in fetchInteractions:", error);
          });

        // Return true to indicate we will send the response asynchronously
        return true;
      }
      break;

    default:
      console.log(`未處理的消息類型: ${request.action}`);
      break;
  }

  return true;
}
