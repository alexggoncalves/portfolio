import { useEffect, useRef, useState } from "react";
import MediaControls from "./project-media/MediaControls";
import type { MediaSlide, Project } from "../../../data/content";
import MediaRenderer from "./project-media/MediaRenderer";
import MediaLabel from "./project-media/MediaLabel";
import MediaStrip from "./project-media/MediaStrip";

const isVideoSlide = (b?: MediaSlide) => b?.type === "single" && b.media.type === "video";

export type Fit = "cover" | "contain";

type MediaViewerProps = {
    project: Project;
    enabled: boolean;
}

const MediaViewer = ({ project, enabled }: MediaViewerProps) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [index, setIndex] = useState(0);
    const [fit, setFit] = useState<Fit>("cover");
    const toggleFit = () => setFit((f) => (f === "cover" ? "contain" : "cover"));
    const getFit = (slide?: MediaSlide): Fit => (slide?.contain ? "contain" : fit);

    // Go back to first slide when another project opens
    useEffect(() => {
        setIndex(0);
    }, [project])

    const slides = project.media;
    const currentSlide = slides[index];
    const fitLocked = !!currentSlide?.contain;

    return (
        <div ref={viewerRef} className="media-viewer">
            <div className="media-stage">
                {slides.map((slide, i) => {
                    return (
                        <div
                            key={i}
                            className={`media-slide media-slide--${getFit(slide)} ${i === index ? "active" : ""}`}
                            inert={i !== index}
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
            <div className="media-dock">
                <MediaStrip slides={slides} index={index} setIndex={setIndex} enabled={enabled}/>

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