// LayoutRenderPipeline.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useFBO } from "@react-three/drei";
import { useLocation } from "react-router";
import { Color, Mesh, MeshBasicMaterial, Scene } from "three";
import AsciiLayoutScene from "./ascii/AsciiLayoutScene";
import AsciiPipeline from "./AsciiPipeline";
import RouteScene from "./main/RouteScene";
import Nav from "./main/nav/Nav";
import useAsciiRenderStore from "../../stores/asciiRenderStore";

const TRANSITION_DURATION = 0.8;

function LayoutRenderPipeline() {
    const location = useLocation();
    const asciiScene = useMemo(() => new Scene(), []);
    const bgColor = useAsciiRenderStore((s) => s.bgColor);
    const { gl } = useThree();

    useEffect(() => {
        gl.setClearColor(new Color(bgColor), 1);
    }, [gl, bgColor]);


    // The path RouteScene is currently rendering
    const [activePath, setActivePath] = useState(location.pathname);

    // Pending path waiting for the capture to happen
    const pendingPath = useRef<string | null>(null);

    // FBO storing the frozen outgoing frame
    const frozenFBO = useFBO();

    // The fullscreen plane that shows the frozen frame
    const frozenPlane = useRef<Mesh>(null);

    // Fade-out progress: null = not transitioning
    const transitionStart = useRef<number | null>(null);

    // Detect location changes and queue a pending path
    const prevPathname = useRef(location.pathname);
    useEffect(() => {
        if (location.pathname !== prevPathname.current) {
            pendingPath.current = location.pathname;
            prevPathname.current = location.pathname;
        }
    }, [location.pathname]);

    useFrame(({ gl, scene, camera, clock }) => {
        const plane = frozenPlane.current;

        // ── 1. Pending transition: capture current frame ──────────────────────
        if (pendingPath.current !== null) {
            const targetPath = pendingPath.current;
            pendingPath.current = null;

            // Hide frozen overlay while capturing to avoid recursive snapshots.
            if (plane) plane.visible = false;

            // Render current scene into the FBO before the route changes
            gl.setRenderTarget(frozenFBO);
            gl.clear();
            gl.render(scene, camera);
            gl.setRenderTarget(null);

            // Show the frozen plane
            if (plane) {
                plane.visible = true;
                const mat = plane.material as MeshBasicMaterial;
                mat.map = frozenFBO.texture;
                mat.opacity = 1;
                mat.needsUpdate = true;
            }

            // Swap the active route — new scene starts rendering underneath
            setActivePath(targetPath);
            transitionStart.current = clock.elapsedTime;
        }

        // ── 2. Active transition: fade out the frozen plane ───────────────────
        if (transitionStart.current !== null && plane?.visible) {
            const elapsed = clock.elapsedTime - transitionStart.current;
            const t = Math.min(elapsed / TRANSITION_DURATION, 1);
            const mat = plane.material as MeshBasicMaterial;
            mat.opacity = 1 - t;

            if (t >= 1) {
                plane.visible = false;
                transitionStart.current = null;
            }
        }
    });

    const { viewport } = useThree();

    return (
        <>
            <ScrollControls
                pages={10}
                distance={0.2 / window.devicePixelRatio}
                damping={0.2}
            >
                <RouteScene path={activePath} />
                {createPortal(<AsciiLayoutScene />, asciiScene)}
            </ScrollControls>

            {/* Frozen outgoing frame — sits above everything, fades out */}
            <mesh ref={frozenPlane} renderOrder={70} visible={false}>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <meshBasicMaterial
                    transparent
                    depthTest={false}
                    depthWrite={false}
                />
            </mesh>

            <AsciiPipeline asciiScene={asciiScene} />
            <Nav />
            {/* <Postprocessing /> */}
        </>
    );
}

export default LayoutRenderPipeline;
