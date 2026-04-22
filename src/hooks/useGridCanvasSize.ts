import { useEffect, useRef } from "react";
import { AsciiRenderConfig } from "../components/app/AsciiRenderConfig";

export type CanvasSize = {
    width: number;
    height: number;
    left: number;
    top: number;
};

function useGridCanvasSize() {
    const size = useRef<CanvasSize>({ width: 0, height: 0, left: 0, top: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function updateSize() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Determine the number of columns that fit in the screen + extra
            const gridCols =
                Math.floor(viewportWidth / AsciiRenderConfig.charSize.x) +
                AsciiRenderConfig.extraColumns;
            const gridRows =
                Math.floor(viewportHeight / AsciiRenderConfig.charSize.y) +
                AsciiRenderConfig.extraRows;

            // Update global state for renderer
            AsciiRenderConfig.setGridSize(gridCols, gridRows);

            const canvasWidth = gridCols * AsciiRenderConfig.charSize.x;
            const canvasHeight = gridRows * AsciiRenderConfig.charSize.y;
            const left = (canvasWidth - viewportWidth) / 2;
            const top = (canvasHeight - viewportHeight) / 2;

            // Update size ref
            size.current.width = canvasWidth;
            size.current.height = canvasHeight;
            size.current.left = left;
            size.current.top = top;

            // Update div container size
            const container = containerRef.current;
            if (container) {
                container.style.width = canvasWidth + "px";
                container.style.height = canvasHeight + "px";
                container.style.transform = `translate(${-left}px, ${-top}px)`;
            }
        }

        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return { size, containerRef };
}

export default useGridCanvasSize;
