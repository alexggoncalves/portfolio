import type { MediaBlock } from "../../../../data/content";
import MediaItem from "./MediaItem";

function MediaRenderer({ block }: { block: MediaBlock }) {
    const content = () => {
        if (block.type === "row") {
            return (
                <div className="media-block_content">
                    {block.items.map((item, i) => (
                        <MediaItem key={i} item={item} />
                    ))}
                </div>
            );
        } else if (block.type === "stacked") {
            return (
                <>
                    <MediaItem item={block.main} />
                    <div className="media-block_content">
                        {block.row.map((item, i) => (
                            <MediaItem key={i} item={item} />
                        ))}
                    </div>
                </>
            );
        } else if (block.type === "column") {
            return (
                <div className="media-block_content">
                    {block.items.map((item, i) => (
                        <MediaItem key={i} item={item} />
                    ))}
                </div>
            );
        } else return <MediaItem item={block.media} />;
    };

    return (
        <div className="media-block">
            {block.title && (
                <div className="media__title">
                    <span>{block.title}</span>
                    <hr />
                </div>
            )}
            {content()}
        </div>
    );
}

export default MediaRenderer;
