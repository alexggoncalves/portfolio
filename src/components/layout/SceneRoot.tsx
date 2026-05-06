import { Canvas, type CanvasProps } from "@react-three/fiber";
import { LinearToneMapping, OrthographicCamera } from "three";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import LayoutRenderPipeline from "./LayoutRenderPipeline";
import { useMemo } from "react";
// import usePageManager from "../../hooks/usePageManager";

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
        toneMapping: LinearToneMapping,
        localClippingEnabled: true
    },
    // flat: true,
    style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        inset: "0",
        touchAction: "none"
    },
} as CanvasProps;

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function SceneRoot() {
    const { containerRef } = useAsciiRenderTargets();


    return (
        <>
            <div ref={containerRef} style={{ overflow: "hidden" }} >
                <Canvas {...canvasProps} >
                    <LayoutRenderPipeline />
                </Canvas>
            </div>
        </>
    );
}

export default SceneRoot;
