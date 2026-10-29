import { useEffect, useRef, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import type { Media, MediaSlide } from "../../../../data/content";
import useHorizontalDragScroll from "../../../../hooks/useHorizontalDragScroll";
import { ChevronLeft, ChevronRight } from "../../../ui/Icons";
import MediaThumbnail from "./MediaThumbnail";

export function getSlideItems(slide: MediaSlide): Media[] {
    switch (slide.type) {
        case "single": return [slide.media];
        case "row": return slide.items;
        case "column": return slide.items;
    }
}

type MediaStripProps = {
    slides: MediaSlide[];
    index: number;
    setIndex: Dispatch<SetStateAction<number>>;
    enabled: boolean;
};

function MediaStrip({ slides, index, setIndex, enabled }: MediaStripProps) {
    const { viewportRef, trackRef, onPointerDown } = useHorizontalDragScroll();

    const activeRef = useRef<HTMLButtonElement>(null);
    const count = slides.length;

    const prev = () => {
        if (count === 0) return;
        setIndex(i => (i - 1 + count) % count);
    }

    const next = () => {
        if (count === 0) return;
        setIndex(i => (i + 1) % count);
    }

    // Keep active thumbnail in view
    useEffect(() => {
        activeRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    }, [index]);

    // Arrow key navigation
    useEffect(() => {
        if (count < 2 || !enabled) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;

            // Ignore key down in input fields/sliders...
            const target = e.target as HTMLElement;
            if (target.closest("input, textarea, select, [contenteditable], [role='slider']")) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                prev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                next();
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [enabled, count, setIndex])

    

    return (
        <nav className="media-strip" aria-label="Media thumbnails">
            <button
                type="button"
                onClick={prev}
                className="media-strip__arrow"
                aria-label="Previous slide"
                aria-controls="media-strip-track"
            >
                <ChevronLeft focusable="false" />
            </button>

            <div
                ref={viewportRef}
                className="media-strip__scroller"
                onPointerDown={onPointerDown}
            >
                <div
                    ref={trackRef}
                    id="media-strip-track"
                    className="media-strip__track"
                    role="list"
                >
                    {slides.map((slide, i) => {
                        const isActive = i === index;
                        const ariaLabel = `Slide ${i + 1} of ${count}${slide.title ? `: ${slide.title}` : ""}`;
                        const itemCount = getSlideItems(slide).length;

                        return (
                            <div key={i} role="listitem">
                                <button
                                    ref={isActive ? activeRef : undefined}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    className={`media-strip__slide media-strip__slide--${slide.type} ${isActive ? "active" : ""}`}
                                    style={{ "--count": itemCount } as CSSProperties}
                                    aria-label={ariaLabel}
                                    aria-current={isActive ? "true" : undefined}
                                    title={slide.title}
                                >
                                    {getSlideItems(slide).map((media, j) => (
                                        <MediaThumbnail key={j} media={media} />
                                    ))}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button
                type="button"
                onClick={next}
                className="media-strip__arrow"
                aria-label="Next slide"
                aria-controls="media-strip-track"
            >
                <ChevronRight focusable="false" />
            </button>
        </nav>
    )
}

export default MediaStrip;
