import type { Media } from "../../general/content";
import MediaRenderer from "./MediaRenderer";

function MediaPanel({ items }: { items: Media[] }) {
    return (
        <>
            {items.map((item) => {
                return <MediaRenderer item={item}></MediaRenderer>;
            })}
        </>
    );
}

export default MediaPanel;
