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
function triggerMouseOver() {
  console.log("ethereum address detecting");
  const ETH_ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/g;

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
    document.addEventListener("mouseover", function (event) {
      const targetElement = event.target;
      try {
        let foundAddress = null;
        if (targetElement.childNodes) {
          for (const node of targetElement.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent) {
              const matches = node.textContent.match(ETH_ADDRESS_REGEX);
              if (matches) {
                foundAddress = matches;
                break;
              }
            }
          }
        }

        if (!foundAddress) {
          const directAttributes = [
            "href",
            "data-address",
            "value",
            "placeholder",
          ];
          for (const attr of directAttributes) {
            if (targetElement.hasAttribute(attr)) {
              const attrValue = targetElement.getAttribute(attr);

              if (
                (attr === "href" && targetElement.textContent === attrValue) ||
                (attr === "value" && targetElement.tagName === "INPUT") ||
                (attr === "placeholder" && targetElement.tagName === "INPUT")
              ) {
                const matches = attrValue.match(ETH_ADDRESS_REGEX);
                if (matches) {
                  foundAddress = matches;
                  break;
                }
              }
            }
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
            },
            { once: true }
          );
        }
      } catch (error) {
        console.error("mouseover事件處理出錯:", error);
      }
    });
    document.addEventListener("copy", function () {
      const selectedText = window.getSelection().toString();
      const matches = selectedText.match(ETH_ADDRESS_REGEX);
      let foundAddress = null;

      if (matches) {
        foundAddress = matches;
        console.log("Detected ETH address in copied text:", foundAddress);

        try {
          chrome.runtime.sendMessage({
            action: "fetchAddressData",
            address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
          });
        } catch (error) {
          console.error("Failed to send fetch request message:", error);
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

// Add a function to handle the fetch request in the background
function fetchAddressData(address) {
  console.log("Background script fetching data for address:", address);

  return fetch(`https://whoareyou.name/api/1.0/address/${address}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Address data response:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching address data:", error);
      return { error: error.message };
    });
}

export { sendTabMessage, triggerListening, fetchAddressData };
