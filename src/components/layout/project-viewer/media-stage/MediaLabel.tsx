type Props = {
    index: number,
    total: number,
    title?: string
};

const pad = (n: number) => String(n).padStart(2, "0");

function MediaLabel({ index, total, title }: Props) {
    return (
        <div className="media-label">
            <span className="media-label__counter">
                {pad(index + 1)}/{pad(total)}
            </span>
            {title && <span className="media-label__title"> - {title}</span>}
        </div>
    )
}

export default MediaLabel;
