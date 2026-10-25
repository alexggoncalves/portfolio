import "./../styles/loadingScreen.scss"

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "./general/Icons";

const FADE_OUT_TIMER = 1000;
const BOOT_OVERLAY_ID = "html-boot-overlay";

type LoadingScreenProps = {
    progress: number;
    onReveal: () => void;
}

function LoadingScreen({ progress, onReveal }: LoadingScreenProps) {
    const logoFillRef = useRef<HTMLDivElement>(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);

    const ready = progress >= 100;

    // Remove boot overlay when the page is loaded
    useLayoutEffect(() => {
        document.getElementById(BOOT_OVERLAY_ID)?.remove();
    }, []);

    const handleEnter = () => {
        onReveal(); // page starts fading in
        setFadeOut(true); // loading screen starts fading out
        setTimeout(() => setVisible(false), FADE_OUT_TIMER);
    };

    // Logo loading animation
    useLayoutEffect(() => {
        if (!logoFillRef.current) return;
        const value = Math.min(Math.max(progress, 0), 100);
        logoFillRef.current.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    }, [progress]);

    // Prevent scroll in loading screen
    useEffect(() => {
        if (fadeOut) return;

        const html = document.documentElement;
        html.style.overflow = "hidden";

        return () => {
            html.style.overflow = "";
        };
    }, [fadeOut]);

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
