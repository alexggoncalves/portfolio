import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";

import Postprocessing from "../postprocessing/Postprocessing";

import SceneRenderer from "../3Dscenes/SceneRenderer";

import usePageManager from "../../hooks/usePageManager";
import AsciiLayoutRenderer from "./AsciiLayoutRenderer";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { LinearToneMapping } from "three";
import useGridCanvasSize from "../../hooks/useGridCanvasSize";

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
    },
    flat: true,
    style: {
        width: "100%",
        height: "100%",
    },
} as CanvasProps;

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function AsciiSceneStage() {
    const location = useLocation();
    const { isMobile } = useSceneStore();

    // Initialize the page manager state
    const { size, containerRef } = useGridCanvasSize();
    const { currentPage, nextPage, nav } = usePageManager(location, isMobile);

    return (
        <>
            <div ref={containerRef} style={{ overflow: "hidden" }}>
                <Canvas {...canvasProps} >
                    {/* 3D Scene */}
                    {/* (This scene will be converted to ascii by the Ascii shader) */}
                    <SceneRenderer />

                    {/* Create and draw ascii ui and background to textures */}
                    {/* (Textures get saved on global App State) */}
                    <AsciiLayoutRenderer
                        currentPage={currentPage}
                        nextPage={nextPage}
                        nav={nav}
                        size={size}
                    />

                    {/* Apply ascii+background shader pass and postprocessing effects*/}
                    <Postprocessing />
                </Canvas>
            </div>
        </>
    );
}

export default AsciiSceneStage;
