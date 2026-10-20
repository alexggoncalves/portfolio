import { useRef, useState } from "react";
import MediaControls from "./project-media/MediaControls";
import type { MediaSlide } from "../../../data/content";
import MediaRenderer from "./project-media/MediaRenderer";
import MediaLabel from "./project-media/MediaLabel";

const isVideoSlide = (b?: MediaSlide) => b?.type === "single" && b.media.type === "video";

export type Fit = "cover" | "contain";

type MediaViewerProps = {
    slides: MediaSlide[];
    index: number;
}

const MediaViewer = ({ slides, index }: MediaViewerProps) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const current = slides[index];

    const [fit, setFit] = useState<Fit>("cover");
    const toggleFit = () => setFit((f) => (f === "cover" ? "contain" : "cover"));

    const currentSlide = slides[index];

    return (
        <div ref={viewerRef} className="media-viewer">
            <div className="media-stage">
                {slides.map((slide, i) => {
                    return (
                        <div
                            key={i}
                            className={`media-slide ${i === index ? "active" : ""}`}
                            aria-hidden={i !== index}
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
            <div className="media-controls__container">
                <MediaLabel index={index} total={slides.length} title={currentSlide?.title} />
                <MediaControls
                    videoRef={videoRef}
                    fullscreenRef={viewerRef}
                    isVideo={isVideoSlide(current)}
                    slideKey={index}
                    fit={fit}
                    onToggleFit={toggleFit}
                />
            </div>

        </div>
    );
}

export default MediaViewer;