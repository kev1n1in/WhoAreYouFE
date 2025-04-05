/* global chrome */
import React, { useState } from "react";
import "@pages/popup/Popup.css";
import cyber_bg from "../../assets/cyber_bg.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import CyberTitle from "./CyberTitle";

const Popup = () => {
  const [ethAddress, setEthAddress] = useState("");
  const handleListening = () => {
    chrome.runtime.sendMessage({
      type: "OPEN_CONTENT",
      action: "popupClicked",
    });
  };
  const handleInputChange = (e) => {
    setEthAddress(e.target.value);
    // TODO send message to background script
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
      onClick={handleListening}
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
        <input
          type="text"
          placeholder="Enter Ethereum address"
          value={ethAddress}
          onChange={handleInputChange}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            width: "100%",
            marginTop: "4px",
          }}
        />
      </div>
    </div>
  );
};

export default Popup;
