import type { Media } from "../../../../data/content";
import { PlayIcon } from "../../../interface/Icons";

function MediaThumbnail({ media }: { media: Media }) {
    // Optional custom thumbnail in the data wins
    if (media.thumb) {
        return <img className="media-thumbnail" src={media.thumb} alt="" loading="lazy" draggable={false} />;
    }

    switch (media.type) {
        case "image":
            return <img className="media-thumbnail" src={media.src} alt="" loading="lazy" draggable={false} />;

        case "video":
            return (
                <span className="media-thumbnail media-thumbnail--video">
                    <video src={`${media.src}#t=2`} muted playsInline preload="metadata" tabIndex={-1} />
                    <PlayIcon className="media-thumbnail__play" />
                </span>
            );

        default:
            return <span className="media-thumbnail media-thumbnail--empty" />;
    }
}

export default MediaThumbnail;