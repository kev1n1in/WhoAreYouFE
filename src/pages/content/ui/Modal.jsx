/* global chrome */
import { useEffect, useState } from "react";
import Wallet from "./components/Wallet";
import Token from "./components/Token";
import Font from "./components/Font";
import NFTs from "./components/NFTs";

export default function Modal() {
  const [isVisible, setIsVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [displayMode, setDisplayMode] = useState("wallet");
  const [addressData, setAddressData] = useState(null);

  const sendMessageWithRetry = (message, callback) => {
    const trySend = () => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.log("發送消息失敗，重試中...:", chrome.runtime.lastError);
          } else {
            if (callback) callback(response);
          }
        });
      } catch (error) {
        console.error("發送消息時出錯:", error);
        if (callback) callback(null, error);
      }
    };

    trySend();
  };

  useEffect(() => {
    window.chromeExtensionReactAppReady = true;
    window.chromeExtensionReactMounted = true;
    window.chromeExtensionReactFullyReady = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case "hideModal":
          setIsVisible(false);
          sendResponse({
            status: "handled",
            message: "已隱藏內容",
            state: {
              ready: true,
              mounted: true,
              fullyReady: true,
            },
          });
          return true;

        case "updateAddress":
          if (request.address) {
            setIsVisible(true);
            setAddress(request.address);
            sendResponse({
              status: "handled",
              message: "已更新地址",
              state: {
                ready: true,
                mounted: true,
                fullyReady: true,
              },
            });
            return true;
          }
          break;

        case "setDisplayMode":
          if (request.mode) {
            setDisplayMode(request.mode);
            sendResponse({
              status: "handled",
              message: "已更新顯示模式",
              state: {
                ready: true,
                mounted: true,
                fullyReady: true,
              },
            });
            return true;
          }
          break;

        case "backgroundReady":
          sendResponse({
            status: "received",
            state: {
              ready: true,
              mounted: true,
              fullyReady: true,
            },
          });
          return true;

        case "addressDataFetched":
          if (request.data) {
            console.log("Received address data from background:", request.data);
            setAddressData(request.data);
            sendResponse({
              status: "handled",
              message: "已接收地址數據",
              state: {
                ready: true,
                mounted: true,
                fullyReady: true,
              },
            });
            return true;
          }
          break;
      }

      sendResponse({
        status: "pending",
        message: "React應用尚未準備好，消息已存儲",
        state: {
          ready: true,
          mounted: true,
          fullyReady: true,
        },
      });
      return true;
    });

    const checkBackgroundReady = () => {
      sendMessageWithRetry(
        { action: "contentScriptReady" },
        (response, error) => {
          if (error) {
            console.log("發送初始就緒消息失敗，重試中...:", error);
          } else {
            console.log("content script 已發送初始就緒消息");
            // setIsBackgroundReady(true);
          }
        }
      );
    };

    checkBackgroundReady();
  }, []);

  const handleCloseClick = () => {
    setIsVisible(false);
    sendMessageWithRetry({ action: "hideModal" });
  };

  const handleModeSwitch = (mode) => {
    setDisplayMode(mode);
  };

  return (
    <Font>
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCloseClick}
          style={{
            position: "absolute",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 10002,
          }}
        >
          X
        </button>

        {isVisible && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              transform: "translate(-50%, -50%)",
              zIndex: 10001,
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                zIndex: 10002,
              }}
            >
              <button
                onClick={() => handleModeSwitch("wallet")}
                style={{
                  padding: "5px 10px",
                  marginRight: "10px",
                  backgroundColor:
                    displayMode === "wallet" ? "#f0f0f0" : "transparent",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Wallet
              </button>
              <button
                onClick={() => handleModeSwitch("token")}
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    displayMode === "token" ? "#f0f0f0" : "transparent",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Token
              </button>
              <button
                onClick={() => handleModeSwitch("nfts")}
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    displayMode === "token" ? "#f0f0f0" : "transparent",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                NFTs
              </button>
            </div>
            {displayMode === "wallet" && (
              <Wallet address={address} addressData={addressData} />
            )}
            {displayMode === "token" && (
              <Token address={address} addressData={addressData} />
            )}
            {displayMode === "nfts" && (
              <NFTs address={address} addressData={addressData} />
            )}
          </div>
        )}
      </div>
    </Font>
  );
}
