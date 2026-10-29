import { padNumber } from "../../../../utils/stringUtils";

type Props = {
    index: number,
    total: number,
    title?: string
};

function MediaLabel({ index, total, title }: Props) {
    return (
        <div
            className="media-label"
            aria-live="polite"
            aria-atomic="true"
        >
            {title && <span className="media-label__title">{title}</span>}
            {title && <span>-</span>}
            <span className="media-label__counter">
                {padNumber(index + 1)}/{padNumber(total)}
            </span>
        </div>
    )
}

export default MediaLabel;
