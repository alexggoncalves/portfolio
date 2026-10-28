import "./LoadingScreen.scss"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "../ui/Icons";

const BOOT_OVERLAY_ID = "html-boot-overlay";

const BUTTON_EXIT_TIME = 300;
const FADE_OUT_TIME = 1000;

type LoadingScreenProps = {
    progress: number;
    onReveal: () => void;
}

function LoadingScreen({ progress, onReveal }: LoadingScreenProps) {
    const logoFillRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | undefined>(undefined);

    const [exiting, setExiting] = useState(false);
    const [visible, setVisible] = useState(true);

    const value = Math.round(Math.min(Math.max(progress, 0), 100));
    const ready = value >= 100;

    // Remove boot overlay when the page is loaded
    useLayoutEffect(() => {
        document.getElementById(BOOT_OVERLAY_ID)?.remove();
    }, []);

    // Logo loading animation
    useLayoutEffect(() => {
        if (!logoFillRef.current) return;
        logoFillRef.current.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    }, [value]);

    // Fade out button and then fade out loading screen and reveal website
    const handleStart = () => {
        if (!ready || exiting) return;

        setExiting(true);
        timeoutRef.current = window.setTimeout(() => {
            onReveal();
            timeoutRef.current = window.setTimeout(() => setVisible(false), FADE_OUT_TIME);
        }, BUTTON_EXIT_TIME);
    };

    // Remove pending timeout if unmounted mid-fade
    useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

    if (!visible) return null;

    return (
        <div
            className={`loading-screen${exiting ? " loading-screen--exiting" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Loading site"
            aria-hidden={exiting || undefined}
            style={{
                "--button-exit": `${BUTTON_EXIT_TIME}ms`,
                "--fade-out": `${FADE_OUT_TIME}ms`,
            } as CSSProperties}
        >
            <div
                className="loading-screen__logo-stack"
                role="progressbar"
                aria-label="Loading"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={ready ? "Loaded" : `${value}%`}
            >
                <Logo className="loading-screen__logo loading-screen__logo--empty" />
                <div ref={logoFillRef} className="loading-screen__logo-fill">
                    <Logo className="loading-screen__logo loading-screen__logo--full" />
                </div>
            </div>

            <span className="loading-screen__logo-label">
                Creative Developer
            </span>

            {/* Announce when loading is finished */}
            <p className="visually-hidden" role="status">
                {ready ? "Loaded. Press Start to enter." : ""}
            </p>

            <button
                type="button"
                className={"button--pill loading-screen__start"}
                aria-disabled={!ready}
                onClick={handleStart}
            >
                Press Start
            </button>
        </div>
    );
}

export default LoadingScreen;
