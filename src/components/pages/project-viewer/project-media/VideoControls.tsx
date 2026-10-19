import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { MaximizeIcon, MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "../../../interface/Icons";

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
};

const TIME_SKIP = 5 // seconds

function VideoControls({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const barRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Keep controls updated
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Sync UI with the video
        const sync = () => {
            setIsPlaying(!video.paused);
            setIsMuted(video.muted);
            setDuration(video.duration || 0);
            setCurrentTime(video.currentTime);
        }
        const events = ["play", "pause", "volumechange", "loadedmetadata", "durationchange"];
        events.forEach((e) => {
            video.addEventListener(e, sync)
        })

        // Sync videos currentTime
        const onTimeUpdate = () => setCurrentTime(video.currentTime);
        video.addEventListener("timeupdate", onTimeUpdate);

        // Keep progress bar updated
        let raf = 0;
        const tick = () => {
            if(progressRef.current && video.duration){
                progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`
            }
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);

        return () => {
            events.forEach((e) => video.removeEventListener(e, sync));
            video.removeEventListener("timeupdate", onTimeUpdate)
            cancelAnimationFrame(raf);
        }
    }, [videoRef])

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        // capture pointer pos while mouse is down, then seekTo position
        e.currentTarget.setPointerCapture(e.pointerId);
        seekTo(e.clientX)
    }

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        // if a pointer pos was captured on pointer down, seekTo position
        if (e.currentTarget.hasPointerCapture(e.pointerId))
            seekTo(e.clientX);
    }

    // Arrow keys skip [TIME_SKIP] seconds when bar is focused
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video) return;

        if (e.key === "ArrowRight") video.currentTime = Math.min(video.currentTime + TIME_SKIP, video.duration);
        if (e.key === "ArrowLeft") video.currentTime = Math.max(video.currentTime - TIME_SKIP, 0);
    }

    // Video seeking on click or drag
    const seekTo = (clientX: number) => {
        const video = videoRef.current;
        const bar = barRef.current;
        if (!video || !bar || !video.duration) return;

        const rect = bar.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        video.currentTime = ratio * video.duration;
    }

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) video.play().catch(() => { });
        else video.pause();
    }

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) video.muted = !video.muted;
    }

    const maximize = () => {
        const video = videoRef.current as
            | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
            | null;
        if (!video) return;
        
        if (video.requestFullscreen) video.requestFullscreen();
        else video.webkitEnterFullscreen?.();
    }

    return (
        <div className="video-controls">
            <button className="video-controls__button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div
                ref={barRef}
                className="video-controls__progress-bar"
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onKeyDown={onKeyDown}
            >
                <div ref={progressRef} className="video-controls__progress" />
            </div>

            <span className="video-controls__time">
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button className="video-controls__button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <MutedIcon /> : <VolumeIcon />}
            </button>

            <button className="video-controls__button" onClick={maximize} aria-label="Fullscreen">
                <MaximizeIcon />
            </button>

        </div>
    )
}

export default VideoControls;
