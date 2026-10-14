import { useState, type CSSProperties } from "react";
import type { Media } from "../../../../data/content";

function MediaItem({ item }: { item: Media }) {
    const [ratio, setRatio] = useState<number>();

    const renderMedia = () => {
        switch (item.type) {
            case "image":
                return (
                    <img
                        src={item.src}
                        className="media"
                        alt={item.alt}
                        onLoad={(e) =>
                            setRatio(
                                e.currentTarget.naturalWidth /
                                    e.currentTarget.naturalHeight,
                            )
                        }
                    />
                );

            case "video":
                return (
                    <video
                        src={item.src}
                        className="media"
                        controls
                        preload="metadata"
                    />
                );

            case "model":
                return <div className="media" />;

            default:
                return null;
        }
    };

    return (
        <div className="media-item" style={{ "--ratio": ratio} as CSSProperties}>
            {item.title && (
                <div className="media__title">
                    <span>{item.title}</span>
                    <hr />
                </div>
            )}
            {renderMedia()}
        </div>
    );
}

export default MediaItem;
