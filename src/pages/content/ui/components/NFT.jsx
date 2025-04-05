/* global chrome */

export default function Wallet({
  address,
  addressData,
  ETH_LOGO_URL,
  Base_LOGO_URL,
}) {
  console.log("content in data response box", address, addressData);
  const handleClose = () => {
    chrome.runtime.sendMessage({ action: "hideModal" });
  };
  const chainLogoUrl =
    addressData.chain === "ETHEREUM" ? ETH_LOGO_URL : Base_LOGO_URL;
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
        <h1 style={{ margin: "0", display: "inline" }}>
          {addressData.addressType}
        </h1>
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
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: " #f3f5f6",
              padding: " 0px 4px",
              width: "110px",
              boxSizing: "border-box",
              marginBottom: "4px",
              borderRadius: "4px 0 0 0",
              marginRight: "5px",
            }}
          >
            <p style={{ fontSize: "12px", margin: 0 }}>Chain</p>
            <img
              src={chainLogoUrl}
              alt={addressData?.chain}
              style={{
                width: "24px",
                height: "24px",
              }}
            />
          </div>
          <div
            style={{
              display: "inline-block",
              backgroundColor: " #f3f5f6",
              padding: " 0px 4px",
              width: "110px",
              boxSizing: "border-box",
              marginBottom: "4px",
              borderRadius: "0 4px 0 0",
            }}
          >
            <p style={{ fontSize: "12px", margin: 0 }}>Total</p>
            <p style={{ margin: 0 }}> {addressData?.details?.totalSupply}</p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: " #f3f5f6",
            padding: " 0px 4px",
            width: "225px",
            boxSizing: "border-box",
            marginBottom: "4px",
          }}
        >
          <p style={{ fontSize: "12px", margin: 0 }}>Name</p>
          <p style={{ margin: 0 }}>{addressData?.details?.name}</p>
        </div>

        <div
          style={{
            backgroundColor: " #f3f5f6",
            padding: " 0px 4px",
            width: "225px",
            boxSizing: "border-box",
            marginBottom: "4px",
            borderRadius: "0 0 4px 4px",
          }}
        >
          <p style={{ fontSize: "12px", margin: 0 }}>Address</p>
          <p style={{ margin: 0 }}>{address}</p>
        </div>
      </div>
    </div>
  );
}
