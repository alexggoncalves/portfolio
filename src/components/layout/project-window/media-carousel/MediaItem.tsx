import type { Media } from "../../../../data/content";

function MediaItem({ item }: { item: Media }) {
    const renderMedia = () => {
        switch (item.type) {
            case "image":
                return <img src={item.src} className="media" alt={item.alt} />;

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
        <div className="media-item">
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
