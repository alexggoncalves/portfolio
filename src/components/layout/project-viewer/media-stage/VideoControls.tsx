import type { RefObject } from "react";
import { MaximizeIcon, PlayIcon } from "../../general/Icons";


function VideoControls({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {

    return (
        <div className="video-controls">
            <PlayIcon/>
            <div className="video-controls__progress-bar"></div>
            <div>00:00</div>
            <MaximizeIcon/>
        </div>
    )
}

export default VideoControls;
