import type { Media } from "../../../asset-handling/contentAssets";

function MediaNavigator({
    items,
    index,
    onChange,
    onNext,
    onPrev,
}: {
    items: Media[];
    index: number;
    onChange: (i: number) => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    return (
        <div className="media-carousel__navigator">
            <div className="media-carousel__navigator-items">
                <div
                    onClick={onPrev}
                    className="media-carousel__navigator-button"
                >
                    {/* MISSING ARROW */}
                </div>

                {items.map((_, i) => (
                    <div
                        key={i}
                        className={`media-carousel__navigator-item ${
                            i === index ? "active" : ""
                        }`}
                        onClick={() => onChange(i)}
                    />
                ))}

                <div
                    onClick={onNext}
                    className="media-carousel__navigator-button"
                >
                     {/* MISSING ARROW */}
                </div>
            </div>
        </div>
    );
}

export default MediaNavigator;
