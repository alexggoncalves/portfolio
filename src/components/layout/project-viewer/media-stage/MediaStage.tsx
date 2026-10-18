import type { RefObject } from "react";
import type { MediaSlide } from "../../../../data/content";
import MediaRenderer from "./MediaRenderer";

type Props = {
    slides: MediaSlide[];
    index: number;
    videoRef: RefObject<HTMLVideoElement | null>;
};

function MediaStage({ slides, index, videoRef }: Props) {

    return (
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
                    </div>)
            })}
        </div>
    )
}

export default MediaStage;
