import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from "react";
import type { Media } from "../../../../data/content";
import { PlayIcon } from "../../../ui/Icons";

const toMobileSrc = (src: string) => src.replace(/\.[^./]+$/, "-mobile.webp");

type Props = {
    item: Media;
    active: boolean;
    near: boolean;
    videoRef?: RefObject<HTMLVideoElement | null>;
};

function MediaItem({ item, active, near, videoRef }: Props) {
    const localVideo = useRef<HTMLVideoElement | null>(null);

    const [mobileMissing, setMobileMissing] = useState(false);
    const [ratio, setRatio] = useState<number>();
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        const video = localVideo.current;
        if (!video) return;
        if (!active) video.pause();
    }, [active]);

    const playVideo = (e: MouseEvent) => {
        e.stopPropagation();
        localVideo.current?.play().catch(() => { });
    };

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
                        onPlay={() => setPaused(false)}
                        onPause={() => setPaused(true)}
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
            {item.type === "video" && (
                <button
                    type="button"
                    className={`video__play-button ${paused ? "visible" : ""}`}
                    onClick={playVideo}
                    aria-label="Play video"
                    inert={!paused}
                >
                    <PlayIcon />
                </button>
            )}
        </div>
    );
}

export default MediaItem;
