import "./HeroScene.scss"

import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Euler, Vector3 } from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";

useGLTF.preload('/hero_scene_blockout.glb');

const focal = 50     // Blender focal length
const sensor = 36 // Blender's sensor width
const aspect = 16 / 9
const cameraPos = new Vector3(0, 1.14, 6);
const cameraRot = new Euler(degToRad(-2), 0, 0);

export function SceneCamera() {
    const hFov = 2 * Math.atan(sensor / 2 / focal)
    const fov = radToDeg(2 * Math.atan(Math.tan(hFov / 2) / aspect));

    return <PerspectiveCamera makeDefault rotation={cameraRot} position={cameraPos} fov={fov} />
}

function Room() {
    const { scene } = useGLTF('/hero_scene_blockout.glb')
    return <primitive object={scene} />
}

function HeroScene({ active, paused = false }: { active: boolean; paused?: boolean }) {
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
            className={`hero__scene${active ? " hero__scene--visible" : ""}${active ? "" : " hero__scene--parked"}`}
        >
            <Canvas
                dpr={[1, 1.5]}
                frameloop={active && inView && !paused ? "always" : "never"}
            >
                <SceneCamera />
                <ambientLight intensity={1} />
                <directionalLight position={[2, 4, 3]} intensity={2} />

                <Suspense fallback={null}>
                    <Room />
                </Suspense>

            </Canvas>
        </div>
    );
}

export default HeroScene;
