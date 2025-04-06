/* global chrome */
export default function Token({
  address,
  addressData,
  ETH_LOGO_URL,
  Base_LOGO_URL,
}) {
  const data = Array.isArray(addressData) ? addressData[0] : addressData;

  console.log("iconUrl", data.details.basicInfo.iconUrl);
  const chainLogoUrl =
    addressData.chain === "ETHEREUM" ? ETH_LOGO_URL : Base_LOGO_URL;
  const iconUrl = data.details.basicInfo.iconUrl
    ? data.details.basicInfo.iconUrl
    : "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/unknown_logo.svg";
  const handleClose = () => {
    chrome.runtime.sendMessage({ action: "hideModal" });
  };

  const ampMap = {
    decrease_more:
      "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/decrease_more.png",
    decrease_less:
      "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/decrease_less.png",
    increase_more:
      "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/increase_more.png",
    increase_less:
      "https://bucket-kai-test.s3.ap-northeast-1.amazonaws.com/increase_less.png",
  };
  function getImageUrl(amplitude_class, direction_class) {
    const dir = direction_class.toLowerCase(); // 'increase' or 'decrease'
    const amp = amplitude_class.includes("more than") ? "more" : "less"; // 判斷幅度是 more 或 less
    const key = `${dir}_${amp}`; // 組合 key，如 'increase_more'

    return ampMap[key] || null; // 回傳對應圖片 URL，找不到就回傳 null
  }
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

      <div
        style={{
          borderRadius: "4px",
          wordBreak: "break-all",
          marginTop: "4px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: " #f3f5f6",
              padding: " 0px 4px",
              width: "45px",
              height: "45px",
              boxSizing: "border-box",
              marginBottom: "4px",
              borderRadius: "4px 0 0 0",
              marginRight: "5px",
            }}
          >
            <img
              src={chainLogoUrl}
              alt="Token icon"
              style={{
                width: "36px",
                height: "36px",
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: " #f3f5f6",
              padding: " 0px 4px",
              width: "175px",
              height: "45px",
              boxSizing: "border-box",
              marginBottom: "4px",
              borderRadius: "4px 0 0 0",
            }}
          >
            <p style={{ fontSize: "12px", margin: 0 }}>Symbol</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={iconUrl}
                alt="Token icon"
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "4px",
                }}
              />
              <span style={{ margin: 0 }}>
                {addressData?.details?.basicInfo.symbol}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-block",
            backgroundColor: " #f3f5f6",
            padding: " 0px 4px",
            width: "225px",
            boxSizing: "border-box",
            marginBottom: "4px",
            borderRadius: "4px 0 0 0",
            marginRight: "5px",
          }}
        >
          <p style={{ fontSize: "12px", margin: 0 }}>Name</p>
          <p style={{ margin: 0 }}>{addressData?.details?.basicInfo.name}</p>
        </div>

        <div
          style={{
            display: "inline-block",
            backgroundColor: " #f3f5f6",
            padding: " 0px 4px",
            width: "175px",
            boxSizing: "border-box",
            marginBottom: "4px",
            borderRadius: "0 4px 0 0",
            marginRight: "5px",
          }}
        >
          <p style={{ fontSize: "12px", margin: 0 }}>Price</p>
          <p style={{ margin: 0 }}> {addressData?.details?.basicInfo.price}</p>
        </div>
        <div
          style={{
            display: "inline-block",
            backgroundColor: " #f3f5f6",
            padding: " 0px 4px",
            width: "45px",
            boxSizing: "border-box",
            marginBottom: "4px",
            borderRadius: "0 4px 0 0",
          }}
        >
          <img
            src={getImageUrl(
              addressData?.details?.features.prediction.amplitude_class,
              addressData?.details?.features.prediction.direction_class
            )}
            style={{
              margin: 0,
              width: "36px",
              height: "36px",
              position: "relative",
              right: "2px",
              top: "2px",
            }}
          ></img>
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
