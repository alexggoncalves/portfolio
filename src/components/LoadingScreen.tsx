import "./../styles/loadingScreen.scss"

import { useLayoutEffect, useRef, useState } from "react";
import { Logo } from "./general/Icons";

const FADE_OUT_TIMER = 1000;
const BOOT_OVERLAY_ID = "html-boot-overlay";

function LoadingScreen({ progress }: { progress: number }) {
    const logoFillRef = useRef<HTMLDivElement>(null);
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
        if (!logoFillRef.current) return;
        const value = Math.min(Math.max(progress, 0), 100);
        logoFillRef.current.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
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
                <div className="loading-screen__logo-stack">
                    <Logo className="loading-screen__logo loading-screen__logo--empty" />
                    <div ref={logoFillRef} className="loading-screen__logo-fill">
                        <Logo className="loading-screen__logo loading-screen__logo--full" />
                    </div>
                </div>

                <span className="loading-screen__logo-label">
                    CREATIVE DEVELOPER
                </span>

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
