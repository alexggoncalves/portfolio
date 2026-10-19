import { useLayoutEffect, useState } from "react";
import LOGO from "/images/logo.svg";

const FADE_OUT_TIMER = 1000;

const BOOT_OVERLAY_ID = "html-boot-overlay";

function LoadingScreen({ progress }: { progress: number }) {
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);

    useLayoutEffect(() => {
        document.getElementById(BOOT_OVERLAY_ID)?.remove();
    }, []);

    const ready = progress >= 100;

    const handleEnter = () => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), FADE_OUT_TIMER);
    };

    if (!visible) return null;

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
                    opacity: fadeOut ? 0 : 1,
                    transition: `opacity ${FADE_OUT_TIMER}ms ease`,
                    pointerEvents: fadeOut ? "none" : "auto",
                }}
            >
                <img
                    src={LOGO}
                    className="loading-screen__logo"
                    style={{
                        height: "80px",
                        position: "absolute",
                        transform: "translateY(-130%)"
                    }}
                ></img>
                <div
                    style={{
                        position: "absolute",
                        transform: "translateY(-170%)",
                        fontSize: "16px",
                        color: "#b32462"
                    }}
                >
                    CREATIVE DEVELOPER
                </div>
                <div
                    className="loading-screen__progress-bar"
                    style={{
                        padding: "3px",
                        width: "300px",
                        height: "16px",
                        flexShrink: 0,
                        border: "1px solid white",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        className="loading-screen__progress-fill"
                        style={{
                            height: "100%",
                            width: "100%",
                            transformOrigin: "left center",
                            transform: `scaleX(${Math.min(Math.max(progress, 0), 100) / 100})`,
                            backgroundColor: "white",
                            borderRadius: "20px",
                            transition: "transform 0.5s ease",
                        }}
                    />
                </div>

                <div
                    className={`button ${ready ? "" : "button-disabled"}`}
                    onClick={handleEnter}
                >
                    ENTER
                </div>
            </div>
        </>
    );
}

export default LoadingScreen;
