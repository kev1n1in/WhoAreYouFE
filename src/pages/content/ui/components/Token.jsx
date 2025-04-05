/* global chrome */
export default function Token({ address, addressData }) {
  console.log("content in data response box", address, addressData);

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
      <h1 style={{ margin: "0" }}>Token</h1>

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "12px" }}>
              <img
                src={addressData?.details?.iconUrl}
                alt={addressData?.details?.name}
              />
            </div>
            <div>
              <p
                style={{
                  margin: "0",
                  fontSize: "24px",
                }}
              >
                {addressData?.details?.symbol}
              </p>
            </div>
          </div>
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
              Name：
            </p>
            <p
              style={{
                margin: "4px 10px 4px 0",
                padding: "0 4px",
                fontSize: "12px",
              }}
            >
              {addressData?.details?.name}
            </p>
          </div>
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
              Price：
            </p>
            <p
              style={{
                margin: "4px 10px 4px 0",
                padding: "0 4px",
                fontSize: "12px",
              }}
            >
              {addressData?.details?.price}
            </p>
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
