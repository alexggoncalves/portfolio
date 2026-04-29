import { useEffect, useRef } from "react";
import { CanvasTexture } from "three";
import {
    createAsciiRenderTarget,
    createBgRenderTarget,
} from "../utils/createRenderTargets";

import { AsciiRenderConfig } from "../components/app/AsciiRenderConfig";

export type CanvasSize = {
    width: number;
    height: number;
    left: number;
    top: number;
};

function useAsciiRenderTargets() {
    const prev = useRef({ cols: 0, rows: 0 });

    const size = useRef<CanvasSize>({ width: 0, height: 0, left: 0, top: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    const ascii = useRef<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>({ texture: null, context: null });

    const bg = useRef<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>({ texture: null, context: null });

    useEffect(() => {
        function updateRenderTargets() {
            
            // Calculate ascii grid size
            const gridWidth = Math.floor(
                size.current.width / AsciiRenderConfig.charSize.x,
            );
            const gridHeight = Math.floor(
                size.current.height / AsciiRenderConfig.charSize.y,
            );

            // Create a render target to draw ASCII on the GPU
            const uiRenderTarget = createAsciiRenderTarget(
                gridWidth,
                gridHeight,
            );

            // Create a render target to draw background behind the ascii on the GPU
            const bgRenderTarget = createBgRenderTarget(
                size.current.width,
                size.current.height,
            );

            ascii.current = {
                texture: uiRenderTarget.texture,
                context: uiRenderTarget.context,
            };
            bg.current = {
                texture: bgRenderTarget.texture,
                context: bgRenderTarget.context,
            };
            
        }

        function updateSize() {
            const viewportWidth = Math.round(window.innerWidth);
            const viewportHeight = Math.round(window.innerHeight);

            // Determine the number of columns that fit in the screen + extra
            const gridCols =
                Math.floor(viewportWidth / AsciiRenderConfig.charSize.x) +
                AsciiRenderConfig.extraColumns;
            const gridRows =
                Math.floor(viewportHeight / AsciiRenderConfig.charSize.y) +
                AsciiRenderConfig.extraRows;

            if (
                prev.current.cols === gridCols &&
                prev.current.rows === gridRows
            ) {
                return;
            }

            prev.current = { cols: gridCols, rows: gridRows };

            // Update global state for renderer
            AsciiRenderConfig.setGridSize(gridCols, gridRows);

            const canvasWidth = gridCols * AsciiRenderConfig.charSize.x;
            const canvasHeight = gridRows * AsciiRenderConfig.charSize.y;
            const left = Math.floor((canvasWidth - viewportWidth) / 2);
            const top = Math.floor((canvasHeight - viewportHeight) / 2);

            // Update size ref

            size.current.width = canvasWidth;
            size.current.height = canvasHeight;
            size.current.left = left;
            size.current.top = top;

            // Update div container size
            const container = containerRef.current;
            if (container) {
                container.style.position = "fixed";
                container.style.top = "0";
                container.style.left = "0";
                container.style.width = canvasWidth + "px";
                container.style.height = canvasHeight + "px";
                container.style.transform = `translate(${-left}px, ${-top}px)`;
            }

            updateRenderTargets();
        }

        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return { ascii, bg, size, containerRef };
}

export default useAsciiRenderTargets;
