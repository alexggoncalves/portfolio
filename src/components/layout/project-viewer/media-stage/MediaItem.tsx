import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { Media } from "../../../../data/content";

type Props = {
    item: Media;
    active: boolean;
    near: boolean;
    videoRef?: RefObject<HTMLVideoElement | null>;
};

function MediaItem({ item, active, near, videoRef }: Props) {
    const [ratio, setRatio] = useState<number>();
    const localVideo = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = localVideo.current;
        if (!video) return;
        if (active) video.play().catch(() => { }); // autoplay can be blocked
        else video.pause();
    }, [active]);

    const renderMedia = () => {
        switch (item.type) {
            case "image":
                return (
                    <img
                        src={item.src}
                        className="media"
                        alt={item.alt}
                        draggable={false}
                        onLoad={(e) =>
                            setRatio(
                                e.currentTarget.naturalWidth /
                                e.currentTarget.naturalHeight,
                            )
                        }
                    />
                );

            case "video":
                return (
                    <video
                        ref={(el) => {
                            localVideo.current = el;
                            if (videoRef) videoRef.current = el;
                        }}
                        src={item.src}
                        className="media"
                        preload={near ? "auto" : "metadata"}
                        controls={true}
                        onLoadedMetadata={(e) =>
                            setRatio(e.currentTarget.videoWidth / e.currentTarget.videoHeight)
                        }
                    />
                );

            case "model":
                return <div className="media" />;

            default:
                return null;
        }
    };

    return (
        <div className="media-item" style={{ "--ratio": ratio } as CSSProperties}>
            {renderMedia()}
        </div>
    );
}

export default MediaItem;
