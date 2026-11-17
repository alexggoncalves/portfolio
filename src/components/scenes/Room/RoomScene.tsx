import "./RoomScene.scss"

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import Room from "./Room";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import Stars from "./Dynamic/Stars";
import { Preload } from "@react-three/drei";
import useSceneStore from "../../../stores/sceneStore";
import FocusDepthOfField from "./FocusDepthOfField";

const SceneReady = () => {
    const setReady = useSceneStore(s => s.setReady)
    useEffect(() => { setReady() }, [])
    return null
}

function RoomScene({ active, paused = false }: { active: boolean; paused?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={`room__scene${active ? " room__scene--visible" : ""}${active ? "" : " room__scene--parked"}`}
        >
            <Canvas
                dpr={[1, 2]}
                frameloop={active && inView && !paused ? "always" : "never"}
                flat
                eventSource={document.getElementById("root")!}
                eventPrefix="client"
            >
                <color attach="background" args={['#141414']} />

                <Suspense fallback={null}>
                    <Room />
                    <CameraRig />
                    <Stars />
                    <Preload all />
                    <SceneReady />
                </Suspense>

                <EffectComposer multisampling={0} autoClear={false}>
                    <Bloom
                        mipmapBlur
                        luminanceThreshold={1.1}
                        luminanceSmoothing={0.1}
                        intensity={0.5}
                        radius={0.4}
                        levels={4}
                    />
                    <FocusDepthOfField/>
                </EffectComposer>

            </Canvas>
        </div>
    );
}

export default RoomScene;
