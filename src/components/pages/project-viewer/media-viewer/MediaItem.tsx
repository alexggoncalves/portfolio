import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { Media } from "../../../../data/content";

const toMobileSrc = (src: string) => src.replace(/\.[^./]+$/, "-mobile.webp");

type Props = {
    item: Media;
    active: boolean;
    near: boolean;
    videoRef?: RefObject<HTMLVideoElement | null>;
};

function MediaItem({ item, active, near, videoRef }: Props) {
    const [mobileMissing, setMobileMissing] = useState(false);
    const [ratio, setRatio] = useState<number>();
    const localVideo = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = localVideo.current;
        if (!video) return;
        if (!active) video.pause();
    }, [active]);

    const readImageRatio = (img: HTMLImageElement | null) => {
        if (img?.complete && img.naturalWidth) {
            setRatio(img.naturalWidth / img.naturalHeight);
        }
    };

    const renderMedia = () => {
        switch (item.type) {
            case "image":
                return (
                    <img
                        key={mobileMissing ? "full" : "responsive"}
                        ref={readImageRatio}
                        src={item.src}
                        srcSet={mobileMissing ? undefined : `${toMobileSrc(item.src)} 1280w, ${item.src} 2560w`}
                        sizes="100vw"
                        className="media"
                        decoding="async"
                        alt={""}
                        draggable={false}
                        onLoad={(e) => readImageRatio(e.currentTarget)}
                        onError={() => setMobileMissing(true)}
                    />
                );

            case "video":
                return (
                    <video
                        ref={(el) => {
                            localVideo.current = el;
                            if (videoRef) videoRef.current = el;
                        }}
                        src={`${item.src}#t=0.001`}
                        className="media"
                        preload={near ? "auto" : "metadata"}
                        controls={false}
                        autoPlay={false}
                        playsInline
                        onLoadedMetadata={(e) =>
                            setRatio(e.currentTarget.videoWidth / e.currentTarget.videoHeight)
                        }
                        aria-label={item.alt}
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
