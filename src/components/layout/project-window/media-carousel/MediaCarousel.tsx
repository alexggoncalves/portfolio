import { useState } from "react";
import type { Media } from "../../../asset-handling/contentAssets";
import MediaRenderer from "./MediaRenderer";
import MediaNavigator from "./MediaNavigator";

function MediaCarousel({ items }: { items: Media[] }) {
    const [index, setIndex] = useState(0);

    const current = items?.length ? items[index] : null;

    const next = () => setIndex((i) => (i + 1) % items.length);
    const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

    if (current)
        return (
            <>
                <MediaNavigator
                    items={items}
                    index={index}
                    onChange={setIndex}
                    onNext={next}
                    onPrev={prev}
                />
                <div className="media-carousel">
                    <MediaRenderer item={current}></MediaRenderer>
                </div>
            </>
        );
}

export default MediaCarousel;
