import { useEffect, useState, type RefObject } from "react";
import { CoverMediaIcon, FitMediaIcon, MaximizeMediaIcon, MinimizeMediaIcon } from "../../../ui/Icons";
import VideoControls from "./VideoControls";
import useMediaQuery, { MOBILE_QUERY } from "../../../../utils/useMediaQuery";
import ToggleInterfaceButton from "../ToggleInterfaceButton";

export type Fit = "cover" | "contain";

type Props = {
    videoRef: RefObject<HTMLVideoElement | null>;
    fullscreenRef: RefObject<HTMLElement | null>;
    isVideo: boolean;
    slideKey: number;
    fit: Fit;
    onToggleFit?: () => void;
};

function MediaControls({ videoRef, fullscreenRef, isVideo, slideKey, fit, onToggleFit }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isMobile = useMediaQuery(MOBILE_QUERY);

    // Keep the icon in sync, including when the user exits with Esc
    useEffect(() => {
        const onChange = () => setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, [fullscreenRef]);

    const toggleFullscreen = () => {
        const container = fullscreenRef.current;
        const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;

        if (document.fullscreenElement) document.exitFullscreen();
        else if (container?.requestFullscreen) container.requestFullscreen();
        else if (isVideo) video?.webkitEnterFullscreen?.(); // iPhone fallback
    };

    if(isVideo || !isMobile)
    return (
        
        <div className="media-controls">
            {isVideo && <VideoControls key={slideKey} videoRef={videoRef} />}
            
            {!isFullscreen && !isMobile && <ToggleInterfaceButton />}

            {onToggleFit && !isFullscreen && !isMobile && (
                <button
                    type="button"
                    className="media-controls__button"
                    onClick={onToggleFit}
                    aria-label={fit === "cover" ? "Show full frame" : "Fill screen"}
                    title={fit === "cover" ? "Show full frame" : "Fill screen"}
                >
                    {fit === "cover" ? <FitMediaIcon /> : <CoverMediaIcon />}
                </button>
            )}
            
            <button
                type="button"
                className="media-controls__button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
                {isFullscreen ? <MinimizeMediaIcon /> : <MaximizeMediaIcon />}
            </button>
        </div>
    );
}

export default MediaControls;