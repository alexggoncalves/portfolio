import { useLayoutEffect } from "react";
import LOGO from "/images/logo.svg";

const BOOT_OVERLAY_ID = "html-boot-overlay";

function ComingSoon() {
  useLayoutEffect(() => {
    document.getElementById(BOOT_OVERLAY_ID)?.remove();
  }, []);

  return (
    <>
      <div
        className="loading-screen"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "rgb(25, 25, 25)",
          fontFamily:
            "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
      >
        <img
          src={LOGO}
          className="loading-screen__logo"
          style={{
            height: "80px",
            position: "absolute",
            transform: "translateY(-130%)",
          }}
        ></img>
        <div
          style={{
            position: "absolute",
            transform: "translateY(-170%)",
            fontSize: "16px",
            color: "#b32462",
          }}
        >
          CREATIVE DEVELOPER
        </div>

        <div
          style={{
            position: "absolute",
            fontSize: "18px",
            color: "#ffffff",
            fontFamily: "Space Grotesk, sans-serif",
            transform: "translateY(30%)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", transform: "translateY(5px)" }}>
            ......................................................
          </div>
          coming soon
          <div style={{ fontSize: "28px", transform: "translateY(-20px)" }}>
            ......................................................
          </div>
        </div>
      </div>
    </>
  );
}

export default ComingSoon;
