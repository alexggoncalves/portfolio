import type { Media } from "../../general/content";

function MediaRenderer({ item }: { item: Media }) {
    switch (item.type) {
        case "image":
            return <img src={item.src} className="media" />;

        case "video":
            return (
                <video
                    src={item.src}
                    className="media"
                    controls
                    preload="metadata"
                ></video>
            );

        case "model":
            return <div className="media"></div>;

        default:
            return null;
    }
}

export default MediaRenderer;
