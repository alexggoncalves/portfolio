import { memo, useState } from "react";
import type { Media } from "../../../../data/content";
import { PlayIcon } from "../../../ui/Icons";

const toThumbSrc = (src: string) => src.replace(/\.[^./]+$/, "-thumbnail.webp");

function MediaThumbnail({ media }: { media: Media }) {
    const [loaded, setLoaded] = useState(false);
    const [thumbMissing, setThumbMissing] = useState(false);
    const loadedClass = loaded ? "loaded" : "";

    const imageSrc = !thumbMissing
        ? media.thumbSrc ?? toThumbSrc(media.src)
        : media.type === "image" ? media.src : null;

    if (imageSrc) {
        const image = (
            <img
                key={imageSrc}
                className={media.type === "video" ? undefined : `media-thumbnail ${loadedClass}`}
                src={imageSrc}
                alt=""
                draggable={false}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setThumbMissing(true)}
            />
        );

        if (media.type !== "video") return image;

        return (
            <span className={`media-thumbnail media-thumbnail--video ${loadedClass}`}>
                {image}
                <div className="media-thumbnail__play">
                    <PlayIcon />
                </div>
            </span>
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
                    onLoadedData={() => setLoaded(true)}
                />
                <div className="media-thumbnail__play">
                    <PlayIcon />
                </div>
            </span>
        );
    }

    return <span className="media-thumbnail media-thumbnail--empty" />;
}

export default memo(MediaThumbnail);