import type { Dispatch, SetStateAction } from "react";
import type { MediaSlide } from "../../../../data/content";
import useHorizontalDragScroll from "../../../../hooks/useHorizontalDragScroll";
import { ChevronLeft, ChevronRight } from "../../general/Icons";

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
        <div className="media-strip">
            <ChevronLeft onClick={prev} className="media-strip__arrow"/>
            <div
                ref={viewportRef}
                className="media-strip__scroller"
                onPointerDown={onPointerDown}
            >
                <div ref={trackRef} className="media-strip__track">
                    {slides.map((slide, i) => {
                        return (
                            <div
                                onClick={() => setIndex(i)}
                                className={`media-strip__slide ${i === index ? "active" : ""}`}
                            >
                                
                            </div>
                        )
                    })}
                </div>


            </div>
            <ChevronRight onClick={next} className="media-strip__arrow"/>
        </div>
    )
}

export default MediaStrip;
