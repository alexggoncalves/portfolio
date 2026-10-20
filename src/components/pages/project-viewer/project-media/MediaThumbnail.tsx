import { useState } from "react";
import type { Media } from "../../../../data/content";
import { PlayIcon } from "../../../interface/Icons";

function MediaThumbnail({ media }: { media: Media }) {
    const [loaded, setLoaded] = useState(false);
    const onLoad = () => setLoaded(true);
    const loadedClass = loaded ? "loaded" : "";

    const imageSrc = media.thumb ?? (media.type === "image" ? media.src : null);

    if (imageSrc) {
        return (
            <img
                className={`media-thumbnail ${loadedClass}`}
                src={imageSrc}
                alt=""
                draggable={false}
                decoding="async"
                onLoad={onLoad}
            />
        );
    }

    if (media.type === "video") {
        return (
            <span className={`media-thumbnail media-thumbnail--video ${loadedClass}`}>
                <video
                    src={`${media.src}#t=2`}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    onLoadedData={onLoad} // fires once the frame at #t=2 is ready
                />
                <PlayIcon className="media-thumbnail__play" />
            </span>
        );
    }

    return <span className="media-thumbnail media-thumbnail--empty" />;
}

export default MediaThumbnail;