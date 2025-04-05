/* global chrome */

export default function Wallet({ address, addressData, interactionsData }) {
  console.log(
    "content in data response box",
    address,
    addressData,
    interactionsData
  );
  // Conditional rendering based on contract
  const hasInteracted = interactionsData?.details?.interacted;
  console.log("hasInteracted", hasInteracted);
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
          {/* {!hasInteracted && (
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
          )} */}

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
        {hasInteracted && (
          <div>
            <div
              style={{
                borderRadius: "4px",
                wordBreak: "break-all",
              }}
            >
              <p
                style={{
                  color: "green",
                  backgroundColor: " #f3f5f6",
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                }}
              >
                Have interacted {interactionsData?.details?.interactionCount}{" "}
                times before
              </p>
            </div>
            <div
              style={{
                borderRadius: "4px",
                wordBreak: "break-all",
              }}
            >
              <a
                href={`https://etherscan.io/tx/${address}`}
                target="_blank"
                style={{
                  backgroundColor: " #f3f5f6",
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                  textDecoration: "none",
                }}
              >
                {interactionsData?.details?.lastInteractionHash}
              </a>
            </div>
            <div
              style={{
                borderRadius: "4px",
                wordBreak: "break-all",
              }}
            >
              <p
                style={{
                  backgroundColor: " #f3f5f6",
                  margin: "4px 10px 4px 0",
                  padding: "0 4px",
                }}
              >
                {interactionsData?.details?.lastTimestamp
                  ? new Date(
                      interactionsData.details.lastTimestamp * 1000
                    ).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
