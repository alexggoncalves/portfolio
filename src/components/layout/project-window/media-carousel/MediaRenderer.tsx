import type { MediaBlock } from "../../../../data/content";
import MediaItem from "./MediaItem";

function MediaRenderer({ block }: { block: MediaBlock }) {
    const content =
        block.type === "single" ? (
            <MediaItem item={block.media} />
        ) : (
            <div className="media-block_content">
                {block.items.map((m, i) => (
                    <MediaItem key={i} item={m} />
                ))}
            </div>
        );

    return (
        <div className="media-block">
            {block.title && (
                <div className="media__title">
                    <span>{block.title}</span>
                    <hr />
                </div>
            )}
            {content}
        </div>
    );
}

export default MediaRenderer;
