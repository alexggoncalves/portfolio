import type { MediaBlock } from "../../../../data/content";
import MediaRenderer from "./MediaRenderer";

function MediaPanel({ items }: { items: MediaBlock[] }) {
    return (
        <>
            {items.map((item) => {
                return <MediaRenderer block={item} />;
            })}
        </>
    );
}

export default MediaPanel;
