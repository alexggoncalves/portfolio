import type { RefObject } from "react";
import type { MediaSlide } from "../../../../data/content";
import MediaItem from "./MediaItem";

type Props = {
    slide: MediaSlide;
    active: boolean;
    near: boolean;
    videoRef: RefObject<HTMLVideoElement | null> | undefined;
};

function MediaRenderer({ slide, active, near, videoRef }: Props) {
    const itemProps = { active, near, videoRef };


    if (slide.type === "row") {
        return (
            <div className="media-slide__content">
                {slide.items.map((item, i) => (
                    <MediaItem key={i} item={item} {...itemProps} />
                ))}
            </div>
        );
    } else if (slide.type === "stacked") {
        return (
            <div className="media-slide__content media-slide--stacked">
                <MediaItem item={slide.main} {...itemProps} />

                {slide.row.map((item, i) => (
                    <MediaItem key={i} item={item} {...itemProps} />
                ))}
            </div>
        );
    } else if (slide.type === "column") {
        return (
            <div className="media-slide__content media-slide--column">
                {slide.items.map((item, i) => (
                    <MediaItem key={i} item={item} {...itemProps} />
                ))}
            </div>
        );
    } else return (
        <div className="media-slide__content media-slide--single">
            <MediaItem item={slide.media} {...itemProps} />
        </div>
    );

}

export default MediaRenderer;
