import "./RoomScene.scss"

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import Room from "./Room";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import Stars from "./Stars";

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
            >
                <color attach="background" args={['#141414']} />
                <Suspense fallback={null}>
                    <Room />
                    <CameraRig />
                    <Stars/>
                </Suspense>

                <EffectComposer>
                    <Bloom mipmapBlur
                        luminanceThreshold={1.1}
                        luminanceSmoothing={0.1}
                        intensity={0.5}
                        radius={0.4}
                        levels={8}
                    />
                </EffectComposer>

            </Canvas>
        </div>
    );
}

export default RoomScene;
