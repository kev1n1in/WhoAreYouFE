/* global chrome */
import React, { useState, useEffect } from "react";
import CyberTitle from "./CyberTitle";
import cyber_bg from "../../assets/cyber_bg.jpg";
import "@pages/popup/Popup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const Popup = () => {
  const [ethAddress, setEthAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddress, setSavedAddress] = useState("");

  // 在組件加載時檢查是否已保存地址
  useEffect(() => {
    chrome.storage.local.get(["selfAddress"], (result) => {
      if (result.selfAddress) {
        setSavedAddress(result.selfAddress);
        setAddressSaved(true);
        // 已有保存的地址，直接開始監聽
        handleListening();
      }
    });
  }, []);

  const handleListening = () => {
    chrome.runtime.sendMessage({
      type: "OPEN_CONTENT",
      action: "popupClicked",
    });
  };

  const handleInputChange = (e) => {
    const address = e.target.value;
    setEthAddress(address);
  };

  // 地址提交函數
  const handleSubmit = (e) => {
    console.log("handleSubmit");
    e.preventDefault();

    if (ethAddress) {
      // 確保地址格式正確
      const ETH_ADDRESS_REGEX = /\b0x[a-fA-F0-9]{40}\b/g;
      if (ETH_ADDRESS_REGEX.test(ethAddress)) {
        // 保存地址到 storage 中
        chrome.storage.local.set({ selfAddress: ethAddress }, () => {
          console.log("Address submitted and saved:", ethAddress);
          setSavedAddress(ethAddress);
          setAddressSaved(true);

          // 成功保存地址後，觸發背景腳本開始監聽
          handleListening();
        });
      } else {
        alert("Please enter a valid Ethereum address");
      }
    }
  };

  // 重置函數，允許用戶重新輸入地址
  const handleReset = (e) => {
    e.stopPropagation();
    setAddressSaved(false);
    setEthAddress("");
  };

  return (
    <div
      className="container m-0"
      style={{
        position: "relative",
        backgroundImage: `url(${cyber_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "540px",
        height: " 275px",
      }}
    >
      <CyberTitle />
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "10px",
          padding: "0 10px",
          width: "500px",
          height: "100px",
          borderRadius: "24px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          color: "white",
        }}
      >
        <ul
          style={{ listStyle: "none", marginBottom: "4px", paddingLeft: "4px" }}
        >
          <li>
            <span style={{ display: "inline-block", width: "20px" }}>1.</span>{" "}
            Enter your address
          </li>
          <li>
            <span style={{ display: "inline-block", width: "20px" }}>2.</span>{" "}
            Hover or Copy the address
          </li>
          <li>
            <span style={{ display: "inline-block", width: "20px" }}>3.</span>{" "}
            See the result
          </li>
        </ul>

        {!addressSaved ? (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Enter Ethereum address"
              value={ethAddress}
              onChange={handleInputChange}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                width: "80%",
                marginTop: "4px",
              }}
            />
            <button
              type="submit"
              style={{
                width: "20%",
                marginTop: "4px",
                marginLeft: "5px",
                backgroundColor: "#ca3ee3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </form>
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              marginTop: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                backgroundColor: "rgba(202, 62, 227, 0.2)",
                padding: "8px",
                borderRadius: "4px",
                width: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Your address: {savedAddress}
            </div>
            <button
              onClick={handleReset}
              style={{
                width: "20%",
                marginLeft: "5px",
                backgroundColor: "#ca3ee3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 0",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
