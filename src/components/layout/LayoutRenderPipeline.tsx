import Postprocessing from "../postprocessing/Postprocessing";

import AsciiLayoutScene from "./ascii/AsciiLayoutScene";

import {
    Mesh,
    NearestFilter,
    PerspectiveCamera,
    Scene,
    TextureLoader,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import { ScrollControls, useFBO } from "@react-three/drei";
import MainLayoutScene from "./main/MainLayoutScene";
import {
    createPortal,
    useFrame,
    useLoader,
    useThree,
} from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";

import useAsciiRenderStore from "../../stores/asciiRenderStore";
import createAsciiShaderMaterial from "../postprocessing/AsciiShaderMaterial";

//* ----------------------------------------------------------------------------------------------
//* Layout Render Pipeline - Renders main layout scene and ascii scene with shader pass.
//*     - Renders the ascii scene to a pixelated fbo then applies ascii pass.
//*     - Draws the resulting pass in a plane covering the camera view over the main layout scene.
//  TODO - Add a second fbo for main layout scene transitions (mix current and next in shader)
//* ----------------------------------------------------------------------------------------------

function LayoutRenderPipeline() {
    const { gl, size, viewport } = useThree();

    // ---- STATES ----
    const asciiAtlasSrc = useAsciiRenderStore((state) => state.asciiAtlasSrc);
    const gridSize = useAsciiRenderStore((state) => state.gridSize);
    const atlasGridSize = useAsciiRenderStore((state) => state.atlasGridSize);
    const charSize = useAsciiRenderStore((state) => state.charSize);
    const glyphSoftness = useAsciiRenderStore((state) => state.glyphSoftness);
    const glyphThreshold = useAsciiRenderStore((state) => state.glyphThreshold);

    // ---- LOAD ASCII ATLAS
    const asciiAtlas = useLoader(TextureLoader, asciiAtlasSrc);

    // set texture properties
    useEffect(() => {
        asciiAtlas.generateMipmaps = false;
        asciiAtlas.magFilter = NearestFilter;
        asciiAtlas.minFilter = NearestFilter;
        asciiAtlas.needsUpdate = true;
    }, [asciiAtlas]);

    // ---- SCENES ----
    const asciiScene = useMemo(() => new Scene(), []);
    const fullScreenPlane = useRef<Mesh>(null);

    // ---- RENDER TARGETS ----
    const asciiRenderTarget = useFBO(gridSize.cols, gridSize.rows, {
        minFilter: NearestFilter, //
        magFilter: NearestFilter,
        generateMipmaps: false,
    });

    // ---- CAMERAS ----
    const asciiCamera = useMemo(() => {
        const cam = new PerspectiveCamera(
            45,
            size.width / size.height,
            0.1,
            40,
        );
        cam.position.z = 10;
        return cam;
    }, [size.width, size.height]);

    // ---- ASCII PASS ----
    const asciiShaderMaterial = useMemo(
        () =>
            createAsciiShaderMaterial(
                asciiAtlas,
                atlasGridSize,
                gridSize,
                charSize,
                glyphThreshold,
                glyphSoftness,
            ),
        [
            asciiAtlas,
            gridSize.cols,
            gridSize.rows,
            atlasGridSize.cols,
            atlasGridSize.rows,
            charSize.w,
            charSize.h,
            glyphThreshold,
            glyphSoftness,
        ],
    );
    // dispose
    useEffect(() => {
        return () => {
            asciiShaderMaterial.uniforms.uPixelizedTex.value = null;
            asciiShaderMaterial.dispose();
        };
    }, [asciiShaderMaterial]);

    // ---- RENDER LOOP ----
    useFrame(() => {
        if (!asciiAtlas.image) return;

        const atlasReady = asciiAtlas.image.width && asciiAtlas.image.height;
        if (!atlasReady) return;

        if (!fullScreenPlane.current || asciiScene.children.length === 0)
            return;

        gl.autoClear = false;

        // Render ascii scene to render target
        gl.setRenderTarget(asciiRenderTarget);
        gl.clear();

        // Render layer containing main elements
        asciiCamera.layers.set(0);
        gl.render(asciiScene, asciiCamera);
        gl.clearDepth();

        // Render layer containing fixed elements
        asciiCamera.layers.set(1);
        gl.render(asciiScene, asciiCamera);
        asciiCamera.layers.enableAll();

        gl.setRenderTarget(null);

        // Set render target uniform for ascii pass
        asciiShaderMaterial.uniforms.uPixelizedTex.value =
            asciiRenderTarget.texture;
    }, 0);

    return (
        <>
            <ScrollControls
                pages={10}
                distance={0.2 / window.devicePixelRatio}
                damping={0.2}
            >
                {/* Main Layout Scene */}
                <MainLayoutScene />

                {/* Ascii Layout Scene Portal */}
                {createPortal(<AsciiLayoutScene />, asciiScene)}
            </ScrollControls>

            {/* Ascii Pass */}
            <mesh renderOrder={100} ref={fullScreenPlane}>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <primitive
                    key={asciiShaderMaterial.uuid}
                    object={asciiShaderMaterial}
                    attach="material"
                />
            </mesh>

            {/* Apply postprocessing effects*/}

            <EffectComposer>
                <Postprocessing></Postprocessing>
            </EffectComposer>
        </>
    );
}

export default LayoutRenderPipeline;
