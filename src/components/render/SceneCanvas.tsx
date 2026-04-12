import { Canvas } from "@react-three/fiber";
import { LinearToneMapping } from "three";

import useGridCanvasSize from "../../hooks/useGridCanvasSize";

function SceneCanvas({ children }: { children?: React.ReactNode }) {

    const { width, height } = useGridCanvasSize();

    // Don’t render the canvas until the browser size is known
    if (width === 0 || height === 0) return null;

    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 10], fov: 45, near: 0.01, far: 20 }}
            gl={{
                antialias: true,
                alpha: true,
                // powerPreference: "high-performance",
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
