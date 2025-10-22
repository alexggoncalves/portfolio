import { Canvas } from "@react-three/fiber";

import AsciiGlyphField from "./AsciiGlyphField";
import PostProcessing from "./Postprocessing/Postprocessing";

import { useEffect, useState, useRef, useLayoutEffect } from "react";

import useAsciiStore from "../stores/asciiStore";

import { Perf } from "r3f-perf";

import FontBrightnessSorter from "./Brightness";

import { LinearToneMapping, type Vector2 } from "three";

function useGridCanvasSize(
    charSize: Vector2,
    container: React.RefObject<HTMLElement> | React.RefObject<null>
) {
    const [size, setSize] = useState({ width: 0, height: 0, left: 0, top: 0 });

    useEffect(() => {
        function updateSize() {
            const width =
                Math.floor(window.innerWidth / charSize.x) * charSize.x +
                2 * charSize.x;
            const height =
                Math.floor(window.innerHeight / charSize.y) * charSize.y +
                2 * charSize.y;

            let left = (width - window.innerWidth)/2;
            let top = (height - window.innerHeight)/2;

            setSize({
                width,
                height,
                left,
                top,
            });
        }

        updateSize(); // run once
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [charSize.x, charSize.y, container]);

    return size;
}

function SceneCanvas({ children }: { children?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const setCanvasOffset = useAsciiStore((state) => state.setCanvasOffset);
    const charSize = useAsciiStore((state: any) => state.charSize);

    const { width, height, left, top } = useGridCanvasSize(
        charSize,
        canvasRef
    );

    useEffect(() => {
        setCanvasOffset(left, top);
    }, [width, height, left, top, setCanvasOffset]);

    // Don’t render the Canvas until the browser size is known
    if (width === 0 || height === 0) return null;

    return (
        <div ref={containerRef} className="canvas-container">
            {/* <FontBrightnessSorter/> */}
            <Canvas
                ref={canvasRef}
                shadows
                dpr={[1,2]}
                camera={{ position: [0, 0, 10], fov: 45, near: 0.01, far: 20 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: LinearToneMapping,
                }}
                flat
                style={{
                    width,
                    height,
                    overflow: "hidden",
                }}
            >
                {/* <Perf position="top-left" /> */}

                {children}

                <AsciiGlyphField charSize={charSize} />
                <PostProcessing />
            </Canvas>
        </div>
    );
}

export default SceneCanvas;
