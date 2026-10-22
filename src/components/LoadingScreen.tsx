import { useLayoutEffect, useRef, useState } from "react";
import { Logo } from "./interface/Icons";

const FADE_OUT_TIMER = 1000;
const BOOT_OVERLAY_ID = "html-boot-overlay";

function LoadingScreen({ progress }: { progress: number }) {
    const progressRef = useRef<HTMLDivElement>(null);
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

    useLayoutEffect(() => {
        if (!progressRef.current) return;
        const value = Math.min(Math.max(progress, 0), 100) / 100;
        progressRef.current.style.transform = `scaleX(${value})`;
    }, [progress]);


    if (!visible) return null;

    return (
        <>
            <div
                className="loading-screen"
                style={{
                    opacity: fadeOut ? 0 : 1,
                    transition: `opacity ${FADE_OUT_TIMER}ms ease`,
                    pointerEvents: fadeOut ? "none" : "auto",
                }}
            >
                <div className="loading-screen__logo-container">
                    <Logo className="loading-screen__logo"/>
                    <span className="loading-screen__logo-label">
                        CREATIVE DEVELOPER
                    </span>
                </div>

                <div className="loading-screen__progress-bar">
                    <div ref={progressRef} className="loading-screen__progress-fill"/>
                </div>

                <button
                    className={"button--pill"}
                    disabled={!ready}
                    onClick={handleEnter}
                >
                    ENTER
                </button>
            </div>
        </>
    );
}

export default LoadingScreen;
