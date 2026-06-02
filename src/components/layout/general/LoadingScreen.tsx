import { useLayoutEffect, useState } from "react";

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
                    // Inline so this layer wins before bundled CSS (Nav is z-index 120).
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 10_000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgb(25, 25, 25)",
                    fontFamily:
                        "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    opacity: fadeOut ? 0 : 1,
                    transition: `opacity ${FADE_OUT_TIMER}ms ease`,
                    pointerEvents: fadeOut ? "none" : "auto",
                }}
            >
                {progress}

                <button disabled={!ready} onClick={handleEnter}>
                    ENTER
                </button>
            </div>
        </>
    );
}

export default LoadingScreen;
