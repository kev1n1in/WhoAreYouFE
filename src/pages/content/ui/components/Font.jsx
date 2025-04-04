import { useEffect } from "react";

export default function Font({ children }) {
  useEffect(() => {
    const linkNode = document.createElement("link");
    linkNode.type = "text/css";
    linkNode.rel = "stylesheet";
    linkNode.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(linkNode);
  }, []);

  return (
    <>
      <style>{`
        * {
          font-family: "Orbitron", system-ui;
          font-weight: 400;
          font-style: normal;
        }
      `}</style>
      {children}
    </>
  );
}
