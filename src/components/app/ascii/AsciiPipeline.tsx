import {
    Mesh,
    NearestFilter,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    type Object3D,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFBO } from "@react-three/drei";

import {
    createPortal,
    useFrame,
    useLoader,
    useThree,
} from "@react-three/fiber";

import useAsciiRenderStore from "../../../stores/asciiRenderStore";
import createAsciiShaderMaterial from "./AsciiShaderMaterial";
import AsciiLayoutScene from "./AsciiScene";

/** Fullscreen composite quad should not participate in R3F pointer raycasts */
const noopRaycast: Object3D["raycast"] = () => {};

function AsciiPipeline() {
    const { gl, size, viewport } = useThree();
    const fullScreenPlane = useRef<Mesh>(null);

    const asciiScene = useMemo(() => new Scene(), []);

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

        // Render ascii scene to render target
        gl.setRenderTarget(asciiRenderTarget);
        gl.clear();

        asciiCamera.layers.enableAll();
        gl.render(asciiScene, asciiCamera);

        gl.setRenderTarget(null);

        // Set render target uniform for ascii pass
        asciiShaderMaterial.uniforms.uPixelizedTex.value =
            asciiRenderTarget.texture;
    }, -1);

    return (
        <group>
            {createPortal(<AsciiLayoutScene />, asciiScene)}

            <mesh
                renderOrder={100}
                ref={fullScreenPlane}
                raycast={noopRaycast}
            >
                <planeGeometry args={[viewport.width, viewport.height]} />
                <primitive
                    key={asciiShaderMaterial.uuid}
                    object={asciiShaderMaterial}
                    attach="material"
                    depthTest={false}
                />
            </mesh>
        </group>
    );
}

export default AsciiPipeline;
