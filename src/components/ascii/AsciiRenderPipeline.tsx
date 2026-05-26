import {
    Mesh,
    NearestFilter,
    PerspectiveCamera,
    Scene,
    Texture,
    type Object3D,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFBO } from "@react-three/drei";

import { useFrame, useThree } from "@react-three/fiber";

import createAsciiShaderMaterial from "./AsciiShaderMaterial";
import useAsciiRenderStore from "../../stores/asciiRenderStore";

// Prevent the fullscreen quad from blocking pointer events
const noopRaycast: Object3D["raycast"] = () => {};

type AsciiRenderPipelineProps = {
    scene: Scene;
    atlas: Texture;
    gridSize: {
        cols: number;
        rows: number;
    };
    atlasGridSize: {
        cols: number;
        rows: number;
    };
    charSize: {
        w: number;
        h: number;
    };
    glyphSoftness: number;
    glyphThreshold: number;
};

function AsciiRenderPipeline({
    scene,
    gridSize,
    atlas,
    atlasGridSize,
    glyphSoftness,
    glyphThreshold,
    charSize,
}: AsciiRenderPipelineProps) {
    const { gl, size, viewport } = useThree();
    const fullScreenPlane = useRef<Mesh>(null);

    const setViewportCellSize = useAsciiRenderStore(
        (s) => s.setViewportCellSize,
    );

    // ---- SET ATLAS CONFIG ----
    useEffect(() => {
        atlas.generateMipmaps = false;
        atlas.magFilter = NearestFilter;
        atlas.minFilter = NearestFilter;
        atlas.needsUpdate = true;
    }, [atlas]);

    // ---- RENDER TARGETS ----
    const asciiRenderTarget = useFBO(gridSize.cols, gridSize.rows, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        generateMipmaps: false,
    });

    const forcedAsciiRenderTarget = useFBO(gridSize.cols, gridSize.rows, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        generateMipmaps: false,
    });

    // ---- CAMERA ----
    const camera = useMemo(() => {
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
                atlas,
                atlasGridSize,
                gridSize,
                charSize,
                glyphThreshold,
                glyphSoftness,
            ),
        [
            atlas,
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

    // dispose shader material
    useEffect(() => {
        return () => {
            asciiShaderMaterial.uniforms.uPixelizedTex.value = null;
            asciiShaderMaterial.dispose();
        };
    }, [asciiShaderMaterial]);

    useEffect(() => {
        setViewportCellSize(viewport.width, viewport.height);
    }, [viewport.width, viewport.height]);

    // ---- RENDER LOOP ----
    useFrame(() => {
        const atlasImage = atlas.image as HTMLImageElement;

        if (!atlasImage) return;
        const atlasReady = !!(atlasImage.width && atlasImage.height);
        if (
            !atlasReady ||
            !fullScreenPlane.current ||
            scene.children.length === 0
        )
            return;

        camera.layers.disableAll();

        // PASS 1 - Normal ascii (layer 0)
        camera.layers.set(0);
        gl.setRenderTarget(asciiRenderTarget);
        gl.clear();
        gl.render(scene, camera);

        // PASS 2 - Forced ascii (layer 1)
        camera.layers.set(1);
        gl.setRenderTarget(forcedAsciiRenderTarget);
        gl.clear();
        gl.render(scene, camera);

        // RESET
        gl.setRenderTarget(null);

        // Set render target uniforms for ascii pass
        asciiShaderMaterial.uniforms.uPixelizedTex.value =
            asciiRenderTarget.texture;
        asciiShaderMaterial.uniforms.uForcedPixelizedTex.value =
            forcedAsciiRenderTarget.texture;
    }, -1);

    return (
        <group>
            <mesh renderOrder={100} ref={fullScreenPlane} raycast={noopRaycast}>
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

export default AsciiRenderPipeline;
