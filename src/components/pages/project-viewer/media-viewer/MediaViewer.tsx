import { useRef, useState } from "react";
import MediaControls from "./MediaControls";
import type { MediaSlide, Project } from "../../../../data/content";
import MediaRenderer from "./MediaRenderer";
import MediaLabel from "./MediaLabel";
import MediaStrip from "./MediaStrip";
import useMediaQuery, { MOBILE_QUERY } from "../../../../utils/useMediaQuery";
import MediaCarousel from "./MediaCarousel";

const isVideoSlide = (s?: MediaSlide) => s?.type === "single" && s.media.type === "video";

export type Fit = "cover" | "contain";

type MediaViewerProps = {
    project: Project;
    enabled: boolean;
}

const MediaViewer = ({ project, enabled }: MediaViewerProps) => {
    const isMobile = useMediaQuery(MOBILE_QUERY)

    const viewerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [index, setIndex] = useState(0);

    const slides = project.media;
    const currentSlide = slides[index];
    const fitLocked = !!currentSlide?.contain;

    const [fit, setFit] = useState<Fit>("cover");
    const toggleFit = () => setFit((f) => (f === "cover" ? "contain" : "cover"));
    const getFit = (slide?: MediaSlide): Fit => (slide?.contain || isMobile ? "contain" : fit);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) video.play().catch(() => { });
        else video.pause();
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else viewerRef.current?.requestFullscreen?.();
    };

    // Double-click on the media toggles fullscreen, but not on the controls, strip or other buttons
    const onDoubleClick = (e: React.MouseEvent) => {
        if ((e.target as Element).closest("button, a, .media-dock")) return;
        toggleFullscreen();
    };

    return (
        <div ref={viewerRef} className="media-viewer" onDoubleClick={onDoubleClick}>
            {isMobile ? <MediaCarousel
                slides={slides}
                index={index}
                setIndex={setIndex}
                videoRef={videoRef}
                onTogglePlay={togglePlay}
            />
                :
                <div className="media-stage">
                    {slides.map((slide, i) => {
                        const active = i === index;
                        const clickable = active && isVideoSlide(slide);

                        return (
                            <div
                                key={i}
                                className={`media-slide media-slide--${getFit(slide)} ${i === index ? "active" : ""}`}
                                inert={i !== index}
                                onClick={clickable ? togglePlay : undefined}
                            >
                                <MediaRenderer
                                    slide={slide}
                                    active={i === index}
                                    near={Math.abs(i - index) === 1} // Preload adjacent media slides
                                    videoRef={i === index ? videoRef : undefined}
                                />
                            </div>
                        )
                    })
                    }
                </div>
            }

            <div className="media-dock">
                <MediaStrip slides={slides} index={index} setIndex={setIndex} enabled={enabled} />

                <div className="media-dock__panel">
                    <MediaLabel index={index} total={slides.length} title={currentSlide?.title} />
                    <MediaControls
                        videoRef={videoRef}
                        fullscreenRef={viewerRef}
                        isVideo={isVideoSlide(currentSlide)}
                        slideKey={index}
                        fit={getFit(currentSlide)}
                        onToggleFit={fitLocked ? undefined : toggleFit}
                    />
                </div>
            </div>
        </div>
    );
}

export default MediaViewer;