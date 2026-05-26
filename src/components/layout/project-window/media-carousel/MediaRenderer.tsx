import type { Media } from "../../../asset-handling/contentAssets";

function MediaRenderer({ item }: { item: Media }) {

    switch (item.type) {
        case "image":
            return <img src={item.src} className="media" />;

        case "video":
            return (
                <video className="media" controls>
                    <source src={item.src} />
                </video>
            );

        case "model":
            return <div className="media"></div>;

        default:
            return null;
    }
}

export default MediaRenderer;
