import { useRef } from "react";

import { Canvas, useFrame } from "@react-three/fiber";

import { Mesh } from "three";
import PostProcessing from "./PostProcessing";

import { Image } from "@react-three/drei";

function RotatingBox() {
    const ref = useRef<Mesh>(null!);

    useFrame((state, delta) => {
        ref.current.rotation.x += delta * 0.5; // rotate on X
        ref.current.rotation.y += delta * 0.8; // rotate on Y
    });

    return (
        <mesh ref={ref}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="green" />
        </mesh>
    );
}

function AsciiCanvas() {


    return (
        <div className="canvas-container">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [-5, 0, 5.5], fov: 45, near: 1, far: 20 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                // flat
            >
                {/* Colors and background */}
                {/* <color attach="background" args={["white"]} /> */}
                <hemisphereLight intensity={4} />
                <spotLight
                    decay={0}
                    position={[10, 20, 10]}
                    angle={0.6}
                    penumbra={1}
                    intensity={4}
                    castShadow
                    shadow-mapSize={1024}
                />

                {/* Objects */}
                <group>
                    <RotatingBox/>
                    <Image url="/cat.jpg" rotation={[0,-Math.PI / 4,0]} position={[2, 0, 1.5]} scale={6}/>
                    <mesh
                        position={[-2, 0, -1.5]}
                        receiveShadow
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <sphereGeometry args={[0.8, 24, 24]} />
                        <meshPhongMaterial color="royalblue" />
                    </mesh>
                </group>
                <PostProcessing />
            </Canvas>
        </div>
    );
}

export default AsciiCanvas;
