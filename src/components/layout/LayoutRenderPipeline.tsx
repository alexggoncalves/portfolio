import Postprocessing from "../app/postprocessing/Postprocessing";

import AsciiLayoutScene from "./AsciiLayoutScene";

import { CanvasTexture, LinearFilter, PerspectiveCamera, Scene } from "three";
import { useEffect, useMemo, useRef } from "react";
import { ScrollControls, useFBO } from "@react-three/drei";
import MainLayoutScene from "./MainLayoutScene";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { AsciiRenderConfig } from "../app/config/AsciiRenderConfig";
import { useLocation } from "react-router";

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function LayoutRenderPipeline({
    ascii,
}: {
    ascii: React.RefObject<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>;
}) {
    const { gl, size, camera } = useThree();

    // Initialize the page manager state
    const location = useLocation();
    // const { currentPage, nextPage, nav } = usePageManager(location);

    const uiScene = useRef<Scene>(new Scene());

    const uiCamera = useMemo(() => {
        // const aspectRatio = size.width / size.height;
        // const cam = new OrthographicCamera(
        //     -aspectRatio,
        //     aspectRatio,
        //     1,
        //     -1,
        //     1,
        //     1000,
        // );

        const cam = new PerspectiveCamera(
            45,
            size.width / size.height,
            1,
            1000,
        );

        cam.position.z = 10;
        return cam;
    }, [size]);

    const layoutRenderTarget = useFBO(size.width, size.height, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
    });

    // Render layout to render target every frame
    useFrame(() => {
        if (!uiScene.current) return;
        if (uiScene.current.children.length === 0) return;

        gl.setRenderTarget(layoutRenderTarget);
        gl.setClearColor(AsciiRenderConfig.bgColor, 1);
        gl.clear(true, true, true);

        gl.render(uiScene.current, uiCamera);

        gl.setClearColor("#000000", 1);
        gl.setRenderTarget(null);
    });

    useEffect(() => {
        layoutRenderTarget.setSize(
            size.width * devicePixelRatio,
            size.height * devicePixelRatio,
        );
    }, [size]);

    return (
        <>
            <ScrollControls pages={10} distance={0.2}>
                {createPortal(<MainLayoutScene />, uiScene.current)}

                <AsciiLayoutScene />
            </ScrollControls>

            {/* Create and draw ascii ui and background to textures */}
            {/* (Textures get saved on global App State) */}
            {/* <AsciiLayoutRenderer
                        currentPage={currentPage}
                        nextPage={nextPage}
                        nav={nav}
                        size={size}
                        asciiRenderTarget={ascii}
                        backgroundRenderTarget={bg}
                    /> */}

            {/* 3D Scene */}
            {/* (This scene will be converted to ascii by the Ascii shader) */}

            {/* Apply ascii+background shader pass and postprocessing effects*/}
            <Postprocessing
                asciiUITexture={ascii.current.texture}
                layoutRenderTarget={layoutRenderTarget.texture}
            />
        </>
    );
}

export default LayoutRenderPipeline;
