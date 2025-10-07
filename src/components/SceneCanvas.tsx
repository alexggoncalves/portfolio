import { Canvas } from "@react-three/fiber";

import AsciiGlyphField from "./AsciiGlyphField";
import PostProcessing from "./Postprocessing/Postprocessing";

import { useEffect, useState } from "react";

import useAsciiStore from "../stores/asciiStore";

function useGridCanvasSize(charSize: number) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function updateSize() {
            setSize({
                width:
                    Math.floor(window.innerWidth / charSize) * charSize -
                    2 * charSize,
                height:
                    Math.floor(window.innerHeight / charSize) * charSize -
                    2 * charSize,
            });
        }

        updateSize(); // run once
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
}

function SceneCanvas({ children }: { children?: React.ReactNode }) {
    const charSize = useAsciiStore((state: any) => {
        return state.charSize;
    });

    const { width, height } = useGridCanvasSize(charSize);

    // Don’t render the Canvas until the browser size is known
    if (width === 0 || height === 0) return null;
    return (
        <div className="canvas-container">
            <Canvas
                shadows
                dpr={2}
                camera={{ position: [0, 0, 10], fov: 45, near: 0.01, far: 20 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                // flat
                style={{
                    width,
                    height,
                    overflow: "hidden"
                }}
            >
                {children}
                <AsciiGlyphField charSize={charSize} />
                <PostProcessing />
            </Canvas>
        </div>
    );
}

export default SceneCanvas;
