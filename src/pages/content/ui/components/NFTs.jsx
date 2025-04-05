/* global chrome */

export default function Wallet({ address, addressData }) {
  console.log("content in data response box", address, addressData);
  const handleClose = () => {
    chrome.runtime.sendMessage({ action: "hideModal" });
  };
  return (
    <div
      style={{
        position: "fixed",
        paddingBottom: "10px",
        paddingLeft: "20px",
        bottom: 0,
        right: 0,
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
      </div>
      <div>
        <h1 style={{ margin: "0" }}>NFT</h1>
      </div>
      <div>
        <img
          src={addressData?.details?.imageUrl}
          alt={addressData?.details?.name}
          style={{
            width: "225px",
            height: "225px",
          }}
        />
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
          Name: {addressData?.details?.name}
        </p>
        <p
          style={{
            backgroundColor: " #f3f5f6",
            margin: "4px 10px 4px 0",
            padding: "0 4px",
          }}
        >
          Total: {addressData?.details?.totalSupply}
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
  );
}
