import type { Dispatch, SetStateAction } from "react";
import type { Media, MediaSlide } from "../../../../data/content";
import useHorizontalDragScroll from "../../../../hooks/useHorizontalDragScroll";
import { ChevronLeft, ChevronRight } from "../../../interface/Icons";
import MediaThumbnail from "./MediaThumbnail";

export function getSlideItems(slide: MediaSlide): Media[] {
    switch (slide.type) {
        case "single": return [slide.media];
        case "row": return slide.items;
        case "column": return slide.items;
        case "stacked": return [slide.main, ...slide.row];
    }
}

type Props = {
    slides: MediaSlide[];
    index: number;
    setIndex: Dispatch<SetStateAction<number>>
};

function MediaStrip({ slides, index, setIndex }: Props) {
    const { viewportRef, trackRef, onPointerDown } =
        useHorizontalDragScroll();

    const prev = () => {
        let newIndex = index - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        setIndex(newIndex);
    }

    const next = () => {
        let newIndex = index + 1;
        if (newIndex >= slides.length) newIndex = 0;
        setIndex(newIndex);
    }

    return (

        <div className="media-strip__container">
            <div className="media-strip">
                <button onClick={prev} className="media-strip__arrow">
                    <ChevronLeft />
                </button>

                <div
                    ref={viewportRef}
                    className="media-strip__scroller"
                    onPointerDown={onPointerDown}
                >
                    <div ref={trackRef} className="media-strip__track">
                        {slides.map((slide, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                className={`media-strip__slide ${i === index ? "active" : ""}`}
                                aria-label={`${i + 1}. ${slide.title || "Media"}`}
                                aria-current={i === index ? "true" : undefined}
                                title={slide.title}
                            >
                                {getSlideItems(slide).map((media, j) => (
                                    <MediaThumbnail key={j} media={media} />
                                ))}
                            </button>
                        ))}
                    </div>


                </div>
                <button onClick={next} className="media-strip__arrow">
                    <ChevronRight />
                </button>
            </div>


        </div>
    )
}

export default MediaStrip;
