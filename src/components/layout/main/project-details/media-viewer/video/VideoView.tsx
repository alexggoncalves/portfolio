import { Image } from "@react-three/uikit";

import type { VideoRecord } from "../../../../../app/assets/assetLoaders";
import { useEffect, useMemo,} from "react";
import { SRGBColorSpace, VideoTexture } from "three";
import { useFrame } from "@react-three/fiber";
import VideoControlsBar from "./VideoControlsBar";
import BigPlayButton from "./BigPlayButton";

function VideoView({ asset }: { asset: VideoRecord }) {
    // Create texture
    const texture = useMemo(() => {
        if (!asset.element) return null;

        const t = new VideoTexture(asset.element);
        t.colorSpace = SRGBColorSpace;
        return t;
    }, [asset.element]);

    // Dispose of texture on unmount or reload
    useEffect(() => {
        return () => {
            texture?.dispose();
        };
    }, [texture]);

    useFrame(() => {
        if (texture) texture.needsUpdate = true;
    });

    function togglePlay() {
        const video = asset.element;
        if (!video) return;
        video.muted = false;

        if (video.paused) video.play();
        else video.pause();
    }

    useEffect(() => {
        const video = asset.element;
        if (!video) return;
        video.muted = true;
        video.controls = true;

        return () => {
            video.pause();
            video.currentTime = 0;
        };
    }, [asset.element]);

    if (!texture) return null;

    return (
        <>
            {/* Video */}
            <Image
                height={"100%"}
                width={"100%"}
                objectFit={"cover"}
                src={texture}
                onClick={togglePlay}
                keepAspectRatio={false}
                cursor={"default"}
                positionType={"relative"}
            />

            {/* Controls */}
            {asset.element && (
                <>
                    <BigPlayButton video={asset.element}></BigPlayButton>
                    <VideoControlsBar video={asset.element}></VideoControlsBar>
                </>
            )}
        </>
    );
}

export default VideoView;
