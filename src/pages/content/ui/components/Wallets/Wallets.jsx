/* global chrome */
import Wallet from "./wallet";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export default function Wallets({
  addressData,
  interactionsData,
  ETH_LOGO_URL,
  Base_LOGO_URL,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasInteracted = interactionsData?.details?.interacted;
  const hasMoreAddress = addressData.length > 1;
  console.log("hasInteracted", hasInteracted);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

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
        <h1 style={{ margin: "0", display: "inline" }}>
          {addressData[0].addressType}
        </h1>
      </div>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {addressData.map((wallet) => (
            <div className="embla__slide" key={wallet.name}>
              <Wallet
                wallet={wallet}
                ETH_LOGO_URL={ETH_LOGO_URL}
                Base_LOGO_URL={Base_LOGO_URL}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMoreAddress && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          {addressData.map((_, index) => (
            <div
              key={index}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: index === selectedIndex ? "#4a4a4a" : "#ccc",
                margin: "0 4px",
                cursor: "pointer",
              }}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
