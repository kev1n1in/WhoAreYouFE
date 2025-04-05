const Wallet = ({ wallet, ETH_LOGO_URL, Base_LOGO_URL, featureMap }) => {
  console.log("wallet", wallet);
  const hasInteractions = wallet?.details?.interaction?.interacted === true;
  const interactedBefore = hasInteractions ? "Yes" : "No";
  const textColor = hasInteractions ? "green" : "red";
  const chainLogoUrl =
    wallet?.chain === "ETHEREUM" ? ETH_LOGO_URL : Base_LOGO_URL;
  const anomalyAccount = wallet?.details?.anomalyDetection;

  const divStyle = {
    backgroundColor: "#f3f5f6",
    padding: "0px 4px",
    width: "225px",
    boxSizing: "border-box",
    marginBottom: "4px",
  };

  return (
    <div>
      <div style={divStyle}>
        <p style={{ fontSize: "12px", margin: 0 }}>Chain</p>
        <p style={{ margin: 0, display: "inline" }}>
          {wallet?.chain || "Unknown"}
        </p>
        <img src={chainLogoUrl} style={{ width: "12px", height: "12px" }} />
      </div>

      {hasInteractions ? (
        <>
          <div style={divStyle}>
            <p style={{ margin: 0, fontSize: "12px" }}>Interacted?</p>
            <p style={{ margin: 0, color: textColor }}>{interactedBefore}</p>
          </div>

          <div style={divStyle}>
            <p style={{ margin: 0, fontSize: "12px" }}>Times?</p>
            <p style={{ margin: 0, color: textColor }}>
              {wallet?.details?.interaction?.interactionCount || 0}
            </p>
          </div>

          <div
            style={{
              ...divStyle,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px" }}>
              Latest interaction record
            </p>
            <a
              href={`https://etherscan.io/tx/${wallet?.details?.interaction?.lastInteractionHash}`}
              style={{
                margin: 0,
                textDecoration: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                whiteSpace: "nowrap",
                maxWidth: "215px",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {wallet?.details?.interaction?.lastInteractionHash || "N/A"}
            </a>
          </div>

          <div style={divStyle}>
            <p style={{ margin: 0, fontSize: "12px" }}>
              Latest interaction date
            </p>
            <p style={{ margin: 0 }}>
              {wallet?.details?.interaction?.lastTimestamp
                ? new Date(
                    wallet?.details?.interaction?.lastTimestamp * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </>
      ) : (
        <div style={divStyle}>
          <p style={{ margin: 0, fontSize: "12px" }}>Interacted?</p>
          <p style={{ margin: 0, color: "red" }}>No</p>
        </div>
      )}

      {anomalyAccount && (
        <div style={divStyle}>
          <p style={{ margin: 0, fontSize: "12px" }}>Top 3 Anomaly Features</p>
          <p style={{ margin: 0, color: textColor }}>
            {featureMap[wallet?.details?.anomalyDetection.top_3_features[0]] ||
              wallet?.details?.anomalyDetection.top_3_features[0]}
          </p>
          <p style={{ margin: 0, color: textColor }}>
            {featureMap[wallet?.details?.anomalyDetection.top_3_features[1]] ||
              wallet?.details?.anomalyDetection.top_3_features[1]}
          </p>
          <p style={{ margin: 0, color: textColor }}>
            {featureMap[wallet?.details?.anomalyDetection.top_3_features[2]] ||
              wallet?.details?.anomalyDetection.top_3_features[2]}
          </p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
