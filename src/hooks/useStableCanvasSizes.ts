import { useEffect } from "react";

// Set stable sizes for canvases (ignore the mobile toolbar showing and hiding)
const useStableCanvasSizes = () => {
    useEffect(() => {
        let lastWidth = 0;

        const setSizes = () => {
            if (window.innerWidth === lastWidth) return; // toolbar show/hide only changes height
            lastWidth = window.innerWidth;

            const root = document.documentElement.style;
            root.setProperty("--canvas-height", `${Math.max(window.innerHeight, window.screen.height)}px`);
            root.setProperty("--hero-height", `${window.innerHeight}px`);
        };

        setSizes();
        window.addEventListener("resize", setSizes);
        return () => window.removeEventListener("resize", setSizes);
    }, []);
}

export default useStableCanvasSizes;