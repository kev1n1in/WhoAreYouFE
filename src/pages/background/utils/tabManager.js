/* global chrome */
export const tabContentScriptStatus = {};

//trigger listening
function triggerListening(tabId) {
  chrome.scripting
    .executeScript({ target: { tabId }, func: triggerMouseOver })
    .then(() => console.log("mouseover decting"))
    .catch((error) =>
      console.error("mouseover detection script failed:", error)
    );
}

function setupTabListeners() {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    triggerListening(activeInfo.tabId);
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
      triggerListening(tabId);
    }
  });
}

function triggerMouseOver() {
  console.log("ethereum address detecting");
  const ETH_ADDRESS_REGEX = /\b0x[a-fA-F0-9]{40}\b/g;

  try {
    try {
      chrome.runtime.sendMessage(
        { action: "showModalFromContent" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log(
              "發送showModalFromContent消息失敗:",
              chrome.runtime.lastError
            );
          } else {
            console.log("發送showModalFromContent消息成功", response);
          }
        }
      );
    } catch (error) {
      console.error("發送showModal消息時出錯:", error);
    }

    // 深度搜索元素中的以太坊地址
    function findEthAddressInElement(element) {
      // 如果元素不存在或已經檢查過，則退出
      if (!element || element._ethAddressChecked) return null;

      // 標記元素已檢查，避免重複檢查
      element._ethAddressChecked = true;

      // 首先檢查元素的文本內容
      if (element.textContent) {
        const matches = element.textContent.match(ETH_ADDRESS_REGEX);
        if (matches) return matches[0];
      }

      // 檢查元素的所有屬性
      const attributesToCheck = [
        "href",
        "data-address",
        "value",
        "placeholder",
        "data-clipboard-text",
        "data-highlight-target",
        "data-bs-html",
        "title",
      ];

      for (const attr of attributesToCheck) {
        if (element.hasAttribute(attr)) {
          const attrValue = element.getAttribute(attr);
          const matches = attrValue.match(ETH_ADDRESS_REGEX);
          if (matches) return matches[0];
        }
      }

      return null;
    }

    document.addEventListener("mouseover", function (event) {
      const targetElement = event.target;
      try {
        const addressFound = findEthAddressInElement(targetElement);

        if (addressFound) {
          try {
            chrome.runtime.sendMessage({
              action: "fetchAddressData",
              address: addressFound,
            });
          } catch (error) {
            console.error("Failed to send fetch request message:", error);
          }

          try {
            chrome.runtime.sendMessage({
              action: "addressEvent",
              eventType: "hover",
              address: addressFound,
            });
          } catch (error) {
            console.error("Failed to send address event message:", error);
          }

          try {
            console.log("嘗試通過消息更新地址");
            chrome.runtime.sendMessage(
              {
                action: "addressFoundFromContent",
                address: addressFound,
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.log(
                    "發送地址更新消息失敗:",
                    chrome.runtime.lastError
                  );
                }
              }
            );
          } catch (error) {
            console.error("更新地址時出錯:", error);
          }

          targetElement.addEventListener(
            "mouseleave",
            function () {
              console.log("滑鼠離開區塊鏈地址元素");

              // 清除標記，允許再次檢測
              setTimeout(() => {
                targetElement._ethAddressChecked = false;
              }, 2000);
            },
            { once: true }
          );
        }
      } catch (error) {
        console.error("mouseover事件處理出錯:", error);
      }
    });
    document.addEventListener("copy", function () {
      console.log("copy event detected");
      const selectedText = window.getSelection().toString();
      const matches = selectedText.match(ETH_ADDRESS_REGEX);
      let foundAddress = null;

      if (matches) {
        foundAddress = matches;
        console.log("Detected ETH address in copied text:", foundAddress);

        try {
          chrome.runtime.sendMessage({
            action: "fetchAddressData",
            address: foundAddress[0],
          });
        } catch (error) {
          console.error("Failed to send fetch request message:", error);
        }

        try {
          chrome.runtime.sendMessage({
            action: "addressEvent",
            eventType: "copy",
            address: foundAddress[0],
          });
        } catch (error) {
          console.error("Failed to send address event message:", error);
        }
      }

      if (foundAddress) {
        console.log("直接指向區塊鏈地址:", foundAddress);
        const address = foundAddress[0];
        if (!address) return;

        try {
          console.log("嘗試通過消息更新地址");
          chrome.runtime.sendMessage(
            {
              action: "addressFoundFromContent",
              address: address,
            },
            () => {
              if (chrome.runtime.lastError) {
                console.log("發送地址更新消息失敗:", chrome.runtime.lastError);
              }
            }
          );
        } catch (error) {
          console.error("更新地址時出錯:", error);
        }
      }
    });
  } catch (outerError) {
    console.error("triggerMouseOver主函數出錯:", outerError);
  }

  return true;
}
//content script checking
function detectTab(tabId, message) {
  try {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: detectContentScript,
      })
      .then(() => {
        setTimeout(() => {
          console.log(`重試發送消息 "${message.action}"...`);
        }, 3000);
      })
      .catch((error) => {
        console.error("注入檢查腳本時出錯:", error);
      });
  } catch (error) {
    console.error("使用scripting API時出錯:", error);
  }
}
function detectContentScript() {
  if (window.__contentScriptLoaded) {
    return;
  }
  window.__contentScriptLoaded = true;

  sendReadyMessage();
}
function sendReadyMessage() {
  chrome.runtime.sendMessage({ action: "contentScriptReady" }, () => {
    if (chrome.runtime.lastError)
      console.error("Message failed:", chrome.runtime.lastError.message);
  });
}
//send message to tab and update address
function sendTabMessage(tabId, message) {
  try {
    console.log(`sending message to ${tabId} "${message.action}"`);

    chrome.tabs.get(tabId, function () {
      if (chrome.runtime.lastError) {
        console.error(`tab ${tabId} does not exist:`, chrome.runtime.lastError);
        return;
      }

      chrome.tabs.sendMessage(tabId, message, function (response) {
        if (chrome.runtime.lastError) {
          console.error(
            `send message to ${tabId} ${message.action} failed:`,
            chrome.runtime.lastError
          );

          if (message.action === "updateAddress") {
            detectTab(tabId, message);
          }
        } else {
          console.log(
            `end message to ${tabId} ${message.action} successfully`,
            response
          );
        }
      });
    });
  } catch (error) {
    console.error(`failed to send message to ${tabId} :`, error);
  }
}

async function fetchAddressData(address) {
  const selfAddress = await getSelfAddress();
  try {
    const response = await fetch(
      `https://whoareyou.name/api/1.0/address/${address}?selfAddress=${selfAddress}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Address data response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching address data:", error);
    return { error: error.message };
  }
}

async function getSelfAddress() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["selfAddress"], (result) => {
      resolve(result.selfAddress || "");
    });
  });
}

// async function fetchInteractions(address) {
//   console.log("fetching interactions for address:", address);

//   const selfAddress = await getSelfAddress();
//   console.log("selfAddress:", selfAddress);

//   try {
//     const response = await fetch(
//       `https://whoareyou.name/api/1.0/address/${address}?selfAddress=${selfAddress}`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log("Interactions data response:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching interactions:", error);
//     return { error: error.message };
//   }
// }
export {
  sendTabMessage,
  triggerListening,
  fetchAddressData,
  getSelfAddress,
  setupTabListeners,
};
