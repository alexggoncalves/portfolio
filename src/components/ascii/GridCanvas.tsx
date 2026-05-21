import { useEffect, useRef, type ReactElement } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import useAsciiRenderStore from "../../stores/asciiRenderStore";
import { NoToneMapping } from "three";

export type CanvasSize = {
    width: number;
    height: number;
    left: number;
    top: number;
};

const canvasProps = {
    shadows: true,
    camera: {
        position: [0, 0, 10],
        fov: 45,
        near: 0.01,
        far: 20,
    },
    gl: {
        antialias: true,
        alpha: true,
        toneMapping: NoToneMapping,
        localClippingEnabled: true,
    },
    dpr: [2, 3],
    style: {
        width: "100%",
        height: "100%",
        touchAction: "none",
        pointerEvents: "none",
    },
} as CanvasProps;

type GridContainerProps = {
    children: ReactElement<CanvasProps, typeof Canvas>;
    cellWidth: number;
    cellHeight: number;
};

//* --------------------------------------------------------------------------------------------
//* Grid Canvas Container: Creates as canvas and keeps it centered and with the integer size of a grid
//* --------------------------------------------------------------------------------------------
function GridCanvas({
    children,
    cellWidth,
    cellHeight,
}: GridContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const lastSize = useRef({ cols: 0, rows: 0 });

    useEffect(() => {
        function updateSize() {
            const viewportWidth = Math.round(window.innerWidth);
            const viewportHeight = Math.round(window.innerHeight);

            const { extraColumns, extraRows, setGridSize } =
                useAsciiRenderStore.getState();

            // Determine the number of columns that fit in the screen
            const cols = Math.floor(viewportWidth / cellWidth) + extraColumns;
            const rows = Math.floor(viewportHeight / cellHeight) + extraRows;

            // Stop update if the size of the grid is unchanged
            if (
                lastSize.current.cols === cols &&
                lastSize.current.rows === rows
            )
                return;

            // Update last size for next resize
            lastSize.current = { cols: cols, rows: rows };

            // Update ascii store with new grid size
            setGridSize(cols, rows);

            // Calculate the size of the canvas
            const canvasWidth = cols * cellWidth;
            const canvasHeight = rows * cellHeight;

            // Calculate the position of the canvas to center it in the viewport
            const offsetX = Math.floor((viewportWidth - canvasWidth) / 2);
            const offsetY = Math.floor((viewportHeight - canvasHeight) / 2);

            // Center and update the size of the container
            const container = containerRef.current;
            if (container) {
                container.style.position = "fixed";
                container.style.top = "0";
                container.style.left = "0";
                container.style.width = `${canvasWidth}px`;
                container.style.height = `${canvasHeight}px`;
                container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
        }
        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [cellWidth, cellHeight]);

    return (
        <>
            <div
                ref={containerRef}
                className="ascii-canvas-layer"
                style={{
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                <Canvas
                    {...canvasProps}
                    eventSource={
                        typeof document !== "undefined" ? document.body : undefined
                    }
                    eventPrefix="client"
                >
                    {children}
                </Canvas>
            </div>
        </>
    );
}

export default GridCanvas;
