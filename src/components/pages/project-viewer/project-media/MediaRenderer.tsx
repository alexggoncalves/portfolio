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

    switch (slide.type) {
        case "single":
            return (
                <div className="media-slide__content media-slide__content--single">
                    <MediaItem item={slide.media} {...itemProps} />
                </div>
            );

        case "row":
            return (
                <div className="media-slide__content media-slide__content--row">
                    {slide.items.map((item, i) => (
                        <MediaItem key={i} item={item} {...itemProps} />
                    ))}
                </div>
            )
        case "column":
            return (
                <div className={`media-slide__content media-slide__content--${slide.type}`}>
                    {slide.items.map((item, i) => (
                        <MediaItem key={i} item={item} {...itemProps} />
                    ))}
                </div>
            );
    }
}

export default MediaRenderer;
