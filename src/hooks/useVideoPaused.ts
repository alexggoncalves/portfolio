import { useEffect, useState, type RefObject } from "react";

const useVideoPaused = (
    videoRef: RefObject<HTMLVideoElement | null>,
    slideKey: number,
) => {
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            setPaused(true);
            return;
        }

        const update = () => setPaused(video.paused);
        update();

        video.addEventListener("play", update);
        video.addEventListener("pause", update);
        return () => {
            video.removeEventListener("play", update);
            video.removeEventListener("pause", update);
        };
    }, [videoRef, slideKey]);

    return paused;
};

export default useVideoPaused;
