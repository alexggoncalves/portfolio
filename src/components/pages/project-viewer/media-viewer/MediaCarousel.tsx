import { useEffect, useRef, type Dispatch, type RefObject, type SetStateAction } from "react";

import type { MediaSlide } from "../../../../data/content";
import MediaRenderer from "./MediaRenderer";

type MediaCarouselProps = {
    slides: MediaSlide[];
    index: number;
    setIndex: Dispatch<SetStateAction<number>>;
    videoRef: RefObject<HTMLVideoElement | null>;
    onTogglePlay: () => void;
};

function MediaCarousel({ slides, index, setIndex, videoRef, onTogglePlay }: MediaCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const shownIndex = useRef(index); // the slide the carousel is showing
    const scrollingTo = useRef<number | null>(null); // set while the strip makes it scroll to a slide

    // Swipe → index: as soon as the carousel is more than halfway to another slide
    const onScroll = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        const step = (carousel.children[1] as HTMLElement | undefined)?.offsetLeft ?? carousel.clientWidth; // slide width + gap
        const i = Math.min(slides.length - 1, Math.max(0, Math.round(carousel.scrollLeft / step)));

        // Scrolling to a slide picked in the strip: ignore the slides it passes on the way
        if (scrollingTo.current !== null) {
            if (i === scrollingTo.current) scrollingTo.current = null;
            return;
        }

        if (i === shownIndex.current) return;
        shownIndex.current = i;
        setIndex(i);
    };

    // Index → carousel: when the strip arrows or thumbnails change it
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || index === shownIndex.current) return;
        shownIndex.current = index;
        scrollingTo.current = index;
        const slide = carousel.children[index] as HTMLElement | undefined;
        if (slide) carousel.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }, [index]);

    return (
        <div className="media-carousel"
            ref={carouselRef}
            onScroll={onScroll}
            onPointerDown={() => (scrollingTo.current = null)}
        >
            {slides.map((slide, i) => {
                const active = i === index;

                return (
                    <div
                        key={i}
                        className="media-carousel__slide media-slide--contain"
                        aria-hidden={!active}
                        onClick={active ? onTogglePlay : undefined}
                    >
                        <MediaRenderer
                            slide={slide}
                            active={active}
                            near={Math.abs(i - index) === 1} // neighbours load so they're ready to swipe in
                            videoRef={active ? videoRef : undefined}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default MediaCarousel;