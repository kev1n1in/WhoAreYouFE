/* global chrome */

export default function Wallet({ address, addressData }) {
  console.log("content in data response box", address, addressData);
  // Conditional rendering based on contract
  const handleClose = () => {
    chrome.runtime.sendMessage({ action: "hideModal" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        paddingLeft: "20px",
        paddingBottom: "10px",
        width: "250px",
        minHeight: "300px",
        backgroundColor: "white",
        border: "2px solid black",
        borderRadius: 0,
        zIndex: 1000,
        color: "black",
        fontFamily: "Orbitron, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "10px",
          justifyContent: "space-between",
          padding: "5px 10px",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            fontWeight: "bold",
            backgroundColor: "transparent",
            border: "none",
            color: "black",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          X
        </button>
      </div>
      <h1 style={{ margin: "0" }}>Wallet</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            borderRadius: "4px",
            wordBreak: "break-all",
          }}
        >
          {addressData && addressData.isSuspicious && (
            <p
              style={{
                color: "red",
                backgroundColor: " #f3f5f6",
                margin: "4px 10px 4px 0",
                padding: "0 4px",
              }}
            >
              Suspicious account
            </p>
          )}

          {addressData && addressData.hasInteracted && (
            <p
              style={{
                color: "green",
                backgroundColor: " #f3f5f6",
                margin: "4px 10px 4px 0",
                padding: "0 4px",
              }}
            >
              Have interacted before
            </p>
          )}

          <div
            style={{
              borderRadius: "4px",
              wordBreak: "break-all",
              color: "black",
            }}
          >
            {addressData && addressData.name && (
              <p
                style={{
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                  backgroundColor: " #f3f5f6",
                }}
              >
                {addressData.name}
              </p>
            )}
          </div>

          {address && (
            <div
              style={{
                borderRadius: "4px",
                wordBreak: "break-all",
                color: "black",
                backgroundColor: " #f3f5f6",
                marginRight: "10px",
              }}
            >
              <p
                style={{
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Address：
              </p>
              <p
                style={{
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                  fontSize: "12px",
                }}
              >
                {address}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
