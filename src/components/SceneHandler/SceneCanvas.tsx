import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { LinearToneMapping, type Vector2 } from "three";

import PostProcessing from "../Postprocessing/Postprocessing";
import useAsciiStore from "../../stores/asciiStore";

function useGridCanvasSize(
    container: React.RefObject<HTMLElement> | React.RefObject<null>,
    charSize: Vector2,
    pixelRatio: number
) {
    const [size, setSize] = useState({ width: 0, height: 0, left: 0, top: 0 });

    useEffect(() => {
        function updateSize() {
            const scaledWidth = window.innerWidth * pixelRatio;
            const scaledHeight = window.innerHeight * pixelRatio;

            const width = Math.floor(scaledWidth / charSize.x) * charSize.x;
            const height = Math.floor(scaledHeight / charSize.y) * charSize.y;

            const left = Math.floor((width - scaledWidth) / 2);
            const top = Math.floor((height - scaledHeight) / 2);

            setSize({
                width,
                height,
                left,
                top,
            });
        }

        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [charSize.x, charSize.y, container]);

    return size;
}

function SceneCanvas({ children }: { children?: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { charSize, pixelRatio, setCanvasOffset, setCanvasSize } =
        useAsciiStore();

    const { width, height, left, top } = useGridCanvasSize(
        canvasRef,
        charSize,
        pixelRatio
    );

    useEffect(() => {
        setCanvasSize(width, height);
        setCanvasOffset(left, top);
    }, [width, height, left, top]);

    // Don’t render the canvas until the browser size is known
    if (width === 0 || height === 0) return null;

    return (
        <Canvas
            ref={canvasRef}
            shadows
            dpr={[1, 3]}
            camera={{ position: [0, 0, 10], fov: 45, near: 0.01, far: 20 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                toneMapping: LinearToneMapping,
            }}
            // flat
            style={{
                width,
                height,
                overflow: "hidden",
            }}
        >
            {children}
            <PostProcessing />
        </Canvas>
    );
}

export default SceneCanvas;
