import useMediaViewerStore from "../../../stores/mediaViewerStore";
import useAsciiStore from "../../../stores/asciiStore";
import { useEffect, useState } from "react";

import { useSpring, animated } from "@react-spring/web";
import { useLocation, useNavigate } from "react-router";

function MediaViewer() {
    const { isOpen, media, close, size, position } = useMediaViewerStore();
    const { charSize,pixelRatio } = useAsciiStore();

    const [currentIndex, setCurrentIndex] = useState(0);

    const [visible, setVisible] = useState(isOpen);
    const fadeInOut = useSpring({
        opacity: isOpen ? 1 : 0,
        config: {
            duration: isOpen ? 1200 : 600,
        },
        onRest: () => {
            if (!isOpen) setVisible(false);
        },
    });

    useEffect(() => {
        if (isOpen) setVisible(true);
    }, [isOpen]);

    const location = useLocation();
    useEffect(() => {
        if (!location.pathname.includes("/work/")) close();
    }, [location]);

    // Only render if visible is true
    if (!visible || !media || media.length === 0) return null;
    
    const currentAsset = media[currentIndex];

    if (!visible && !currentAsset) return null;

    return (
        <animated.div
            id="media-viewer"
            style={{
                position: "absolute",
                left: position.x /pixelRatio,
                top: position.y/pixelRatio,
                width: size.x/pixelRatio,
                height: size.y/pixelRatio,
                ...fadeInOut,
            }}
        >
            {currentAsset.type === "image" ||
            currentAsset.type === "thumbnail" ? (
                <img
                    key={currentIndex}
                    src={currentAsset.src}
                    alt={currentAsset.alt ?? ""}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
            ) : currentAsset.type === "video" ? (
                <video
                    key={currentIndex}
                    src={currentAsset.src}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    controls
                    autoPlay
                />
            ) : null}
        </animated.div>
    );
}

export default MediaViewer;
