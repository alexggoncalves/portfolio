import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
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

function MainScene() {
    return (
        <group>
            {/* Colors and background */}
            {/* <color attach="background" args={["black"]} /> */}
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

            <RotatingBox />
            <Image
                url="/cat.jpg"
                rotation={[0, -Math.PI / 4, 0]}
                position={[2, 0, 1.5]}
                scale={6}
            />
            <mesh
                position={[-2, 0, -1.5]}
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <sphereGeometry args={[0.8, 24, 24]} />
                <meshPhongMaterial color="royalblue" />
            </mesh>
        </group>
    );
}

export default MainScene;
