/* global chrome */
import { useEffect, useState } from "react";
import Token from "./components/Token";
import Font from "./components/Font";
import NFT from "./components/NFT";
import Loading from "./components/Loading";
import Wallets from "./components/Wallets/Wallets";

export default function Modal() {
  const [isVisible, setIsVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [displayMode, setDisplayMode] = useState("loading");
  const [addressData, setAddressData] = useState(null);
  const [interactionsData, setInteractionsData] = useState(null);
  const ETH_LOGO_URL =
    "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/Ethereum_Network_logo.svg";
  const Base_LOGO_URL =
    "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/Base_Network_Logo.svg";

  const setDisplayModeByAddressType = (data) => {
    if (!data) return;

    const targetData = Array.isArray(data) ? data[0] : data;

    if (!targetData.addressType) return;

    switch (targetData.addressType) {
      case "ERC-20":
        setDisplayMode("token");
        break;
      case "ERC-721":
      case "ERC-1155":
        setDisplayMode("nfts");
        break;
      case "EOA":
        setDisplayMode("wallet");
        break;
      default:
        setDisplayMode("loading");
        break;
    }
  };
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

        case "addressEvent":
          setDisplayMode("loading");
          sendResponse({
            status: "handled",
            message: "獲得監聽事件",
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

        case "addressDataFetched":
          setDisplayMode("loading");
          if (request.data) {
            console.log("收到的原始數據:", request.data.data);

            setAddressData(
              request.data.data.length === 1
                ? request.data.data[0]
                : request.data.data
            );
            setDisplayModeByAddressType(request.data.data);
          }
          break;

        case "interactionsDataFetched":
          if (request.data) {
            setInteractionsData(request.data.data);
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
            ></div>
            {displayMode === "wallet" && (
              <Wallets
                address={address}
                addressData={addressData}
                interactionsData={interactionsData}
                ETH_LOGO_URL={ETH_LOGO_URL}
                Base_LOGO_URL={Base_LOGO_URL}
              />
            )}
            {displayMode === "token" && (
              <Token
                address={address}
                addressData={addressData}
                ETH_LOGO_URL={ETH_LOGO_URL}
                Base_LOGO_URL={Base_LOGO_URL}
              />
            )}
            {displayMode === "nfts" && (
              <NFT
                address={address}
                addressData={addressData}
                ETH_LOGO_URL={ETH_LOGO_URL}
                Base_LOGO_URL={Base_LOGO_URL}
              />
            )}
            {displayMode === "loading" && <Loading />}
          </div>
        )}
      </div>
    </Font>
  );
}
