import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { LinearToneMapping } from "three";

import useAsciiStore from "../../stores/asciiStore";
import useGridCanvasSize from "../../hooks/useGridCanvasSize";

function SceneCanvas({ children }: { children?: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {
        charSize,
        setCanvasOffset,
        setPixelRatio
    } = useAsciiStore();

    const { width, height, left, top } = useGridCanvasSize(
        charSize,
    );

    useEffect(() => {
        setCanvasOffset(left, top);
    }, [width, height, left, top]);

    useEffect(() => {
        setPixelRatio(devicePixelRatio);
    }, [devicePixelRatio]);

    // Don’t render the canvas until the browser size is known
    if (width === 0 || height === 0) return null;

    return (
        <Canvas
            ref={canvasRef}
            shadows
            dpr={devicePixelRatio}
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
        </Canvas>
    );
}

export default SceneCanvas;
